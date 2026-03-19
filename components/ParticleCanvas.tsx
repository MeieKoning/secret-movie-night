"use client";

import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Star = { x: number; y: number; r: number; op: number; vy: number; vx: number };
    let stars: Star[] = [];
    let animId: number;

    function build() {
      if (!canvas) return;
      stars = [];
      const n = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < n; i++) {
        stars.push({
          x:  Math.random() * canvas.width,
          y:  Math.random() * canvas.height,
          r:  Math.random() * 1.4 + 0.3,
          op: Math.random() * 0.6 + 0.1,
          vy: -(Math.random() * 0.25 + 0.04),
          vx: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      build();
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.y += s.vy;
        s.x += s.vx;
        if (s.y < -4) { s.y = canvas.height + 4; s.x = Math.random() * canvas.width; }
        if (s.x < -4)  s.x = canvas.width + 4;
        if (s.x > canvas.width + 4) s.x = -4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,0,${s.op})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}
