"use client";

import { portfolioConfig } from "@/config/portfolio";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.04] bg-[#000000] py-8 px-6 font-mono text-[10px] md:text-xs text-gray-500 select-none">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-center sm:text-left leading-relaxed">
          Built with passion, powered by curiosity.
        </p>
        <p className="text-center sm:text-right text-gray-600 select-text">
          &copy; {currentYear} {portfolioConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
