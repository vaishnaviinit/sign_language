"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Hand, Brain, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Soft background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-72 h-72 rounded-full bg-[#4F7DF3]/8 blur-[80px]" />
        <div className="absolute w-48 h-48 rounded-full bg-[#6EC6CA]/10 blur-[60px] translate-x-12" />
      </div>

      {/* Main illustration card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="relative glass rounded-2xl p-6"
        style={{ boxShadow: "0 8px 40px rgba(79,125,243,0.1), 0 2px 8px rgba(0,0,0,0.06)" }}
      >
        {/* Top: Hand gesture */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#4F7DF3]/10 border border-[#4F7DF3]/15 flex items-center justify-center">
            <Hand className="w-5 h-5 text-[#4F7DF3]" />
          </div>
          <div>
            <p className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-wider">Input</p>
            <p className="text-sm text-[#1F2937] font-semibold">Hand Gesture Detected</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-[#6BCB77] pulse-dot" />
        </div>

        {/* Webcam preview */}
        <div className="relative rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E5E7EB] aspect-video mb-5">
          <div className="absolute inset-0 grid-pattern" />
          <svg viewBox="0 0 280 180" className="absolute inset-0 w-full h-full opacity-80">
            <circle cx="140" cy="130" r="3" fill="#4F7DF3" />
            <circle cx="110" cy="115" r="2.5" fill="#6EC6CA" />
            <circle cx="96" cy="102" r="2.5" fill="#6EC6CA" />
            <circle cx="85" cy="90" r="2.5" fill="#6EC6CA" />
            <circle cx="78" cy="80" r="2.5" fill="#6EC6CA" />
            <circle cx="120" cy="110" r="2.5" fill="#4F7DF3" />
            <circle cx="115" cy="88" r="2.5" fill="#4F7DF3" />
            <circle cx="112" cy="70" r="2.5" fill="#4F7DF3" />
            <circle cx="110" cy="55" r="2.5" fill="#4F7DF3" />
            <circle cx="140" cy="108" r="2.5" fill="#A78BFA" />
            <circle cx="140" cy="84" r="2.5" fill="#A78BFA" />
            <circle cx="140" cy="65" r="2.5" fill="#A78BFA" />
            <circle cx="140" cy="50" r="2.5" fill="#A78BFA" />
            <circle cx="160" cy="110" r="2.5" fill="#6EC6CA" />
            <circle cx="163" cy="87" r="2.5" fill="#6EC6CA" />
            <circle cx="165" cy="70" r="2.5" fill="#6EC6CA" />
            <circle cx="166" cy="56" r="2.5" fill="#6EC6CA" />
            <circle cx="178" cy="115" r="2.5" fill="#6BCB77" />
            <circle cx="182" cy="96" r="2.5" fill="#6BCB77" />
            <circle cx="185" cy="82" r="2.5" fill="#6BCB77" />
            <circle cx="187" cy="70" r="2.5" fill="#6BCB77" />
            <line x1="140" y1="130" x2="110" y2="115" stroke="rgba(110,198,202,0.5)" strokeWidth="1.5" />
            <line x1="140" y1="130" x2="120" y2="110" stroke="rgba(79,125,243,0.5)" strokeWidth="1.5" />
            <line x1="140" y1="130" x2="140" y2="108" stroke="rgba(167,139,250,0.5)" strokeWidth="1.5" />
            <line x1="140" y1="130" x2="160" y2="110" stroke="rgba(110,198,202,0.5)" strokeWidth="1.5" />
            <line x1="140" y1="130" x2="178" y2="115" stroke="rgba(107,203,119,0.5)" strokeWidth="1.5" />
          </svg>
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4F7DF3] to-transparent opacity-40"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#4F7DF3]/40 rounded-tl" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#4F7DF3]/40 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#4F7DF3]/40 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#4F7DF3]/40 rounded-br" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#4F7DF3]/60 font-mono bg-white/80 px-2 py-0.5 rounded">
            21 landmarks • LIVE
          </div>
        </div>

        {/* Processing steps */}
        <div className="flex items-center gap-2 mb-4">
          {[
            { icon: Hand, label: "Capture", color: "text-[#4F7DF3] bg-[#4F7DF3]/8 border-[#4F7DF3]/15" },
            { icon: Brain, label: "Predict", color: "text-[#A78BFA] bg-[#A78BFA]/8 border-[#A78BFA]/15" },
            { icon: FileText, label: "Output", color: "text-[#6EC6CA] bg-[#6EC6CA]/8 border-[#6EC6CA]/15" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${step.color}`}>
                <step.icon className="w-3 h-3" />
                {step.label}
              </div>
              {i < 2 && <ArrowRight className="w-3 h-3 text-[#D1D5DB] shrink-0" />}
            </div>
          ))}
        </div>

        {/* Output card */}
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-3">
          <p className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-wider mb-1.5">Translation Output</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#1F2937] font-mono tracking-widest">HELLO</p>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-0.5 h-6 bg-[#4F7DF3]"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-mono text-[#9CA3AF]">Current letter:</span>
            <span className="text-xs font-bold text-[#6EC6CA] font-mono bg-[#6EC6CA]/10 border border-[#6EC6CA]/20 px-1.5 py-0.5 rounded">O</span>
            <span className="ml-auto text-[10px] text-[#6BCB77] font-semibold">97% confidence</span>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        className="absolute -top-3 -right-3 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-md border border-[#E5E7EB]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span className="text-xs font-semibold text-[#1F2937]">AI Powered</span>
      </motion.div>

      <motion.div
        className="absolute -bottom-3 -left-3 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-md border border-[#E5E7EB]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="w-2 h-2 rounded-full bg-[#6BCB77] pulse-dot" />
        <span className="text-xs font-semibold text-[#1F2937]">Real-Time • 24 FPS</span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#FAFAF8]">
      {/* Soft background elements */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full bg-[#4F7DF3]/6 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 rounded-full bg-[#6EC6CA]/6 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#6BCB77]/3 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4F7DF3]/20 bg-[#4F7DF3]/8 text-[#4F7DF3] text-xs font-semibold mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4F7DF3] pulse-dot" />
              AI-Powered Sign Language Translator
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] leading-[1.1] tracking-tight mb-6"
            >
              Translate Sign Language{" "}
              <span className="gradient-text">Into English</span>{" "}
              Instantly
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg text-[#6B7280] leading-relaxed mb-8 max-w-lg"
            >
              AI-powered real-time gesture recognition that converts sign language
              into readable text directly from your webcam. No installation required.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3 mb-12"
            >
              <Button size="lg" asChild>
                <a href="#translator" className="flex items-center gap-2">
                  Start Translating
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works" className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#4F7DF3]" />
                  View Demo
                </a>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-8"
            >
              {[
                { value: "26+", label: "Signs Supported" },
                { value: "95%+", label: "Accuracy" },
                { value: "21", label: "Hand Landmarks" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-extrabold text-[#1F2937]">{stat.value}</span>
                  <span className="text-xs text-[#9CA3AF] font-medium">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-[#D1D5DB] to-transparent"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
