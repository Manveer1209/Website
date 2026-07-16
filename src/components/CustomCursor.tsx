"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHiddenOnText, setIsHiddenOnText] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0);

  // Mouse positions
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Physics settings for spring delay
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const ringConfig = { damping: 25, stiffness: 200, mass: 0.8 }; // outer ring has more lag

  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const ringX = useSpring(mouseX, ringConfig);
  const ringY = useSpring(mouseY, ringConfig);

  useEffect(() => {
    // Check touch capabilities
    const isTouch = 
      typeof window !== "undefined" && 
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setIsTouchDevice(isTouch);

    // Check reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    if (isTouch) return;

    // Track mouse coordinates
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);

      // Check what element we are hovering over
      const target = e.target as HTMLElement;
      if (!target) return;

      // Restore native cursor and hide custom cursor on text nodes / inputs
      const style = window.getComputedStyle(target);
      const isTextInput = 
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" || 
        target.isContentEditable;
      
      const isTextCursor = style.cursor === "text";
      setIsHiddenOnText(isTextInput || isTextCursor);

      // Detect interactive elements (links, buttons, clickable divs)
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") !== null || 
        target.closest("button") !== null || 
        target.closest('[role="button"]') !== null || 
        target.classList.contains("interactive-cursor") ||
        style.cursor === "pointer";
      
      setIsHovered(isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track scroll to morph outer ring
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const speed = Math.min(Math.abs(currentScrollY - lastScrollY) * 0.15, 20);
      setScrollSpeed(speed);
      lastScrollY = currentScrollY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollSpeed(0);
      }, 100);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearTimeout(scrollTimeout);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render custom cursor on touch devices or if reduced motion is requested
  if (isTouchDevice || reducedMotion) return null;

  // Outer ring scale and rotation deformation during scroll
  const ringScale = isClicked ? 0.75 : isHovered ? 1.4 : 1;
  const innerDotScale = isClicked ? 0.5 : isHovered ? 0.8 : 1;
  const glowOpacity = isHovered ? 0.8 : 0.35;
  const glowSize = isHovered ? "180px" : "110px";

  // Cursor is hidden if not visible or hovering selectable text
  const opacity = isVisible && !isHiddenOnText ? 1 : 0;

  return (
    <>
      {/* Outer Radial Glow (Soft blue/purple accent) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: glowSize,
          height: glowSize,
          background: "radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(0, 0, 0, 0) 100%)",
          opacity: opacity * glowOpacity,
        }}
        transition={{ type: "tween", ease: "backOut" }}
      />

      {/* Outer Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: ringScale,
          opacity: opacity * 0.8,
          // Morph shape on scroll speed (skew/flatten slightly)
          skewY: scrollSpeed > 1 ? Math.min(scrollSpeed * 0.5, 12) : 0,
        }}
        animate={{
          borderColor: isHovered ? "rgba(167, 139, 250, 0.5)" : "rgba(255, 255, 255, 0.2)",
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Solid Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: innerDotScale,
          opacity: opacity,
        }}
        animate={{
          backgroundColor: isHovered ? "#a78bfa" : "#ffffff",
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
