"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldCheck, X } from "lucide-react";
import { portfolioConfig } from "@/config/portfolio";

export default function EasterEggs() {
  const [activeEgg, setActiveEgg] = useState<"sudo" | "neofetch" | null>(null);
  const [typedBuffer, setTypedBuffer] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses inside inputs or textareas to avoid breaking standard writing
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // If Escape is pressed, close any open egg
      if (e.key === "Escape") {
        setActiveEgg(null);
        return;
      }

      // Only track single character letters, numbers, and spaces
      if (e.key.length === 1) {
        setTypedBuffer((prev) => {
          const next = (prev + e.key.toLowerCase()).slice(-25); // keep last 25 chars
          
          if (next.endsWith("sudo hire me")) {
            setActiveEgg("sudo");
            return "";
          }
          if (next.endsWith("neofetch")) {
            setActiveEgg("neofetch");
            return "";
          }
          
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {activeEgg !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-6 font-mono"
          onClick={() => setActiveEgg(null)}
        >
          {/* Sudo Hire Me Modal */}
          {activeEgg === "sudo" && (
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-md border border-white/[0.08] bg-[#000000] rounded-lg p-6 relative accent-glow-box select-text"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveEgg(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded hover:bg-white/5 select-none interactive-cursor focus:outline-none"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 text-violet-400 mb-4 select-none">
                <Terminal size={18} />
                <span className="text-xs uppercase tracking-wider font-bold">sudo execution</span>
              </div>

              <div className="space-y-4 text-xs md:text-sm leading-relaxed text-gray-300">
                <div className="flex items-center gap-1.5 text-white font-bold select-none">
                  <span className="text-violet-400">manveer@portfolio:~$</span>
                  <span>sudo hire me</span>
                </div>

                <div className="text-gray-500 select-none">
                  [sudo] password for manveer: <span className="text-violet-400 font-black">••••••••••••</span>
                </div>

                <div className="flex items-start gap-3 bg-violet-500/5 border border-violet-500/20 p-4 rounded text-white mt-4">
                  <ShieldCheck className="text-violet-400 shrink-0 mt-0.5" size={20} />
                  <div>
                    <div className="font-bold text-violet-400 mb-1">Permission granted.</div>
                    <p className="text-[11px] md:text-xs text-gray-300 leading-normal">
                      Welcome, superuser. Authentication successful. Keshav Uppal's coordinates are available. Feel free to contact him at <a href={`mailto:${portfolioConfig.contact.email}`} className="text-violet-400 underline hover:text-violet-300 interactive-cursor">{portfolioConfig.contact.email}</a>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Neofetch Modal */}
          {activeEgg === "neofetch" && (
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-xl border border-white/[0.08] bg-[#000000] rounded-lg p-6 relative accent-glow-box select-text"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveEgg(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded hover:bg-white/5 select-none interactive-cursor focus:outline-none"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 text-violet-400 mb-6 select-none">
                <Terminal size={18} />
                <span className="text-xs uppercase tracking-wider font-bold">system information</span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start text-xs leading-5 text-gray-300">
                {/* Visual ASCII Logo */}
                <pre className="text-violet-400 font-black leading-4 select-none mx-auto md:mx-0">
{`          /\\
         /  \\
        /\\   \\
       /  __  \\
      /  (  )  \\
     /  _    _  \\
    /_/  \\__/  \\_\\
    
    ARCH LINUX (RICED)`}
                </pre>

                <div className="space-y-1.5 flex-1 w-full">
                  <div className="text-violet-400 font-bold text-sm">manveer@portfolio-egg</div>
                  <div className="text-gray-600 select-none">----------------------</div>
                  <div><span className="text-violet-400 font-semibold">OS</span>: Arch Linux x86_64</div>
                  <div><span className="text-violet-400 font-semibold">Host</span>: Brain Power Core V2</div>
                  <div><span className="text-violet-400 font-semibold">Kernel</span>: Next.js + Framer Motion</div>
                  <div><span className="text-violet-400 font-semibold">Uptime</span>: Always Learning (24/7)</div>
                  <div><span className="text-violet-400 font-semibold">Shell</span>: Bash & Zsh</div>
                  <div><span className="text-violet-400 font-semibold">WM</span>: Hyprland (custom riced dotfiles)</div>
                  <div><span className="text-violet-400 font-semibold">Editor</span>: Neovim (LazyVim setup)</div>
                  <div><span className="text-violet-400 font-semibold">Interests</span>: Photography, custom keyboards, systems</div>
                  <div><span className="text-violet-400 font-semibold">Status</span>: Ready for opportunities</div>
                  
                  {/* Colors block */}
                  <div className="flex gap-1.5 mt-4 pt-2 border-t border-white/[0.03] select-none">
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
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
