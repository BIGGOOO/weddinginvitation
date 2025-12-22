import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  type: 'heart' | 'confetti';
}

export const useCelebration = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const trigger = (x: number, y: number) => {
    const colors = ['#800000', '#B8860B', '#FFD700', '#FF69B4', '#FFFFFF'];
    const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 10,
      type: Math.random() > 0.3 ? 'heart' : 'confetti'
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Cleanup after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  return { particles, trigger };
};

const CelebrationOverlay: React.FC<{ particles: Particle[] }> = ({ particles }) => {
  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="heart-particle"
          style={{
            left: p.x,
            top: p.y,
            color: p.color,
            fontSize: `${p.size}px`,
          }}
        >
          {p.type === 'heart' ? '❤️' : '✨'}
        </div>
      ))}
    </>
  );
};

export default CelebrationOverlay;