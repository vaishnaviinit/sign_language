"use client";

import { motion } from "framer-motion";
import { Zap, Heart } from "lucide-react";
import { GithubIcon } from "@/components/ui/github-icon";

const techStack = [
  "Next.js 16", "Flask", "MediaPipe", "OpenCV",
  "Random Forest", "TypeScript", "Tailwind CSS", "Framer Motion",
];

const contributors = [
  { name: "Vaishnavi Chaudhary", role: "Frontend & Backend", initials: "VC", color: "from-[#4F7DF3]/20 to-[#6EC6CA]/20 text-[#4F7DF3]" },
  { name: "Shresth Samyak", role: "ML & Dataset Training", initials: "SS", color: "from-[#6EC6CA]/20 to-[#6BCB77]/20 text-[#6EC6CA]" },
  { name: "Kanishka Sharma", role: "RAG ", initials: "KS", color: "from-[#F59E0B]/20 to-[#F59E0B]/10 text-[#F59E0B]" },
  { name: "Livleen Kaur", role: "Research & Documentation", initials: "LK", color: "from-[#A78BFA]/20 to-[#A78BFA]/10 text-[#A78BFA]" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[#E5E7EB] bg-[#F9FAFB] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#4F7DF3] flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-[#1F2937]">
                Sign<span className="text-[#4F7DF3]">Sync</span>
              </span>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
              An AI-powered real-time sign language translator built with MediaPipe, OpenCV, and
              machine learning. Making communication accessible for everyone.
            </p>
            <a
              href="https://github.com/vaishnaviinit/sign_language"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors font-medium"
            >
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          {/* Tech Stack */}
          <div>
            <p className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider mb-4">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#E5E7EB] text-[#6B7280] font-mono shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Contributors */}
          <div>
            <p className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider mb-4">Contributors</p>
            <div className="grid grid-cols-2 gap-3">
              {contributors.map((person) => (
                <div key={person.name} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${person.color} border border-[#E5E7EB] flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0`}>
                    {person.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1F2937] truncate">{person.name}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#E5E7EB]"
        >
          <p className="text-xs text-[#9CA3AF] flex items-center gap-1.5">
            © 2026 SignSync Team. Built with{" "}
            <Heart className="w-3 h-3 text-red-400 fill-current" /> for accessibility.
          </p>
          <span className="text-xs text-[#D1D5DB] font-mono">
            Powered by MediaPipe + Random Forest
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
