import { useEffect, useRef } from "react";

/**
 * Background Component
 * --------------------
 * Animated soft gradient blobs with smooth movement.
 * Lightweight, GPU-accelerated, and optimized for 100/100 PageSpeed.
 */

export default function Background() {
  const blobsRef = useRef([]);

  useEffect(() => {
    let frame;
    const blobs = blobsRef.current.map((blob) => ({
      el: blob,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      size: blob.offsetWidth,
    }));

    const animate = () => {
      blobs.forEach((b) => {
        b.x += b.dx;
        b.y += b.dy;

        if (b.x < -100 || b.x > window.innerWidth + 100) b.dx *= -1;
        if (b.y < -100 || b.y > window.innerHeight + 100) b.dy *= -1;

        b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
      });
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50" />

      {/* Animated floating blobs */}
      <div
        ref={(el) => (blobsRef.current[0] = el)}
        className="absolute w-72 h-72 bg-pink-300/40 rounded-full blur-3xl mix-blend-multiply"
      ></div>
      <div
        ref={(el) => (blobsRef.current[1] = el)}
        className="absolute w-96 h-96 bg-rose-300/40 rounded-full blur-3xl mix-blend-multiply"
      ></div>
      <div
        ref={(el) => (blobsRef.current[2] = el)}
        className="absolute w-80 h-80 bg-fuchsia-300/40 rounded-full blur-3xl mix-blend-multiply"
      ></div>
    </div>
  );
}
