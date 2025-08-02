import "./globals.css";
import type { Metadata } from "next";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
  title: "Chatbot App",
  description: "Chatbot with Google Auth and chat history",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
