"use client";

import { motion } from "framer-motion";
import { Camera, Eye, Layers, Cpu, Target, Type, ArrowDown } from "lucide-react";

const pipeline = [
  { icon: Camera, label: "Webcam Input", sublabel: "OpenCV VideoCapture", iconColor: "text-[#4F7DF3]", iconBg: "bg-[#4F7DF3]/10", border: "border-[#4F7DF3]/15" },
  { icon: Eye, label: "OpenCV", sublabel: "Frame Processing & Flip", iconColor: "text-[#6EC6CA]", iconBg: "bg-[#6EC6CA]/10", border: "border-[#6EC6CA]/15" },
  { icon: Layers, label: "MediaPipe", sublabel: "21 Hand Landmark Detection", iconColor: "text-[#A78BFA]", iconBg: "bg-[#A78BFA]/10", border: "border-[#A78BFA]/15" },
  { icon: Cpu, label: "Feature Extraction", sublabel: "Normalized 42D Vector", iconColor: "text-[#F97316]", iconBg: "bg-[#F97316]/10", border: "border-[#F97316]/15" },
  { icon: Target, label: "Random Forest", sublabel: "100-Estimator Classifier", iconColor: "text-[#F59E0B]", iconBg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/15" },
  { icon: Type, label: "English Output", sublabel: "Real-Time Text Display", iconColor: "text-[#6BCB77]", iconBg: "bg-[#6BCB77]/10", border: "border-[#6BCB77]/15" },
];

export function Architecture() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#C2410C] text-xs font-semibold mb-4">
            System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
            How the AI Pipeline Works
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Six processing stages transform a camera frame into readable English text in under 50ms.
          </p>
        </motion.div>

        <div className="flex flex-col items-center max-w-sm mx-auto lg:max-w-none">
          <div className="flex flex-col lg:flex-row items-center gap-0 w-full">
            {pipeline.map((step, index) => (
              <div key={step.label} className="flex flex-col lg:flex-row items-center gap-0 w-full lg:flex-1">
                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className={`relative group bg-white rounded-2xl p-5 border ${step.border} text-center transition-all duration-300 w-full lg:w-auto shadow-sm hover:shadow-md`}
                >
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#9CA3AF]">{index + 1}</span>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border ${step.iconBg} ${step.border} group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                  </div>
                  <p className="text-sm font-bold text-[#1F2937] mb-0.5">{step.label}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{step.sublabel}</p>
                </motion.div>

                {/* Connector */}
                {index < pipeline.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 + 0.25 }}
                    className="flex items-center justify-center my-2 lg:my-0 lg:mx-1.5"
                  >
                    <ArrowDown className="w-4 h-4 text-[#D1D5DB] lg:hidden" />
                    <div className="hidden lg:flex items-center gap-0.5">
                      <div className="h-px w-4 bg-[#E5E7EB]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-14">
          {[
            { label: "Input Format", value: "RGB Video Frames @ 30fps", color: "text-[#4F7DF3]", bg: "bg-[#4F7DF3]/5", border: "border-[#4F7DF3]/10" },
            { label: "Feature Vector", value: "42 normalized coordinates", color: "text-[#A78BFA]", bg: "bg-[#A78BFA]/5", border: "border-[#A78BFA]/10" },
            { label: "Output Classes", value: "26 ASL letters (A–Z)", color: "text-[#6BCB77]", bg: "bg-[#6BCB77]/5", border: "border-[#6BCB77]/10" },
          ].map((info) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-5 text-center border ${info.bg} ${info.border}`}
            >
              <p className="text-xs text-[#9CA3AF] font-mono uppercase tracking-wider mb-1.5">{info.label}</p>
              <p className={`text-sm font-bold ${info.color}`}>{info.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
