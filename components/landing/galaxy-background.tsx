'use client';
import dynamic from 'next/dynamic';

const Galaxy = dynamic(() => import('./galaxy'), { ssr: false });

export function GalaxyBackground() {
  return (
    <Galaxy
      mouseInteraction={true}
      mouseRepulsion={true}
      repulsionStrength={3}
      density={1.1}
      glowIntensity={0.35}
      saturation={0.4}
      hueShift={225}
      twinkleIntensity={0.5}
      rotationSpeed={0.03}
      speed={0.9}
      transparent={true}
    />
  );
}
