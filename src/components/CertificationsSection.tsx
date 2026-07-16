"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { portfolioConfig } from "@/config/portfolio";

export default function CertificationsSection() {
  const certs = portfolioConfig.certifications;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto font-mono">
      {certs.map((cert, idx) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="border border-white/[0.06] bg-white/[0.01] rounded-lg p-5 flex items-start gap-4 hover:border-violet-400/20 transition-all duration-300 accent-glow-box-hover"
        >
          {/* Certificate Badge Preview Mockup */}
          <div className="w-16 h-16 shrink-0 rounded border border-white/[0.08] bg-black flex flex-col items-center justify-center relative select-none">
            <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-violet-400/30" />
            <Award size={18} className="text-violet-400 mb-1" />
            <span className="text-[7px] text-gray-500 font-bold uppercase tracking-wider">
              {cert.previewText}
            </span>
          </div>

          {/* Certificate Details */}
          <div className="flex-1 flex flex-col justify-between min-h-[64px]">
            <div>
              <h4 className="text-white text-xs md:text-sm font-bold tracking-tight select-text mb-1">
                {cert.title}
              </h4>
              <p className="text-gray-400 text-[10px] md:text-xs mb-1 select-text">
                {cert.issuer}
              </p>
              <p className="text-gray-600 text-[10px] select-text">
                {cert.date}
              </p>
            </div>

            <div className="mt-3">
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-violet-400 transition-colors select-none interactive-cursor group"
              >
                <span>View Certificate</span>
                <ExternalLink size={10} className="transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
