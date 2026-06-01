"use client";

import { motion } from "framer-motion";
import { Zap, Brain, MousePointerClick, Volume2, Globe, Accessibility } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Detection",
    description: "Recognizes hand gestures instantly with sub-100ms latency, providing a seamless communication experience.",
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[#F59E0B]/10",
    accentBorder: "hover:border-[#F59E0B]/30",
    accentBar: "bg-[#F59E0B]",
  },
  {
    icon: Brain,
    title: "Machine Learning Powered",
    description: "Random Forest classifier trained on thousands of samples achieves 95%+ prediction accuracy across the full ASL alphabet.",
    iconColor: "text-[#A78BFA]",
    iconBg: "bg-[#A78BFA]/10",
    accentBorder: "hover:border-[#A78BFA]/30",
    accentBar: "bg-[#A78BFA]",
  },
  {
    icon: MousePointerClick,
    title: "Motion Tracking",
    description: "Supports dynamic gestures like J and Z that require motion detection using temporal landmark analysis.",
    iconColor: "text-[#4F7DF3]",
    iconBg: "bg-[#4F7DF3]/10",
    accentBorder: "hover:border-[#4F7DF3]/30",
    accentBar: "bg-[#4F7DF3]",
  },
  {
    icon: Volume2,
    title: "Speech Output",
    description: "Converts the translated English text into speech using the Web Speech API so your message is both seen and heard.",
    iconColor: "text-[#6EC6CA]",
    iconBg: "bg-[#6EC6CA]/10",
    accentBorder: "hover:border-[#6EC6CA]/30",
    accentBar: "bg-[#6EC6CA]",
  },
  {
    icon: Globe,
    title: "Browser Based",
    description: "No installation, plugins, or downloads required. Works entirely in your browser using modern web technologies.",
    iconColor: "text-[#6BCB77]",
    iconBg: "bg-[#6BCB77]/10",
    accentBorder: "hover:border-[#6BCB77]/30",
    accentBar: "bg-[#6BCB77]",
  },
  {
    icon: Accessibility,
    title: "Accessibility Focused",
    description: "Designed from the ground up for inclusive communication, helping bridge the gap between deaf and hearing communities.",
    iconColor: "text-[#F472B6]",
    iconBg: "bg-[#F472B6]/10",
    accentBorder: "hover:border-[#F472B6]/30",
    accentBar: "bg-[#F472B6]",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6BCB77]/20 bg-[#6BCB77]/8 text-[#4B9A55] text-xs font-semibold mb-4">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
            Everything You Need to Communicate
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            SignSync packs state-of-the-art gesture recognition into a clean, accessible interface.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all duration-300 ${feature.accentBorder}`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.iconBg} transition-all duration-300 group-hover:scale-110`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-[#1F2937] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{feature.description}</p>

              {/* Bottom accent */}
              <div className={`mt-5 h-0.5 w-0 group-hover:w-12 transition-all duration-500 rounded-full ${feature.accentBar}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
