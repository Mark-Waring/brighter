import React, { useEffect } from "react";

export default function FeedbackOverlay({
  isCorrect,
  isVisible,
  onAnimationEnd,
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onAnimationEnd, 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isCorrect
          ? "rgba(72, 187, 120, 0.4)"
          : "rgba(245, 101, 101, 0.4)",
        pointerEvents: "none",
        animation: "fadeOut 0.2s ease-out",
        zIndex: 1000,
      }}
    />
  );
}
