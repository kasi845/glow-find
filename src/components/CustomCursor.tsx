import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const smoothX = useSpring(cursorX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(cursorY, { stiffness: 120, damping: 20 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 25);
      cursorY.set(e.clientY - 25);
    };
    window.addEventListener("mousemove", move);

    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    const hoverables = document.querySelectorAll("button, a, input, .hover-react");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [cursorX, cursorY, isMobile]);

  if (isMobile) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 pointer-events-none rounded-full mix-blend-screen z-[9999] transition-all duration-[250ms] ${
        isHovered
          ? "w-10 h-10 bg-gradient-to-r from-[#00E5FF] via-[#C77DFF] to-[#FF4D6D] opacity-80 blur-md"
          : "w-16 h-16 bg-gradient-to-r from-[#00E5FF] via-[#C77DFF] to-[#FF4D6D] opacity-25 blur-2xl"
      }`}
      style={{ x: smoothX, y: smoothY }}
    />
  );
}
