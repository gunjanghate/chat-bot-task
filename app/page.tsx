"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import ChatUI from "@/components/ChatUI";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <AnimatePresence>
        {!session ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="bg-white shadow-xl rounded-xl p-8 flex flex-col items-center w-full max-w-sm"
          >
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Sign in to Chat</h1>
            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-2 bg-black/80 hover:bg-black text-white font-medium py-2 rounded-lg transition"
            >
                <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path fill="#4285F4" d="M43.611 20.083h-1.861V20H24v8h11.303c-1.627 4.657-6.084 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c2.938 0 5.625 1.044 7.747 2.773l5.657-5.657C34.084 7.044 29.284 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.045 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"/>
                  <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.104 19.009 13 24 13c2.938 0 5.625 1.044 7.747 2.773l5.657-5.657C34.084 7.044 29.284 5 24 5c-7.18 0-13.31 4.13-16.694 10.191z"/>
                  <path fill="#FBBC05" d="M24 45c5.284 0 10.084-2.044 13.747-5.773l-6.571-5.391C29.625 35.956 26.938 37 24 37c-5.219 0-9.676-3.343-11.303-8l-6.571 5.391C10.69 42.87 16.82 47 24 47z"/>
                  <path fill="#EA4335" d="M43.611 20.083h-1.861V20H24v8h11.303c-1.045 2.991-3.417 5.343-6.303 6.391l6.571 5.391C39.084 42.956 43.611 34.956 43.611 25c0-1.341-.138-2.651-.389-3.917z"/>
                </g>
                </svg>
              Sign in with Google
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="bg-white shadow-2xl rounded-2xl min-w-screen flex flex-col"
          >
            <div className="flex items-center justify-between border-b px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-blue-600">
                  {session.user?.name?.[0] || "U"}
                </div>
                <span className="font-semibold text-gray-800">Welcome, {session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-red-500 transition"
              >
                Sign out
              </button>
            </div>
            <div className="bg-gray-50 rounded-b-2xl">
              <ChatUI />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
