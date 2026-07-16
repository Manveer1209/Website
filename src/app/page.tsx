"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BootAndSplash from "@/components/BootAndSplash";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TerminalCard from "@/components/TerminalCard";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificationsSection from "@/components/CertificationsSection";
import GithubSection from "@/components/GithubSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import EasterEggs from "@/components/EasterEggs";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // Defer state updates to avoid synchronous cascading renders during hydration
    const timer = setTimeout(() => {
      setMounted(true);
      const hasBooted = sessionStorage.getItem("portfolio_booted");
      if (hasBooted === "true") {
        setIsBooting(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Pure black screen during initial server layout mount to prevent hydration flash
    return <div className="fixed inset-0 bg-[#000000] z-50" />;
  }

  return (
    <>
      {/* Keyboard Hook Easter Eggs Manager */}
      <EasterEggs />

      {/* Boot & Splash Sequence Overlay */}
      <AnimatePresence mode="wait">
        {isBooting && (
          <BootAndSplash onComplete={() => setIsBooting(false)} />
        )}
      </AnimatePresence>

      {/* Main Website Flow */}
      {!isBooting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col min-h-screen"
        >
          {/* Navigation Bar */}
          <Navbar />

          {/* Hero / Landing Screen */}
          <Hero />

          {/* Core Content Body Wrapper */}
          <main className="flex-1 w-full bg-[#000000]">
            
            {/* About Section */}
            <section id="about" className="py-24 px-6 relative overflow-hidden">
              <div className="max-w-3xl mx-auto mb-12 select-none">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-violet-400 font-extrabold">&gt;</span> Info
                </div>
                <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">
                  ~/about
                </h2>
                <div className="w-8 h-[1px] bg-violet-400/40 mt-3" />
              </div>
              <TerminalCard onTriggerNeofetch={() => {
                // Clicked neofetch inside terminal -> trigger Easter egg popup
                // Or let terminal render it internally. We have it rendering inside terminal,
                // and we can also trigger a nice subtle notification or log.
                console.log("Neofetch interactive shortcut clicked!");
              }} />
            </section>

            {/* Skills Section (Inline sub-section of About profile) */}
            <section id="skills" className="pb-24 px-6 relative">
              <div className="max-w-3xl mx-auto mb-12 select-none">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-violet-400 font-extrabold">&gt;</span> Stack
                </div>
                <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">
                  ~/skills
                </h2>
                <div className="w-8 h-[1px] bg-violet-400/40 mt-3" />
              </div>
              <SkillsSection />
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-24 px-6 border-t border-white/[0.04]">
              <div className="max-w-3xl mx-auto mb-12 select-none">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-violet-400 font-extrabold">&gt;</span> Works
                </div>
                <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">
                  ~/projects
                </h2>
                <div className="w-8 h-[1px] bg-violet-400/40 mt-3" />
              </div>
              <ProjectsSection />
            </section>

            {/* Certifications Section */}
            <section id="certifications" className="py-24 px-6 border-t border-white/[0.04]">
              <div className="max-w-3xl mx-auto mb-12 select-none">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-violet-400 font-extrabold">&gt;</span> Credentials
                </div>
                <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">
                  ~/certifications
                </h2>
                <div className="w-8 h-[1px] bg-violet-400/40 mt-3" />
              </div>
              <CertificationsSection />
            </section>

            {/* GitHub Section */}
            <section id="github" className="py-24 px-6 border-t border-white/[0.04]">
              <div className="max-w-3xl mx-auto mb-12 select-none">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-violet-400 font-extrabold">&gt;</span> Repositories
                </div>
                <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">
                  ~/github
                </h2>
                <div className="w-8 h-[1px] bg-violet-400/40 mt-3" />
              </div>
              <GithubSection />
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 border-t border-white/[0.04] pb-32">
              <div className="max-w-3xl mx-auto mb-12 select-none">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="text-violet-400 font-extrabold">&gt;</span> Communication
                </div>
                <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">
                  ~/contact
                </h2>
                <div className="w-8 h-[1px] bg-violet-400/40 mt-3" />
              </div>
              <ContactSection />
            </section>

          </main>

          {/* Simple footer */}
          <Footer />
        </motion.div>
      )}
    </>
  );
}
