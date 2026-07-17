"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Mail, Check } from "lucide-react";
import { LinkedinIcon as Linkedin, DiscordIcon as Discord } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  const contact = siteConfig.contact;
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(contact.discord);
    setCopiedDiscord(true);
    setShowToast(true);
    setTimeout(() => {
      setCopiedDiscord(false);
      setShowToast(false);
    }, 2500);
  };

  const contactItems = [
    {
      label: "Email",
      value: contact.email,
      icon: <Mail size={18} />,
      actionType: "link",
      href: `mailto:${contact.email}`,
    },
    {
      label: "LinkedIn",
      value: contact.linkedin.replace("https://www.", "").replace("https://", "").replace(/\/$/, ""),
      icon: <Linkedin size={18} />,
      actionType: "link",
      href: contact.linkedin,
    },
    {
      label: "Discord",
      value: contact.discord,
      icon: <Discord size={18} />,
      actionType: "copy",
      onClick: handleCopyDiscord,
      feedback: copiedDiscord,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto font-mono text-xs md:text-sm">
      <div className="border border-white/[0.06] bg-white/[0.01] rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 accent-glow-box">
        {/* Pitch Statement */}
        <div className="max-w-xs space-y-2 text-center md:text-left select-none">
          <h4 className="text-white font-bold text-sm tracking-wide">Let&apos;s Connect</h4>
          <p className="text-gray-400 text-xs leading-relaxed">
            Interested in system administration, backend development, or open-source collaboration? Reach out.
          </p>
        </div>

        {/* Contact list */}
        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[240px]">
          {contactItems.map((item) => (
            <div key={item.label}>
              {item.actionType === "link" ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded border border-white/[0.04] bg-black/40 hover:bg-white/[0.02] hover:border-violet-500/30 text-gray-400 hover:text-white transition-all duration-300 interactive-cursor select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-violet-400">{item.icon}</span>
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-400 group-hover:text-white">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-600 truncate max-w-[140px] sm:max-w-none">{item.value}</span>
                </a>
              ) : (
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-3.5 rounded border border-white/[0.04] bg-black/40 hover:bg-white/[0.02] hover:border-violet-500/30 text-gray-400 hover:text-white transition-all duration-300 interactive-cursor select-none focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-violet-400">{item.icon}</span>
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-400">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 truncate max-w-[140px]">{item.value}</span>
                    <span className="text-violet-400/80">
                      {item.feedback ? <Check size={12} className="animate-scale" /> : <Copy size={12} />}
                    </span>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Copy notification toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-8 right-8 z-50 px-4 py-3 rounded bg-violet-950/95 border border-violet-500/30 text-white font-mono text-xs flex items-center gap-2 accent-glow-box shadow-xl shadow-violet-500/10"
          >
            <Check size={14} className="text-violet-400" />
            <span>Discord username copied!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
