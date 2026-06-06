"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import type { ChatMessage } from "@/hooks/use-chat";

// ─── Date helpers ──────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChatMessagesProps {
  messages: ChatMessage[];
  username: string;
  typingUsers?: string[];
}

// ─── Main component ───────────────────────────────────────────────────────────

const SCROLL_THRESHOLD = 120;

export function ChatMessages({ messages, username, typingUsers = [] }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevMsgCountRef = useRef(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [scrollBtnUnread, setScrollBtnUnread] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = dist <= SCROLL_THRESHOLD;
    isAtBottomRef.current = atBottom;
    setShowScrollBtn(!atBottom);
    if (atBottom) setScrollBtnUnread(0);
  };

  useEffect(() => {
    const curr = messages.length;
    const prev = prevMsgCountRef.current;
    prevMsgCountRef.current = curr;

    if (curr < prev) {
      // Room switched — messages cleared
      isAtBottomRef.current = true;
      setShowScrollBtn(false);
      setScrollBtnUnread(0);
      return;
    }
    if (curr === prev) return;

    if (isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setScrollBtnUnread(0);
    } else {
      setScrollBtnUnread((c) => c + (curr - prev));
    }
  }, [messages]);

  // Scroll into view when typing indicator appears
  useEffect(() => {
    if (typingUsers.length > 0 && isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [typingUsers.length]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setScrollBtnUnread(0);
  };

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col bg-[#FAFAF8]">
      {/* Scrollable messages area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-5 no-scrollbar"
      >
        {messages.length === 0 ? (
          <EmptyRoom />
        ) : (
          <div className="space-y-2">
            {messages.map((msg, i) => {
              const prev = i > 0 ? messages[i - 1] : null;
              const showSep =
                !prev ||
                !isSameDay(new Date(prev.timestamp), new Date(msg.timestamp));

              let bubble: ReactNode;
              if (msg.type === "system") {
                bubble = <SystemBubble text={msg.text} />;
              } else if (msg.type === "prediction") {
                bubble = (
                  <PredictionBubble
                    msg={msg}
                    isMine={msg.username === username}
                    index={i}
                  />
                );
              } else {
                bubble = (
                  <ChatBubble
                    msg={msg}
                    isMine={msg.username === username}
                    index={i}
                  />
                );
              }

              return (
                <Fragment key={msg.id}>
                  {showSep && (
                    <DateSeparator label={formatDateLabel(msg.timestamp)} />
                  )}
                  {bubble}
                </Fragment>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {typingUsers.length > 0 && (
            <TypingIndicator key="typing" users={typingUsers} />
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            key="scroll-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white border border-[#E5E7EB] shadow-md flex items-center justify-center hover:bg-[#4F7DF3]/8 transition-colors z-10"
            aria-label="Scroll to latest messages"
          >
            {scrollBtnUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#4F7DF3] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {scrollBtnUnread > 99 ? "99+" : scrollBtnUnread}
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-[#4F7DF3]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Date separator ───────────────────────────────────────────────────────────

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-[#E5E7EB]" />
      <span className="text-[11px] font-medium text-[#9CA3AF] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#E5E7DF]" />
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ users }: { users: string[] }) {
  const label =
    users.length === 1
      ? `${users[0]} is typing...`
      : users.length === 2
      ? `${users[0]} and ${users[1]} are typing...`
      : `${users[0]}, ${users[1]}, and ${users.length - 2} more are typing...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 px-2 pt-2 pb-1"
    >
      <div className="flex gap-[3px] items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-[#9CA3AF]">{label}</span>
    </motion.div>
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
