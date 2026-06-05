"use client";

import { motion } from "framer-motion";
import { Menu, Wifi, WifiOff } from "lucide-react";
import type { Room } from "./rooms";
import type { ConnStatus } from "@/hooks/use-chat";

interface ChatHeaderProps {
  room: Room;
  status: ConnStatus;
  onMenuClick: () => void;
}

export function ChatHeader({ room, status, onMenuClick }: ChatHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#E5E7EB] shadow-sm flex-shrink-0"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 -ml-1 rounded-xl text-[#6B7280] hover:bg-gray-100 transition-colors"
          aria-label="Open rooms"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Room avatar */}
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold ${room.bgClass} ${room.textClass}`}
        >
          {room.initials}
        </div>

        {/* Name + status */}
        <div>
          <h2 className="text-sm font-bold text-[#1F2937] leading-tight">{room.name}</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{room.description}</p>
        </div>
      </div>

      {/* Right: connection indicator */}
      <div className="flex items-center gap-1.5">
        {status === "connected" ? (
          <>
            <Wifi className="w-4 h-4 text-[#6BCB77]" />
            <span className="text-xs font-medium text-[#6BCB77]">Live</span>
          </>
        ) : status === "connecting" ? (
          <>
            <Wifi className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs font-medium text-[#F59E0B]">Connecting</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-[#EF4444]" />
            <span className="text-xs font-medium text-[#EF4444]">Offline</span>
          </>
        )}
      </div>
    </motion.div>
  );
}
