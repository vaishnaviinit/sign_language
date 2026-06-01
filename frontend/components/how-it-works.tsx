"use client";

import { motion } from "framer-motion";
import { Camera, Scan, Cpu, Layers, BarChart3, Type } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Webcam Captures Gesture",
    description: "Your browser's camera or the Flask backend captures real-time video frames of your hand gestures.",
    iconColor: "text-[#4F7DF3]",
    iconBg: "bg-[#4F7DF3]/10",
    border: "border-[#4F7DF3]/15",
    dot: "bg-[#4F7DF3]",
  },
  {
    icon: Scan,
    title: "MediaPipe Detects Landmarks",
    description: "Google's MediaPipe identifies 21 precise key points on your hand with sub-millimeter accuracy.",
    iconColor: "text-[#6EC6CA]",
    iconBg: "bg-[#6EC6CA]/10",
    border: "border-[#6EC6CA]/15",
    dot: "bg-[#6EC6CA]",
  },
  {
    icon: Layers,
    title: "Feature Extraction",
    description: "The 21 landmark coordinates are normalized and converted into a 42-dimensional feature vector.",
    iconColor: "text-[#A78BFA]",
    iconBg: "bg-[#A78BFA]/10",
    border: "border-[#A78BFA]/15",
    dot: "bg-[#A78BFA]",
  },
  {
    icon: Cpu,
    title: "ML Model Predicts Sign",
    description: "A trained Random Forest classifier identifies the sign with 95%+ accuracy across the full alphabet.",
    iconColor: "text-[#F97316]",
    iconBg: "bg-[#F97316]/10",
    border: "border-[#F97316]/15",
    dot: "bg-[#F97316]",
  },
  {
    icon: BarChart3,
    title: "Confidence Scoring",
    description: "The model outputs a confidence percentage, filtering low-certainty predictions automatically.",
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[#F59E0B]/10",
    border: "border-[#F59E0B]/15",
    dot: "bg-[#F59E0B]",
  },
  {
    icon: Type,
    title: "English Text Displayed",
    description: "Stable predictions are assembled into readable English text with speech-to-text support.",
    iconColor: "text-[#6BCB77]",
    iconBg: "bg-[#6BCB77]/10",
    border: "border-[#6BCB77]/15",
    dot: "bg-[#6BCB77]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/8 text-[#7C3AED] text-xs font-semibold mb-4">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
            From Gesture to Text in Milliseconds
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            A six-step AI pipeline transforms hand movements into readable English text in real time.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[#E5E7EB] -translate-x-1/2" />

          <div className="space-y-8">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className={`relative flex items-center gap-8 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${isLeft ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                      <div className={`inline-flex items-center gap-2 mb-3 ${isLeft ? "lg:flex-row-reverse" : ""}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${step.iconBg} ${step.border}`}>
                          <step.icon className={`w-4.5 h-4.5 ${step.iconColor}`} />
                        </div>
                        <span className="text-xs text-[#9CA3AF] font-semibold font-mono">Step {index + 1}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1F2937] mb-2">{step.title}</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex w-4 h-4 rounded-full border-2 border-[#E5E7EB] bg-white shrink-0 z-10 items-center justify-center shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${step.dot}`} />
                  </div>

                  {/* Spacer */}
                  <div className="hidden lg:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
