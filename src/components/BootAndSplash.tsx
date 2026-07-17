"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootAndSplashProps {
  onComplete: () => void;
}

export default function BootAndSplash({ onComplete }: BootAndSplashProps) {
  const [bootStep, setBootStep] = useState(0);
  const [stage, setStage] = useState<"boot" | "splash" | "complete">(() => {
    if (typeof window !== "undefined") {
      const hasBooted = sessionStorage.getItem("site_booted");
      if (hasBooted === "true") {
        return "complete";
      }
    }
    return "boot";
  });

  useEffect(() => {
    // If we've already booted, notify the parent asynchronously
    const hasBooted = typeof window !== "undefined" && sessionStorage.getItem("site_booted") === "true";
    if (hasBooted) {
      const timer = setTimeout(() => {
        onComplete();
      }, 0);
      return () => clearTimeout(timer);
    }

    // Sequence of boot logs
    // Under 2 seconds total for boot logs
    const timers: NodeJS.Timeout[] = [];

    const steps = [
      { delay: 0 },    // Initializing system...
      { delay: 250 },  // Loading modules...
      { delay: 500 },  // Mounting filesystem...
      { delay: 750 },  // Launching interface...
      { delay: 1100 }, // Welcome.
      { delay: 1550 }, // Transition to Terminal Splash
    ];

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        if (index === 5) {
          setStage("splash");
        } else {
          setBootStep(index + 1);
        }
      }, step.delay);
      timers.push(timer);
    });

    // Terminal Splash Duration (approx. 1 second)
    const splashTimer = setTimeout(() => {
      setStage("complete");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("site_booted", "true");
      }
      onComplete();
    }, 2750); // 1550ms + 1200ms

    timers.push(splashTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  if (stage === "complete") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] text-white font-mono select-none">
      <AnimatePresence mode="wait">
        {stage === "boot" && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg px-6 flex flex-col gap-1 items-start text-left text-sm md:text-base"
          >
            {bootStep >= 1 && (
              <div className="flex gap-2">
                <span className="text-gray-500">[ 0.000 ]</span>
                <span>Initializing system...</span>
              </div>
            )}
            {bootStep >= 2 && (
              <div className="flex gap-2">
                <span className="text-gray-500">[ 0.231 ]</span>
                <span>Loading modules...</span>
              </div>
            )}
            {bootStep >= 3 && (
              <div className="flex gap-2">
                <span className="text-gray-500">[ 0.495 ]</span>
                <span>Mounting filesystem...</span>
              </div>
            )}
            {bootStep >= 4 && (
              <div className="flex gap-2">
                <span className="text-gray-500">[ 0.741 ]</span>
                <span>Launching interface...</span>
              </div>
            )}
            {bootStep >= 5 && (
              <div className="mt-4 text-violet-400 font-bold accent-glow-text">
                Welcome.
              </div>
            )}
          </motion.div>
        )}

        {stage === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-base md:text-lg flex items-center justify-center"
          >
            <span className="text-white">manveer@arch:~$</span>
            <span className="terminal-cursor" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
