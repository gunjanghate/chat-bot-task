import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        console.log("DB connected");
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const chat = await Chat.findOne({ userEmail: session.user?.email });
        return NextResponse.json(chat?.messages || []);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
