import { useEffect, useRef } from "react";

/**
 * Background Component
 * --------------------
 * Animated soft gradient blobs with smooth movement.
 * Lightweight, GPU-accelerated, and optimized for 100/100 PageSpeed.
 */

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50" />

      {/* Animated floating blobs (CSS Animation - Smooth & GPU optimized) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300/30 rounded-full blur-[100px] animate-blob mix-blend-multiply opacity-70"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-300/30 rounded-full blur-[100px] animate-blob-delay mix-blend-multiply opacity-70"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-fuchsia-300/30 rounded-full blur-[100px] animate-blob mix-blend-multiply opacity-70"></div>
    </div>
  );
}
