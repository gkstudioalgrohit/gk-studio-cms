"use client";
// Same tactile click feedback as the original script.js, plus actually
// opening the film's video now that the CMS can attach one.
import { useState } from "react";

export default function PlayButton({ label, onOpen }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      className="play-btn"
      aria-label={label}
      style={pressed ? { transform: "translate(-50%, -50%) scale(0.92)" } : undefined}
      onClick={() => {
        setPressed(true);
        setTimeout(() => setPressed(false), 150);
        onOpen?.();
      }}
    >
      <svg viewBox="0 0 24 24"><polygon points="9,7 18,12 9,17"></polygon></svg>
    </button>
  );
}
