"use client";

import { useState } from "react";
import { Sparkles, Send, Trash2, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";

const BACKEND_URL = "http://localhost:5000";

interface SignComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function SignComposer({ onSend, disabled = false }: SignComposerProps) {
  const [draft, setDraft] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const clearHistory = () => {
    fetch(`${BACKEND_URL}/clear`, { method: "POST" }).catch(() => {});
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/sentence`, { method: "POST" });
      const data = await res.json();
      setDraft(data.sentence || "");
      setHasDraft(true);
    } catch {
      setDraft("");
      setHasDraft(false);
    }
    setLoading(false);
  };

  const discard = () => {
    setDraft("");
    setHasDraft(false);
    clearHistory();
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
    setHasDraft(false);
    clearHistory();
  };

  if (!open) {
    return (
      <div className="flex-shrink-0 bg-white border-t border-[#E5E7EB] px-4 py-2">
        <Button
          variant="glass"
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Hand className="w-4 h-4 text-[#4F7DF3]" />
          Compose by signing
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 bg-white border-t border-[#E5E7EB] px-4 py-3">
      <div className="flex items-start gap-3">
        <img
          src={`${BACKEND_URL}/video_feed`}
          alt="Sign camera"
          className="w-44 rounded-xl border border-[#E5E7EB] object-cover bg-[#F8FAFC]"
        />

        <div className="flex-1 space-y-2">
          {!hasDraft ? (
            <>
              <p className="text-xs text-[#6B7280]">
                Sign your message, then generate the sentence.
              </p>
              <Button
                onClick={generate}
                disabled={disabled || loading}
                className="w-full flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? "Generating..." : "Generate Sentence with AI"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs text-[#6B7280]">Review and edit before sending:</p>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                className="w-full resize-none px-3 py-2 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4F7DF3]/20 focus:border-[#4F7DF3]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={send}
                  disabled={!draft.trim()}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </Button>
                <Button
                  variant="destructive"
                  onClick={discard}
                  className="flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Discard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
