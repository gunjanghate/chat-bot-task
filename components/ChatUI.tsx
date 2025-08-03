"use client";
import { useState, useEffect } from "react";
import { Send, Bot, User, MessageCircle, Sparkles } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IMessage {
  role: "user" | "bot";
  content: string;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/chat/history");
      const data = await res.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch chat history.");
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: IMessage = { role: "user", content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    setError(null);
    setIsTyping(true);

    try {
      const botResponse = await axios.post("/api/chatbot", {
        message: `Respond in **clean markdown format** with proper formatting and bullet points if needed:\n${input}`,
      });

      const botMessage: IMessage = {
        role: "bot",
        content: botResponse.data.reply,
      };
      const newMessages = [...updated, botMessage];
      setMessages(newMessages);
      setIsTyping(false);

      try {
        await axios.post("/api/chat/save", { messages: newMessages });
      } catch {
        setError("Failed to save chat history.");
      }
    } catch {
      setError("Failed to get response from bot.");
      setMessages(messages);
      setIsTyping(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] py-12 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="flex items-center gap-3 justify-center bg-[#FFDD57] rounded-full px-6 py-3 shadow-md">
          <Sparkles className="w-6 h-6 text-[#2F2E41]" />
          <h1 className="text-2xl font-extrabold text-[#2F2E41]">
            AI Chat Assistant
          </h1>
          <MessageCircle className="w-6 h-6 text-[#2F2E41]" />
        </div>
        <p className="text-[#444] text-lg mt-2">
          Experience the future of conversation with our intelligent chatbot
        </p>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white scroll-smooth w-full max-w-3xl rounded-3xl shadow-xl border border-gray-200 flex flex-col overflow-hidden"
      >
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#F9A826] to-[#E8505B]"
                      : "bg-[#00C2A8]"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm max-w-10/11 overflow-y-auto break-words ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#F9A826] to-[#E8505B] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00C2A8] flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-2xl shadow-sm flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFDD57]"
            style={{ minHeight: "48px" }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-[#00C2A8] hover:bg-[#00A892] text-white p-3 rounded-2xl shadow-md disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
