"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Hash } from "lucide-react";
import { ROOMS, Room } from "./rooms";
import type { ConnStatus } from "@/hooks/use-chat";

interface ChatSidebarProps {
  joinedRoom: string | null;
  status: ConnStatus;
  username: string;
  onJoinRoom: (roomId: string) => void;
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
  const [search, setSearch] = useState("");

  const filtered = ROOMS.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-[300px] flex-shrink-0 bg-white border-r border-[#E5E7EB] flex-col h-full">
        <SidebarInner
          search={search}
          setSearch={setSearch}
          filtered={filtered}
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
              search={search}
              setSearch={setSearch}
              filtered={filtered}
              joinedRoom={joinedRoom}
              status={status}
              username={username}
              onJoinRoom={onJoinRoom}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarInner({
  search,
  setSearch,
  filtered,
  joinedRoom,
  status,
  username,
  onJoinRoom,
}: {
  search: string;
  setSearch: (v: string) => void;
  filtered: Room[];
  joinedRoom: string | null;
  status: ConnStatus;
  username: string;
  onJoinRoom: (id: string) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between mb-0.5">
          <h1 className="text-lg font-bold text-[#1F2937]">Rooms</h1>
          {/* Connection dot */}
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
            Signed in as <span className="font-semibold text-[#6B7280]">{username}</span>
          </p>
        )}
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F7DF3]/20 focus:border-[#4F7DF3] transition-all"
          />
        </div>
      </div>

      <div className="px-5 pb-2">
        <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
          Available Rooms
        </span>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-4 space-y-0.5">
        {filtered.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            isActive={joinedRoom === room.id}
            disabled={status !== "connected"}
            onSelect={() => onJoinRoom(room.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-8 text-sm text-[#9CA3AF]">No rooms found</p>
        )}
      </div>
    </>
  );
}

function RoomItem({
  room,
  isActive,
  disabled,
  onSelect,
}: {
  room: Room;
  isActive: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { x: 2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${
        isActive
          ? "bg-[#4F7DF3]/10 border border-[#4F7DF3]/20"
          : "hover:bg-[#F9FAFB] border border-transparent"
      }`}
    >
      {/* Room icon */}
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${room.bgClass} ${room.textClass}`}
      >
        {room.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold truncate ${
            isActive ? "text-[#4F7DF3]" : "text-[#1F2937]"
          }`}
        >
          {room.name}
        </p>
        <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{room.description}</p>
      </div>

      {isActive && (
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#6BCB77] pulse-dot" />
      )}
    </motion.button>
  );
}
