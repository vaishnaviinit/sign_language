"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [message]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage("");
    // Reset height after clearing
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = !disabled && message.trim().length > 0;

  return (
    <div className="flex-shrink-0 bg-white border-t border-[#E5E7EB]">
      {disabled && (
        <div className="px-4 pt-2.5 pb-0">
          <p className="text-xs text-[#F59E0B] font-medium">
            Server offline — start <code className="font-mono bg-[#F3F4F6] px-1 rounded">websocket_server.py</code> to enable messaging.
          </p>
        </div>
      )}

      <div className="px-4 py-3 flex items-end gap-2">
        {/* Attachment (placeholder for future file sharing) */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="flex-shrink-0 mb-[3px] text-[#9CA3AF] hover:text-[#4F7DF3] hover:bg-[#4F7DF3]/8 rounded-xl transition-all"
          title="Attach file"
          disabled={disabled}
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Waiting for server..." : "Type a message... (Enter to send)"}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none px-4 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F7DF3]/20 focus:border-[#4F7DF3] transition-all leading-relaxed no-scrollbar disabled:opacity-60"
        />

        {/* Send */}
        <motion.div
          whileTap={canSend ? { scale: 0.88 } : {}}
          className="flex-shrink-0 mb-[3px]"
        >
          <Button
            onClick={handleSend}
            disabled={!canSend}
            size="icon"
            className="w-9 h-9 rounded-2xl p-0 bg-[#4F7DF3] hover:bg-[#3563D8] shadow-sm shadow-[#4F7DF3]/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}