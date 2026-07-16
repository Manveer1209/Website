"use client";

import { motion } from "framer-motion";
import { portfolioConfig } from "@/config/portfolio";

export default function SkillsSection() {
  const skills = portfolioConfig.skills;

  const categories = [
    { title: "Languages", items: skills.languages },
    { title: "Operating Systems", items: skills.operatingSystems },
    { title: "Currently Learning", items: skills.currentlyLearning },
    { title: "Interests", items: skills.interests },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto font-mono">
      {categories.map((cat, idx) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="border border-white/[0.06] bg-white/[0.01] rounded-lg p-5 flex flex-col justify-between hover:border-violet-400/20 transition-all duration-300 accent-glow-box-hover"
        >
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-2">
              <span className="text-violet-400 text-xs font-black">&gt;_</span>
              <h3 className="text-white text-sm font-bold tracking-wide uppercase">
                {cat.title}
              </h3>
            </div>
            
            <ul className="space-y-2.5">
              {cat.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-250 select-text"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400/40 inline-block" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 flex justify-end text-[10px] text-gray-700 select-none">
            {cat.items.length} item{cat.items.length !== 1 && "s"}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
