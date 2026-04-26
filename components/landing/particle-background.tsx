"use client";

import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("./antigravity"), { ssr: false });

export function ParticleBackground() {
  return (
    <Antigravity
      count={300}
      magnetRadius={6}
      ringRadius={7}
      waveSpeed={0.4}
      waveAmplitude={1}
      particleSize={1.5}
      lerpSpeed={0.05}
      color="#7c6f5a"
      autoAnimate={true}
      particleVariance={1}
    />
  );
}
