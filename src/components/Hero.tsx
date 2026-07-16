"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { portfolioConfig } from "@/config/portfolio";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const titles = portfolioConfig.titles;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 2300); // 2.3 seconds interval as requested

    return () => clearInterval(interval);
  }, [titles.length]);

  const handleExploreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const navbarHeight = 70;
      window.scrollTo({
        top: aboutSection.offsetTop - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center relative px-6 bg-[#000000] font-mono select-none overflow-hidden"
    >
      {/* Background soft ambient radial light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.02)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      <div className="text-center z-10 flex flex-col items-center justify-center max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 text-xs md:text-sm tracking-widest uppercase mb-4"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-5xl md:text-8xl font-black tracking-tighter mb-6 relative select-text"
        >
          {portfolioConfig.name}
        </motion.h1>

        {/* Title Cycling Area */}
        <div className="h-10 md:h-12 flex items-center justify-center mb-12 overflow-hidden relative w-full">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(6px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)", y: -10 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="text-gray-400 text-base md:text-xl font-medium tracking-wide uppercase block select-text"
            >
              {titles[index]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Explore Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={handleExploreClick}
            className="group px-6 py-3 border border-white/10 hover:border-violet-400/50 bg-[#000000] text-white hover:text-violet-400 hover:accent-glow-text text-sm rounded-md transition-all duration-300 flex items-center gap-2 select-none interactive-cursor font-medium relative overflow-hidden"
          >
            {/* Subtle glow border effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span>Explore</span>
            <ArrowRight
              size={16}
              className="transform group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>
        </motion.div>
      </div>

      {/* Subtle indicator scroll down */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
      >
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">scroll</span>
        <div className="w-[1px] h-8 bg-gray-800 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-violet-400"
            animate={{ y: ["0%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
