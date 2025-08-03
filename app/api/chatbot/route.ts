import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are an expert AI assistant capable of:
- Writing code when asked about programming tasks.
- Explaining academic concepts, general knowledge, math, or having normal conversations clearly.

**Instructions for code-related questions:**
- Give a **brief bullet-point explanation** of the approach.
- Provide **separate code blocks** for each language mentioned, using proper markdown syntax (like \`\`\`python or \`\`\`cpp).
- Separate explanation and code with clear markdown headings.

**Instructions for non-code questions:**
- Respond naturally and conversationally.
- Use markdown for readability when needed (headings, lists, emphasis), but **do not add unnecessary code blocks** unless explicitly required.

User Question:
${message}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
