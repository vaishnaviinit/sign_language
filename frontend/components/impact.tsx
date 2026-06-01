"use client";

import { motion } from "framer-motion";
import { MessageSquareOff, ArrowRight, Handshake, Users } from "lucide-react";

const journeys = [
  {
    icon: MessageSquareOff,
    before: "Communication Barrier",
    beforeDesc: "Sign language users often struggle to communicate with people who don't understand sign language, creating isolation and dependence on interpreters.",
    after: "SignSync",
    afterDesc: "AI instantly translates signs into readable text — no interpreter needed. Just position your hand and start communicating.",
    afterIcon: Handshake,
    iconColor: "text-red-400",
    iconBg: "bg-red-50",
    beforeBorder: "border-red-100",
    afterIconColor: "text-[#4F7DF3]",
    afterIconBg: "bg-[#4F7DF3]/8",
    afterBorder: "border-[#4F7DF3]/15",
  },
  {
    icon: Users,
    before: "One-Sided Conversations",
    beforeDesc: "Interactions between deaf and hearing individuals require significant effort, often leaving sign language users feeling unheard or misunderstood.",
    after: "Inclusive Communication",
    afterDesc: "With real-time translation and text-to-speech, conversations become natural and bidirectional for the first time.",
    afterIcon: Handshake,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-50",
    beforeBorder: "border-orange-100",
    afterIconColor: "text-[#6EC6CA]",
    afterIconBg: "bg-[#6EC6CA]/8",
    afterBorder: "border-[#6EC6CA]/15",
  },
];

export function Impact() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6EC6CA]/20 bg-[#6EC6CA]/8 text-[#5AB5B9] text-xs font-semibold mb-4">
            Real-World Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
            Breaking Communication Barriers
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            SignSync is built with a single purpose: making communication accessible to everyone,
            regardless of hearing ability.
          </p>
        </motion.div>

        {/* Journey cards */}
        <div className="space-y-6">
          {journeys.map((journey, index) => (
            <motion.div
              key={journey.before}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center"
            >
              {/* Before */}
              <div className={`bg-white rounded-2xl p-6 border ${journey.beforeBorder} shadow-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${journey.iconBg}`}>
                    <journey.icon className={`w-4.5 h-4.5 ${journey.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-wider">Before</p>
                    <p className="text-sm font-bold text-[#1F2937]">{journey.before}</p>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">{journey.beforeDesc}</p>
              </div>

              {/* Arrow */}
              <div className="flex md:flex-col items-center justify-center">
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden md:block"
                >
                  <ArrowRight className="w-6 h-6 text-[#D1D5DB]" />
                </motion.div>
                <div className="md:hidden w-full h-px bg-[#E5E7EB]" />
              </div>

              {/* After */}
              <div className={`bg-white rounded-2xl p-6 border ${journey.afterBorder} shadow-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${journey.afterIconBg}`}>
                    <journey.afterIcon className={`w-4.5 h-4.5 ${journey.afterIconColor}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-wider">After</p>
                    <p className="text-sm font-bold text-[#1F2937]">{journey.after}</p>
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">{journey.afterDesc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 rounded-2xl p-8 text-center bg-gradient-to-br from-[#4F7DF3]/5 via-[#6EC6CA]/5 to-[#6BCB77]/5 border border-[#E5E7EB]"
        >
          <p className="text-lg font-semibold text-[#374151] leading-relaxed max-w-2xl mx-auto">
            &ldquo;Every person deserves to be understood. SignSync exists to ensure that sign language
            users can communicate freely, confidently, and in real time — without barriers.&rdquo;
          </p>
          <p className="mt-4 text-sm text-[#9CA3AF] font-medium">— The SignSync Team</p>
        </motion.div>
      </div>
    </section>
  );
}
