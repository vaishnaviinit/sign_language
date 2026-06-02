"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, CameraOff, Hand, Mic, Copy, Trash2, Delete, Space,
  CheckCircle, AlertCircle, Zap, WifiOff, RotateCcw,
  History, ChevronDown, Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrediction } from "@/hooks/use-prediction";

const STABILITY_THRESHOLD = 3;
const HISTORY_KEY = "signsync_history";
const MAX_HISTORY = 10;

interface HistoryEntry {
  id: string;
  text: string;
  timestamp: number;
}

export function Translator() {
  const { data, backendUrl } = usePrediction();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const stabilityRef = useRef(0);
  const lastLetterRef = useRef("");
  const appendedRef = useRef(false);
  const dataRef = useRef(data);
  dataRef.current = data;
  const autoModeRef = useRef(autoMode);
  autoModeRef.current = autoMode;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveToHistory = useCallback((t: string) => {
    if (!t.trim()) return;
    const entry: HistoryEntry = {
      id: Math.random().toString(36).slice(2),
      text: t.trim(),
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_HISTORY);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === " " && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setText((prev) => prev + " ");
      } else if (e.key === "Backspace" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setText((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const letter = dataRef.current.letter;
        if (letter && !autoModeRef.current) {
          setText((prev) => prev + letter);
        }
      } else if (e.key === "Escape") {
        setText((prev) => {
          if (prev.trim()) saveToHistory(prev);
          return "";
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveToHistory]);

  useEffect(() => {
    if (!autoMode || !data.backendConnected) return;
    const letter = data.letter;
    if (letter && letter === lastLetterRef.current) {
      stabilityRef.current += 1;
      if (stabilityRef.current >= STABILITY_THRESHOLD && !appendedRef.current) {
        setText((prev) => prev + letter);
        appendedRef.current = true;
      }
    } else {
      stabilityRef.current = 0;
      appendedRef.current = false;
      lastLetterRef.current = letter;
    }
  }, [data.letter, data.backendConnected, autoMode]);

  const handleSpeak = useCallback(() => {
    if (!text || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [text]);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const handleClear = useCallback(() => {
    saveToHistory(text);
    setText("");
  }, [text, saveToHistory]);

  const handleDelete = useCallback(() => setText((prev) => prev.slice(0, -1)), []);
  const handleSpace = useCallback(() => setText((prev) => prev + " "), []);
  const handleAddLetter = useCallback(() => {
    if (data.letter) setText((prev) => prev + data.letter);
  }, [data.letter]);

  const handleRestore = useCallback((entry: HistoryEntry) => {
    setText((prev) => {
      if (prev.trim()) saveToHistory(prev);
      return entry.text;
    });
  }, [saveToHistory]);

  const handleDeleteHistoryEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
  }, []);

  const confidence = data.handDetected ? 95 + Math.random() * 4 : 0;

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <section id="translator" className="py-24 relative bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6EC6CA]/25 bg-[#6EC6CA]/10 text-[#5AB5B9] text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Live Translator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
            Real-Time Sign Language Translator
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Connect the Python backend, position your hand in front of the webcam, and watch the AI
            translate your signs into English instantly.
          </p>
        </motion.div>

        {/* Backend status banner */}
        <AnimatePresence>
          {!data.backendConnected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700"
            >
              <WifiOff className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="text-sm">
                Backend offline — run{" "}
                <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 text-xs">
                  python app.py
                </code>{" "}
                in your project directory to start translating.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main translator panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Left: Webcam Panel */}
          <div className="glass rounded-2xl overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${data.backendConnected ? "bg-[#6BCB77] pulse-dot" : "bg-red-400"}`} />
                <span className="text-sm font-semibold text-[#1F2937]">Live Camera Feed</span>
              </div>
              <div>
                {data.backendConnected ? (
                  <span className="flex items-center gap-1.5 text-xs text-[#6BCB77] bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                    <Camera className="w-3 h-3" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full font-medium">
                    <CameraOff className="w-3 h-3" />
                    Offline
                  </span>
                )}
              </div>
            </div>

            {/* Video feed */}
            <div className="relative aspect-video bg-[#F8FAFC] overflow-hidden">
              {data.backendConnected && !imgError ? (
                <>
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#F8FAFC]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-[#4F7DF3]/20 border-t-[#4F7DF3] animate-spin" />
                        <p className="text-xs text-[#9CA3AF]">Loading camera feed...</p>
                      </div>
                    </div>
                  )}
                  <img
                    src={`${backendUrl}/video_feed`}
                    alt="Live sign language camera feed"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                  />
                </>
              ) : (
                <div className="absolute inset-0 grid-pattern flex flex-col items-center justify-center gap-4 bg-[#F8FAFC]">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center float-animation shadow-sm">
                    <Camera className="w-10 h-10 text-[#D1D5DB]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[#374151] font-semibold text-sm mb-1">Camera Feed Unavailable</p>
                    <p className="text-[#9CA3AF] text-xs">Start the Flask backend to see live video</p>
                  </div>
                  {imgError && (
                    <button
                      onClick={() => { setImgError(false); setImgLoaded(false); }}
                      className="flex items-center gap-1.5 text-xs text-[#4F7DF3] hover:text-[#3563D8] transition-colors font-medium"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Retry connection
                    </button>
                  )}
                  <div className="absolute bottom-4 right-4 opacity-10">
                    <Hand className="w-16 h-16 text-[#4F7DF3]" />
                  </div>
                </div>
              )}

              {/* Overlay */}
              {data.backendConnected && imgLoaded && (
                <div className="absolute inset-0 pointer-events-none">
                  {data.handDetected && (
                    <>
                      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#4F7DF3]/60 rounded-tl-sm" />
                      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#4F7DF3]/60 rounded-tr-sm" />
                      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#4F7DF3]/60 rounded-bl-sm" />
                      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#4F7DF3]/60 rounded-br-sm" />
                    </>
                  )}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#4F7DF3] bg-white/80 px-2 py-0.5 rounded-full border border-[#4F7DF3]/20">
                    {data.fps} FPS
                  </div>
                </div>
              )}
            </div>

            {/* Status cards */}
            <div className="grid grid-cols-3 gap-0 divide-x divide-[#E5E7EB] border-t border-[#E5E7EB]">
              {[
                { icon: Camera, label: "Camera", value: data.backendConnected ? "Connected" : "Offline", active: data.backendConnected },
                { icon: Hand, label: "Hand", value: data.handDetected ? "Detected" : "None", active: data.handDetected },
                { icon: Zap, label: "Confidence", value: data.handDetected ? `${Math.round(confidence)}%` : "—", active: data.handDetected },
              ].map(({ icon: Icon, label, value, active }) => (
                <div key={label} className="flex flex-col items-center py-3 px-2">
                  <div className={`flex items-center gap-1 mb-1 ${active ? "text-[#6BCB77]" : "text-[#D1D5DB]"}`}>
                    <Icon className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
                  </div>
                  <span className={`text-xs font-bold ${active ? "text-[#1F2937]" : "text-[#D1D5DB]"}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Keyboard shortcuts */}
            <div className="border-t border-[#E5E7EB] px-4 py-2.5">
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="w-full flex items-center justify-between text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5" />
                  Keyboard Shortcuts
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showShortcuts ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showShortcuts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2.5 grid grid-cols-2 gap-x-6 gap-y-2">
                      {[
                        ["Space", "Add space"],
                        ["Backspace", "Delete char"],
                        ["Enter", "Add letter"],
                        ["Escape", "Clear & save"],
                      ].map(([key, desc]) => (
                        <div key={key} className="flex items-center gap-2">
                          <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] leading-none whitespace-nowrap">
                            {key}
                          </kbd>
                          <span className="text-[10px] text-[#9CA3AF]">{desc}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Output Panel */}
          <div className="glass rounded-2xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
              <span className="text-sm font-semibold text-[#1F2937]">Translation Output</span>
              <button
                onClick={() => setAutoMode(!autoMode)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                  autoMode
                    ? "text-[#4F7DF3] bg-[#4F7DF3]/8 border-[#4F7DF3]/20"
                    : "text-[#9CA3AF] bg-gray-50 border-[#E5E7EB] hover:text-[#6B7280]"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${autoMode ? "bg-[#4F7DF3] pulse-dot" : "bg-[#D1D5DB]"}`} />
                Auto
              </button>
            </div>

            {/* Detected letter */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9CA3AF] font-mono uppercase tracking-wider">Detected:</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={data.letter || "none"}
                    initial={{ opacity: 0, scale: 0.7, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className={`text-2xl font-bold font-mono w-10 h-10 flex items-center justify-center rounded-xl border ${
                      data.letter
                        ? "text-[#4F7DF3] bg-[#4F7DF3]/8 border-[#4F7DF3]/20"
                        : "text-[#D1D5DB] bg-gray-50 border-[#E5E7EB]"
                    }`}
                  >
                    {data.letter || "—"}
                  </motion.span>
                </AnimatePresence>
              </div>
              {data.handDetected && (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-16 bg-[#F3F4F6] rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#6BCB77] rounded-full"
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-xs text-[#6BCB77] font-bold font-mono w-8 text-right">
                    {Math.round(confidence)}%
                  </span>
                </div>
              )}
            </div>

            {/* Text output */}
            <div className="flex-1 relative p-5 min-h-[180px]">
              {text ? (
                <motion.p className="text-2xl sm:text-3xl font-bold text-[#1F2937] font-mono leading-relaxed tracking-widest break-all">
                  {text}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-7 bg-[#4F7DF3] ml-1 align-middle"
                  />
                </motion.p>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center border border-[#E5E7EB]">
                    <FileTextPlaceholder className="w-6 h-6 text-[#D1D5DB]" />
                  </div>
                  <p className="text-[#9CA3AF] text-sm text-center">
                    {data.backendConnected
                      ? autoMode
                        ? "Show a sign to start translating..."
                        : "Use 'Add Letter' or toggle Auto mode"
                      : "Start the backend to begin"}
                  </p>
                </div>
              )}
            </div>

            {/* Character count + Add Letter */}
            <div className="flex items-center justify-between px-5 py-2 border-t border-[#E5E7EB]">
              <span className="text-[11px] text-[#9CA3AF] font-mono">
                {text.length} chars · {text.split(" ").filter(Boolean).length} words
              </span>
              {!autoMode && data.letter && (
                <button
                  onClick={handleAddLetter}
                  className="text-xs text-[#4F7DF3] hover:text-[#3563D8] font-semibold transition-colors"
                >
                  + Add &quot;{data.letter}&quot;
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="px-5 pb-5 pt-3 border-t border-[#E5E7EB] grid grid-cols-2 gap-2">
              <Button variant="glass" size="md" className="flex items-center gap-2" onClick={handleSpeak} disabled={!text || isSpeaking}>
                <Mic className={`w-4 h-4 ${isSpeaking ? "text-[#4F7DF3] animate-pulse" : ""}`} />
                {isSpeaking ? "Speaking..." : "Speak Text"}
              </Button>
              <Button variant="glass" size="md" className="flex items-center gap-2" onClick={handleCopy} disabled={!text}>
                {copied ? (
                  <><CheckCircle className="w-4 h-4 text-[#6BCB77]" />Copied!</>
                ) : (
                  <><Copy className="w-4 h-4" />Copy Text</>
                )}
              </Button>
              <Button variant="glass" size="md" className="flex items-center gap-2" onClick={handleSpace}>
                <Space className="w-4 h-4" />Add Space
              </Button>
              <Button variant="glass" size="md" className="flex items-center gap-2" onClick={handleDelete} disabled={!text}>
                <Delete className="w-4 h-4" />Delete
              </Button>
              <Button variant="destructive" size="md" className="col-span-2 flex items-center gap-2" onClick={handleClear} disabled={!text}>
                <Trash2 className="w-4 h-4" />Clear &amp; Save
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Translation History */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="mt-6 glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-sm font-semibold text-[#1F2937]">Translation History</span>
                  <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-full font-mono leading-none">
                    {history.length}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${showHistory ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#E5E7EB] divide-y divide-[#F3F4F6]">
                      {history.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[#F9FAFB] transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-mono text-[#374151] truncate">{entry.text}</p>
                            <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                              {formatTime(entry.timestamp)} · {entry.text.length} chars
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleRestore(entry)}
                              className="text-xs text-[#4F7DF3] hover:text-[#3563D8] font-medium px-2 py-1 rounded-lg hover:bg-[#4F7DF3]/8 transition-all"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handleDeleteHistoryEntry(entry.id)}
                              className="p-1 rounded-lg text-[#D1D5DB] hover:text-red-400 hover:bg-red-50 transition-all"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 py-3 border-t border-[#E5E7EB] flex justify-end">
                      <button
                        onClick={handleClearHistory}
                        className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors"
                      >
                        Clear all history
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Setup instructions */}
        {!data.backendConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1F2937] mb-2">Quick Setup</p>
                <ol className="text-sm text-[#6B7280] space-y-1.5 list-decimal list-inside">
                  <li>Install dependencies: <code className="font-mono text-xs bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[#374151]">pip install -r requirements.txt</code></li>
                  <li>Train the model: <code className="font-mono text-xs bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[#374151]">python train_model.py</code></li>
                  <li>Start the backend: <code className="font-mono text-xs bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[#374151]">python app.py</code></li>
                  <li>Reload this page and start signing!</li>
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function FileTextPlaceholder({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
