"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: 26,
    suffix: "+",
    label: "Supported Alphabet Signs",
    description: "Full ASL finger alphabet A through Z",
    color: "text-[#4F7DF3]",
    bg: "bg-[#4F7DF3]/5",
    border: "border-[#4F7DF3]/12",
  },
  {
    value: 21,
    suffix: "",
    label: "Hand Landmarks Tracked",
    description: "Precise 3D joint detection per frame",
    color: "text-[#6EC6CA]",
    bg: "bg-[#6EC6CA]/5",
    border: "border-[#6EC6CA]/12",
  },
  {
    value: 95,
    suffix: "%+",
    label: "Prediction Accuracy",
    description: "Random Forest classifier performance",
    color: "text-[#6BCB77]",
    bg: "bg-[#6BCB77]/5",
    border: "border-[#6BCB77]/12",
  },
  {
    value: 0,
    suffix: "ms",
    label: "Installation Required",
    description: "Runs entirely in your browser",
    color: "text-[#A78BFA]",
    bg: "bg-[#A78BFA]/5",
    border: "border-[#A78BFA]/12",
    display: "Real-Time",
  },
];

function CountUp({
  target,
  duration = 2000,
  suffix = "",
  display,
  color,
}: {
  target: number;
  duration?: number;
  suffix?: string;
  display?: string;
  color: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView || display) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, display]);

  return (
    <span ref={ref} className={`text-5xl sm:text-6xl font-extrabold font-mono ${color}`}>
      {display || count}
      {!display && suffix}
    </span>
  );
}

export function Statistics() {
  return (
    <section className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
            Built on Solid Foundations
          </h2>
          <p className="text-[#6B7280] max-w-lg mx-auto leading-relaxed">
            Numbers that define the precision and capability behind SignSync.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative bg-white rounded-2xl p-8 text-center border ${stat.border} ${stat.bg} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
            >
              <CountUp
                target={stat.value}
                suffix={stat.suffix}
                display={stat.display}
                color={stat.color}
              />
              <p className="text-sm font-bold text-[#1F2937] mt-3 mb-1">{stat.label}</p>
              <p className="text-xs text-[#9CA3AF]">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
