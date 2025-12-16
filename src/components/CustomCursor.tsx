import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'text'>('default');

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const smoothX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(cursorY, { stiffness: 150, damping: 20 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile on mount
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleButtonEnter = () => setHoverType('button');
    const handleTextEnter = () => setHoverType('text');
    const handleLeave = () => setHoverType('default');

    window.addEventListener("mousemove", moveCursor);

    // Button/link hover handlers
    const interactiveElements = document.querySelectorAll("button, a, input, [role='button']");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleButtonEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    // Text hover handlers for spotlight effect
    const textElements = document.querySelectorAll("h1, h2, h3, p, span");
    textElements.forEach((el) => {
      el.addEventListener("mouseenter", handleTextEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleButtonEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
      textElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleTextEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [cursorX, cursorY, isMobile]);

  if (isMobile) return null;

  // Different cursor styles based on hover type
  const getCursorStyles = () => {
    switch (hoverType) {
      case 'button':
        return {
          width: 24,
          height: 24,
          opacity: 0.7,
          filter: 'blur(8px)',
        };
      case 'text':
        return {
          width: 80,
          height: 80,
          opacity: 0.3,
          filter: 'blur(20px)',
        };
      default:
        return {
          width: 64,
          height: 64,
          opacity: 0.2,
          filter: 'blur(32px)',
        };
    }
  };

  const styles = getCursorStyles();

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none rounded-full mix-blend-screen z-[9999] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: styles.width,
        height: styles.height,
        opacity: styles.opacity,
        filter: styles.filter,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    />
  );
}
