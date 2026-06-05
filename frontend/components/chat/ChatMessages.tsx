"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ChatMessage } from "@/hooks/use-chat";

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  username: string;
}

export function ChatMessages({ messages, username }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAF8] px-4 py-5 no-scrollbar">
      {messages.length === 0 ? (
        <EmptyRoom />
      ) : (
        <div className="space-y-2">
          {messages.map((msg, i) => {
            if (msg.type === "system") {
              return <SystemBubble key={msg.id} text={msg.text} />;
            }
            if (msg.type === "prediction") {
              return (
                <PredictionBubble
                  key={msg.id}
                  msg={msg}
                  isMine={msg.username === username}
                  index={i}
                />
              );
            }
            return (
              <ChatBubble
                key={msg.id}
                msg={msg}
                isMine={msg.username === username}
                index={i}
              />
            );
          })}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyRoom() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-[#4F7DF3]/10 flex items-center justify-center mb-3">
        <Sparkles className="w-6 h-6 text-[#4F7DF3]" />
      </div>
      <p className="text-sm font-semibold text-[#1F2937] mb-1">You joined the room</p>
      <p className="text-xs text-[#9CA3AF]">Be the first to say something.</p>
    </div>
  );
}

// ─── System message ───────────────────────────────────────────────────────────

function SystemBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-center my-3">
      <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-3 py-1 rounded-full">
        {text}
      </span>
    </div>
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────

function ChatBubble({
  msg,
  isMine,
  index,
}: {
  msg: ChatMessage;
  isMine: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.15) }}
      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[70%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && msg.username && (
          <span className="text-[11px] font-semibold text-[#9CA3AF] mb-1 px-1">
            {msg.username}
          </span>
        )}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
            isMine
              ? "bg-[#4F7DF3] text-white rounded-2xl rounded-br-md shadow-sm"
              : "bg-white text-[#1F2937] border border-[#E5E7EB] rounded-2xl rounded-bl-md shadow-sm"
          }`}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-[#9CA3AF] mt-1 px-1 select-none">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Prediction bubble ────────────────────────────────────────────────────────

function PredictionBubble({
  msg,
  isMine,
  index,
}: {
  msg: ChatMessage;
  isMine: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.15) }}
      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[70%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && msg.username && (
          <span className="text-[11px] font-semibold text-[#9CA3AF] mb-1 px-1">
            {msg.username}
          </span>
        )}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#6EC6CA]/10 border border-[#6EC6CA]/25 rounded-2xl shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#6EC6CA] flex-shrink-0" />
          <span className="text-sm font-semibold text-[#1F2937] break-words">
            {msg.text}
          </span>
        </div>
        <span className="text-[10px] text-[#9CA3AF] mt-1 px-1 select-none">
          Sign · {formatTime(msg.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}