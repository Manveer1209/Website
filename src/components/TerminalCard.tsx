"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { portfolioConfig } from "@/config/portfolio";

export default function TerminalCard({
  onTriggerNeofetch,
}: {
  onTriggerNeofetch?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const [commandText, setCommandText] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [currentMode, setCurrentMode] = useState<"whoami" | "neofetch" | "clear">("whoami");
  const [isTyping, setIsTyping] = useState(false);

  const data = portfolioConfig.about;

  // Typing effect for commands
  const typeCommand = useCallback((cmd: string, onDone: () => void) => {
    setIsTyping(true);
    setCommandText("");
    setShowOutput(false);
    
    let index = 0;
    const interval = setInterval(() => {
      setCommandText((prev) => prev + cmd[index]);
      index++;
      if (index >= cmd.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => {
          setShowOutput(true);
          onDone();
        }, 200);
      }
    }, 70);
  }, []);

  useEffect(() => {
    if (isInView && currentMode === "whoami") {
      const timer = setTimeout(() => {
        typeCommand("whoami", () => {});
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isInView, currentMode, typeCommand]);

  const handleShortcutClick = (sectionId: string) => {
    if (sectionId === "clear") {
      setCurrentMode("clear");
      typeCommand("clear", () => {
        setTimeout(() => {
          setCommandText("");
          setShowOutput(false);
        }, 300);
      });
      return;
    }

    if (sectionId === "neofetch") {
      setCurrentMode("neofetch");
      typeCommand("neofetch", () => {
        if (onTriggerNeofetch) {
          // Trigger the global easter egg modal or handle inside terminal
          onTriggerNeofetch();
        }
      });
      return;
    }

    if (sectionId === "whoami") {
      setCurrentMode("whoami");
      typeCommand("whoami", () => {});
      return;
    }

    // Standard section scroll
    const el = document.getElementById(sectionId);
    if (el) {
      const navbarHeight = 70;
      window.scrollTo({
        top: el.offsetTop - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  // Staggered animation for output items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto font-mono text-xs md:text-sm">
      {/* Quick Commands visual navigation header */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-gray-500">
        <span className="text-[10px] uppercase tracking-wider text-gray-600 mr-1 select-none">Quick Links:</span>
        {[
          { id: "whoami", label: "whoami" },
          { id: "projects", label: "projects" },
          { id: "certifications", label: "certifications" },
          { id: "github", label: "github" },
          { id: "contact", label: "contact" },
          { id: "clear", label: "clear" },
          { id: "neofetch", label: "neofetch" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleShortcutClick(item.id)}
            className={`px-2 py-0.5 rounded border border-white/[0.04] bg-white/[0.01] hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-400 select-none interactive-cursor transition-all ${
              currentMode === item.id && (item.id === "whoami" || item.id === "neofetch")
                ? "text-violet-400 border-violet-500/20 bg-violet-500/5"
                : "text-gray-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Terminal Card */}
      <div className="w-full rounded-lg border border-white/[0.06] bg-white/[0.01] overflow-hidden accent-glow-box select-text">
        {/* Terminal Header */}
        <div className="bg-[#000000] border-b border-white/[0.06] px-4 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-gray-500 text-[10px]">manveer@portfolio: ~</span>
          <div className="w-10" /> {/* empty spacer */}
        </div>

        {/* Terminal Content */}
        <div className="p-5 md:p-6 bg-black min-h-[300px] flex flex-col justify-between text-gray-300 leading-relaxed">
          <div>
            {/* Input Line */}
            <div className="flex items-center mb-4 text-white">
              <span className="text-violet-400 mr-2">manveer@portfolio:~$</span>
              <span>{commandText}</span>
              {isTyping && <span className="terminal-cursor" />}
            </div>

            {/* Simulated Outputs */}
            <AnimatePresence mode="wait">
              {showOutput && currentMode === "whoami" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants}>
                    <span className="text-gray-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Name</span>
                    <span className="text-white font-medium">{data.name}</span>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <span className="text-gray-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Role</span>
                    <span className="text-white font-medium">{data.role}</span>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <span className="text-gray-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Focus</span>
                    <ul className="list-none pl-0 grid grid-cols-2 gap-x-4 gap-y-1">
                      {data.focus.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white">
                          <span className="text-violet-400 text-xs">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <span className="text-gray-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Interests</span>
                    <ul className="list-none pl-0 grid grid-cols-2 gap-x-4 gap-y-1">
                      {data.interests.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white">
                          <span className="text-violet-400 text-xs">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <span className="text-gray-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Currently Learning</span>
                    <ul className="list-none pl-0 grid grid-cols-2 gap-x-4 gap-y-1">
                      {data.currentlyLearning.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white">
                          <span className="text-violet-400 text-xs">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-2 border-t border-white/[0.04]">
                    <span className="text-gray-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Status</span>
                    <span className="text-violet-300 italic">{data.status}</span>
                  </motion.div>
                </motion.div>
              )}

              {showOutput && currentMode === "neofetch" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col md:flex-row gap-6 items-start text-xs leading-5"
                >
                  {/* Custom Minimal ASCII Art */}
                  <pre className="text-violet-400 font-bold leading-4 select-none">
{`      /\\
     /  \\
    /\\   \\
   /  __  \\
  /  (  )  \\
 /  _    _  \\
/_/  \\__/  \\_\\`}
                  </pre>
                  <div className="space-y-1">
                    <div className="text-violet-400 font-bold text-sm">manveer@portfolio</div>
                    <div className="text-gray-600">-----------------</div>
                    <div><span className="text-violet-400 font-semibold">OS</span>: Arch Linux x86_64</div>
                    <div><span className="text-violet-400 font-semibold">Host</span>: Portfolio Website v2.0</div>
                    <div><span className="text-violet-400 font-semibold">Kernel</span>: Next.js App Router</div>
                    <div><span className="text-violet-400 font-semibold">Uptime</span>: Always Learning</div>
                    <div><span className="text-violet-400 font-semibold">Shell</span>: Framer Motion v11</div>
                    <div><span className="text-violet-400 font-semibold">Terminal</span>: Custom-made OLED</div>
                    <div><span className="text-violet-400 font-semibold">CPU</span>: Curiosity Driven Core</div>
                    <div><span className="text-violet-400 font-semibold">Memory</span>: Infinite learning / 16GB</div>
                    <div className="flex gap-1.5 mt-3 pt-2">
                      <span className="inline-block w-4 h-4 bg-black border border-white/10" />
                      <span className="inline-block w-4 h-4 bg-red-950/40 border border-red-500/20" />
                      <span className="inline-block w-4 h-4 bg-green-950/40 border border-green-500/20" />
                      <span className="inline-block w-4 h-4 bg-yellow-950/40 border border-yellow-500/20" />
                      <span className="inline-block w-4 h-4 bg-blue-950/40 border border-blue-500/20" />
                      <span className="inline-block w-4 h-4 bg-violet-950/40 border border-violet-500/20" />
                      <span className="inline-block w-4 h-4 bg-teal-950/40 border border-teal-500/20" />
                      <span className="inline-block w-4 h-4 bg-white/20 border border-white/10" />
                    </div>
                  </div>
                </motion.div>
              )}

              {showOutput && currentMode === "clear" && (
                <span />
              )}
            </AnimatePresence>
          </div>

          {/* Bottom active prompt line */}
          {showOutput && !isTyping && (
            <div className="flex items-center mt-6 text-white pt-4 border-t border-white/[0.03]">
              <span className="text-violet-400 mr-2">manveer@portfolio:~$</span>
              <span className="terminal-cursor" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
