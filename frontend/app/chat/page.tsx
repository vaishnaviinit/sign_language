"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/use-chat";

export default function ChatPage() {
  const [username, setUsername] = useState<string>("");
  const [usernameReady, setUsernameReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { status, messages, joinedRoom, joinRoom, sendMessage } = useChat();

  useEffect(() => {
    const stored = localStorage.getItem("signsync_username") ?? "";
    setUsername(stored);
    setUsernameReady(true);
  }, []);

  const handleSetUsername = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("signsync_username", trimmed);
    setUsername(trimmed);
  };

  const handleJoinRoom = (roomId: string) => {
    if (!username) return;
    joinRoom(username, roomId);
    setSidebarOpen(false);
  };

  const handleSend = (text: string) => {
    if (!username || !joinedRoom) return;
    sendMessage(username, joinedRoom, text);
  };

  if (!usernameReady) return null;

  return (
    <>
      <Navbar />

      <div
        className="flex overflow-hidden bg-[#FAFAF8]"
        style={{ height: "100vh", paddingTop: "64px" }}
      >
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <ChatSidebar
          joinedRoom={joinedRoom}
          status={status}
          username={username}
          onJoinRoom={handleJoinRoom}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {joinedRoom ? (
            <>
              <ChatHeader
                roomName={joinedRoom}
                username={username}
                status={status}
                onMenuClick={() => setSidebarOpen(true)}
              />
              <ChatMessages messages={messages} username={username} />
              <ChatInput
                onSend={handleSend}
                disabled={status !== "connected"}
              />
            </>
          ) : (
            <RoomPrompt
              status={status}
              onMenuClick={() => setSidebarOpen(true)}
            />
          )}
        </div>
      </div>

      {!username && <UsernameGate onSet={handleSetUsername} />}
    </>
  );
}

// ─── Username gate ────────────────────────────────────────────────────────────

function UsernameGate({ onSet }: { onSet: (name: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSet(value);
  };

  return (
    <div className="fixed inset-0 bg-[#FAFAF8]/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-8"
      >
        <div className="w-14 h-14 bg-[#4F7DF3]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <MessageCircle className="w-7 h-7 text-[#4F7DF3]" />
        </div>
        <h2 className="text-xl font-bold text-[#1F2937] text-center mb-1.5">
          Welcome to SignSync Chat
        </h2>
        <p className="text-sm text-[#6B7280] text-center mb-6 leading-relaxed">
          Enter your name to start communicating with others in real time.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            maxLength={32}
            className="w-full px-4 py-3 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F7DF3]/20 focus:border-[#4F7DF3] transition-all"
          />
          <Button type="submit" className="w-full" size="lg" disabled={!value.trim()}>
            Continue
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── No room selected prompt ──────────────────────────────────────────────────

function RoomPrompt({
  status,
  onMenuClick,
}: {
  status: string;
  onMenuClick: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 text-center bg-[#FAFAF8]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-sm"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-[#4F7DF3]/10 flex items-center justify-center float-animation">
          <MessageCircle className="w-10 h-10 text-[#4F7DF3]" />
        </div>
        <h2 className="text-xl font-bold text-[#1F2937] mb-2">
          Join a room to start communicating.
        </h2>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
          Enter any room name in the sidebar. Anyone with the same room name can chat with you.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              status === "connected"
                ? "bg-[#6BCB77] pulse-dot"
                : status === "connecting"
                ? "bg-[#F59E0B] pulse-dot"
                : "bg-[#EF4444]"
            }`}
          />
          <span className="text-[#6B7280]">
            {status === "connected"
              ? "Server connected"
              : status === "connecting"
              ? "Connecting..."
              : "Server offline — start websocket_server.py"}
          </span>
        </div>

        <button
          onClick={onMenuClick}
          className="md:hidden mt-5 w-full px-5 py-2.5 text-sm font-semibold bg-[#4F7DF3] text-white rounded-xl shadow-sm hover:bg-[#3563D8] transition-colors"
        >
          Open Rooms Panel
        </button>
      </motion.div>
    </div>
  );
}
