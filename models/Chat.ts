import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "bot";
  content: string;
  timestamp?: Date;
}

export interface IChat extends Document {
  userEmail: string;
  messages: IMessage[];
}

const ChatSchema = new Schema<IChat>({
  userEmail: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "bot"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
