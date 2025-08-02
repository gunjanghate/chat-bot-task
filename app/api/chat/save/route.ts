import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        console.log("DB connected");

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { messages } = await req.json();
        let chat = await Chat.findOne({ userEmail: session.user?.email });
        if (!chat) chat = new Chat({ userEmail: session.user?.email, messages: [] });
        chat.messages = messages;
        await chat.save();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving chat:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
