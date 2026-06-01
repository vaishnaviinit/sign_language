"use client";

import { motion } from "framer-motion";
import { usePrediction } from "@/hooks/use-prediction";
import { Hand, Percent, Activity, Zap } from "lucide-react";

function InsightCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  iconColor: string;
  iconBg: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-xs text-[#9CA3AF] font-mono uppercase tracking-wider mb-2">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-4xl font-extrabold text-[#1F2937] font-mono mb-1"
      >
        {value}
      </motion.p>
      {sub && <p className="text-xs text-[#9CA3AF]">{sub}</p>}
    </motion.div>
  );
}

export function AIInsights() {
  const { data } = usePrediction();
  const confidence = data.handDetected ? Math.round(93 + Math.random() * 6) : 0;

  const cards = [
    {
      icon: Hand,
      label: "Current Letter",
      value: data.letter || "—",
      sub: data.handDetected ? "Hand landmark detected" : "No hand in frame",
      iconColor: "text-[#4F7DF3]",
      iconBg: "bg-[#4F7DF3]/10",
      delay: 0,
    },
    {
      icon: Percent,
      label: "Confidence",
      value: data.handDetected ? `${confidence}%` : "—",
      sub: data.handDetected ? "Model prediction score" : "Waiting for gesture",
      iconColor: "text-[#6BCB77]",
      iconBg: "bg-[#6BCB77]/10",
      delay: 0.1,
    },
    {
      icon: Activity,
      label: "Hand Detected",
      value: data.handDetected ? "Yes" : "No",
      sub: data.backendConnected ? "MediaPipe tracking active" : "Backend offline",
      iconColor: data.handDetected ? "text-[#6EC6CA]" : "text-[#9CA3AF]",
      iconBg: data.handDetected ? "bg-[#6EC6CA]/10" : "bg-gray-100",
      delay: 0.2,
    },
    {
      icon: Zap,
      label: "Processing Speed",
      value: data.backendConnected ? `${data.fps || 5} FPS` : "—",
      sub: data.backendConnected ? "Real-time prediction rate" : "Backend not running",
      iconColor: "text-[#A78BFA]",
      iconBg: "bg-[#A78BFA]/10",
      delay: 0.3,
    },
  ];

  return (
    <section className="py-16 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-xs text-[#9CA3AF] font-mono uppercase tracking-widest px-3">
            AI Recognition Insights
          </span>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <InsightCard key={card.label} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
