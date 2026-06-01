"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/github-icon";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-[#E5E7EB] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-[#4F7DF3] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm shadow-[#4F7DF3]/30">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
            </div>
            <span className="text-lg font-bold text-[#1F2937]">
              Sign<span className="text-[#4F7DF3]">Sync</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm text-[#6B7280] hover:text-[#1F2937] rounded-lg hover:bg-gray-100 transition-all duration-150 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/vaishnaviinit/sign_language"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="#translator" className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Get Started
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#6B7280] hover:text-[#1F2937] rounded-lg hover:bg-gray-100 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#E5E7EB] shadow-lg"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-[#374151] hover:text-[#1F2937] rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-[#E5E7EB]">
                <Button variant="outline" size="md" className="w-full" asChild>
                  <a
                    href="https://github.com/vaishnaviinit/sign_language"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <GithubIcon className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
                <Button size="md" className="w-full" asChild>
                  <a href="#translator" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Get Started
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
