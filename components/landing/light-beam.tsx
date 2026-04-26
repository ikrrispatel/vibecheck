"use client";

import { useEffect, useRef } from "react";

export function LightBeamEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.65, y: 0.5 });
  const cur = useRef({ x: 0.65, y: 0.5 });
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sync = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    sync();

    const onResize = () => sync();
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const HALF = Math.PI / 6; // 30° each side = 60° total cone

    const draw = () => {
      cur.current.x = lerp(cur.current.x, mouse.current.x, 0.055);
      cur.current.y = lerp(cur.current.y, mouse.current.y, 0.055);

      const W = canvas.width;
      const H = canvas.height;
      const fx = cur.current.x * W;
      const fy = cur.current.y * H;
      const R = Math.hypot(W, H) * 1.6;

      ctx.clearRect(0, 0, W, H);

      // ── Dark shadow cone (60°, pointing left from focal point) ───────
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.arc(fx, fy, R, Math.PI - HALF, Math.PI + HALF);
      ctx.closePath();
      const shadowGrad = ctx.createRadialGradient(fx, fy, 8, fx, fy, R * 0.72);
      shadowGrad.addColorStop(0,    "rgba(12, 10, 8, 0.00)");
      shadowGrad.addColorStop(0.03, "rgba(12, 10, 8, 0.38)");
      shadowGrad.addColorStop(0.25, "rgba(12, 10, 8, 0.28)");
      shadowGrad.addColorStop(0.55, "rgba(12, 10, 8, 0.14)");
      shadowGrad.addColorStop(0.85, "rgba(12, 10, 8, 0.05)");
      shadowGrad.addColorStop(1,    "rgba(12, 10, 8, 0.00)");
      ctx.fillStyle = shadowGrad;
      ctx.fill();

      // ── Upper edge ray — sharp amber/gold ───────────────────────────
      const topA = Math.PI - HALF;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.arc(fx, fy, R * 0.88, topA - 0.02, topA + 0.02);
      ctx.closePath();
      const topGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, W * 0.7);
      topGrad.addColorStop(0,    "rgba(255, 200, 55, 0.00)");
      topGrad.addColorStop(0.04, "rgba(255, 185, 40, 0.70)");
      topGrad.addColorStop(0.25, "rgba(255, 160, 20, 0.30)");
      topGrad.addColorStop(0.6,  "rgba(255, 130,  5, 0.08)");
      topGrad.addColorStop(1,    "rgba(255, 110,  0, 0.00)");
      ctx.fillStyle = topGrad;
      ctx.fill();

      // ── Lower edge ray — sharp sky blue ─────────────────────────────
      const botA = Math.PI + HALF;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.arc(fx, fy, R * 0.88, botA - 0.02, botA + 0.02);
      ctx.closePath();
      const botGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, W * 0.7);
      botGrad.addColorStop(0,    "rgba(130, 180, 255, 0.00)");
      botGrad.addColorStop(0.04, "rgba(120, 172, 255, 0.70)");
      botGrad.addColorStop(0.25, "rgba(100, 155, 255, 0.30)");
      botGrad.addColorStop(0.6,  "rgba( 80, 135, 240, 0.08)");
      botGrad.addColorStop(1,    "rgba( 60, 115, 220, 0.00)");
      ctx.fillStyle = botGrad;
      ctx.fill();

      // ── Right-side specular blue streak ─────────────────────────────
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.arc(fx, fy, R * 0.52, -0.07, 0.07);
      ctx.closePath();
      const specGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, R * 0.42);
      specGrad.addColorStop(0,    "rgba(210, 230, 255, 0.00)");
      specGrad.addColorStop(0.05, "rgba(205, 228, 255, 0.32)");
      specGrad.addColorStop(0.3,  "rgba(190, 215, 255, 0.13)");
      specGrad.addColorStop(1,    "rgba(175, 205, 255, 0.00)");
      ctx.fillStyle = specGrad;
      ctx.fill();

      // ── Focal warm glow ──────────────────────────────────────────────
      const gr = Math.min(W, H) * 0.09;
      const gGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, gr);
      gGrad.addColorStop(0,    "rgba(255, 255, 255, 0.96)");
      gGrad.addColorStop(0.10, "rgba(255, 228, 148, 0.82)");
      gGrad.addColorStop(0.28, "rgba(255, 188, 70,  0.44)");
      gGrad.addColorStop(0.52, "rgba(255, 150, 38,  0.16)");
      gGrad.addColorStop(0.76, "rgba(200, 148, 255, 0.07)");
      gGrad.addColorStop(1,    "rgba(155, 125, 255, 0.00)");
      ctx.beginPath();
      ctx.arc(fx, fy, gr, 0, Math.PI * 2);
      ctx.fillStyle = gGrad;
      ctx.fill();

      // ── Crisp bright core point ──────────────────────────────────────
      const cGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 7);
      cGrad.addColorStop(0,   "rgba(255, 255, 255, 1.00)");
      cGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.82)");
      cGrad.addColorStop(1,   "rgba(255, 255, 255, 0.00)");
      ctx.beginPath();
      ctx.arc(fx, fy, 7, 0, Math.PI * 2);
      ctx.fillStyle = cGrad;
      ctx.fill();

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
