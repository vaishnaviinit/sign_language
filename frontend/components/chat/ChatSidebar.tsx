"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Hash, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConnStatus } from "@/hooks/use-chat";

const STORAGE_KEY = "signsync_recent_rooms";
const MAX_RECENT = 5;

function loadRecentRooms(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentRoom(room: string): void {
  const existing = loadRecentRooms().filter((r) => r !== room);
  const updated = [room, ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

interface ChatSidebarProps {
  joinedRoom: string | null;
  status: ConnStatus;
  username: string;
  onJoinRoom: (room: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({
  joinedRoom,
  status,
  username,
  onJoinRoom,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-[300px] flex-shrink-0 bg-white border-r border-[#E5E7EB] flex-col h-full">
        <SidebarInner
          joinedRoom={joinedRoom}
          status={status}
          username={username}
          onJoinRoom={onJoinRoom}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="md:hidden fixed left-0 top-0 bottom-0 w-[300px] bg-white border-r border-[#E5E7EB] z-40 flex flex-col"
          >
            <div className="flex justify-end px-4 pt-4 pb-1">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-[#6B7280] hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarInner
              joinedRoom={joinedRoom}
              status={status}
              username={username}
              onJoinRoom={(room) => { onJoinRoom(room); onClose(); }}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarInner({
  joinedRoom,
  status,
  username,
  onJoinRoom,
}: {
  joinedRoom: string | null;
  status: ConnStatus;
  username: string;
  onJoinRoom: (room: string) => void;
}) {
  const [input, setInput] = useState("");
  const [recentRooms, setRecentRooms] = useState<string[]>([]);

  useEffect(() => {
    setRecentRooms(loadRecentRooms());
  }, [joinedRoom]); // refresh when room changes

  const handleJoin = (room?: string) => {
    const target = (room ?? input).trim();
    if (!target) return;
    if (target === joinedRoom) return; // already in this room
    saveRecentRoom(target);
    setRecentRooms(loadRecentRooms());
    onJoinRoom(target);
    if (!room) setInput(""); // clear the text input only when submitting from input field
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleJoin();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-0.5">
          <h1 className="text-lg font-bold text-[#1F2937]">Rooms</h1>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                status === "connected"
                  ? "bg-[#6BCB77] pulse-dot"
                  : status === "connecting"
                  ? "bg-[#F59E0B] pulse-dot"
                  : "bg-[#EF4444]"
              }`}
            />
            <span className="text-xs text-[#9CA3AF]">
              {status === "connected"
                ? "Live"
                : status === "connecting"
                ? "Connecting"
                : "Offline"}
            </span>
          </div>
        </div>
        {username && (
          <p className="text-xs text-[#9CA3AF] truncate">
            Signed in as{" "}
            <span className="font-semibold text-[#6B7280]">{username}</span>
          </p>
        )}
      </div>

      {/* Current room indicator */}
      {joinedRoom && (
        <div className="mx-4 mb-4 flex-shrink-0">
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-1.5 px-1">
            Current Room
          </p>
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#4F7DF3]/8 border border-[#4F7DF3]/20 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#6BCB77] pulse-dot flex-shrink-0" />
            <span className="text-sm font-semibold text-[#4F7DF3] truncate flex-1">
              {joinedRoom}
            </span>
          </div>
        </div>
      )}

      {/* Join room form */}
      <div className="px-4 flex-shrink-0">
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2 px-1">
          {joinedRoom ? "Switch Room" : "Join a Room"}
        </p>

        <div className="relative mb-2">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Room name or number..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status !== "connected"}
            maxLength={64}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F7DF3]/20 focus:border-[#4F7DF3] transition-all disabled:opacity-50"
          />
        </div>

        <Button
          onClick={() => handleJoin()}
          disabled={!input.trim() || status !== "connected" || input.trim() === joinedRoom}
          className="w-full"
          size="md"
        >
          <LogIn className="w-4 h-4" />
          {joinedRoom ? "Switch Room" : "Join Room"}
        </Button>
      </div>

      {/* Recent rooms */}
      {recentRooms.length > 0 && (
        <div className="px-4 mt-5 flex-shrink-0">
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2 px-1">
            Recent
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recentRooms.map((room) => (
              <motion.button
                key={room}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleJoin(room)}
                disabled={status !== "connected" || room === joinedRoom}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  room === joinedRoom
                    ? "bg-[#4F7DF3]/10 border-[#4F7DF3]/20 text-[#4F7DF3] cursor-default"
                    : "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280] hover:border-[#4F7DF3]/30 hover:text-[#4F7DF3] hover:bg-[#4F7DF3]/5"
                } disabled:opacity-50`}
              >
                <Hash className="w-3 h-3" />
                {room}
                {room !== joinedRoom && (
                  <ArrowRight className="w-3 h-3 opacity-60" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* How it works hint — only shown when not connected to a room */}
      {!joinedRoom && status === "connected" && (
        <div className="mx-4 mt-auto mb-5 flex-shrink-0">
          <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Type any name — <span className="font-semibold text-[#1F2937]">general</span>,{" "}
              <span className="font-semibold text-[#1F2937]">1</span>,{" "}
              <span className="font-semibold text-[#1F2937]">family</span> — and anyone
              who joins the same name can chat with you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
