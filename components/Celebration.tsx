import React, { useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  type: 'heart' | 'confetti';
  animationType: 'pop' | 'float-up';
}

export const useCelebration = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const trigger = (x: number, y: number) => {
    const colors = ['#800000', '#B8860B', '#FFD700', '#FF69B4', '#FFFFFF'];
    const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 60,
      y: y + (Math.random() - 0.5) * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 10,
      type: Math.random() > 0.3 ? 'heart' : 'confetti',
      animationType: 'pop'
    }));

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1200);
  };

  const triggerPageChange = () => {
    const colors = ['#800000', '#B8860B', '#FF69B4'];
    const count = window.innerWidth < 768 ? 15 : 30;
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + 100,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 15 + 15,
      type: 'heart',
      animationType: 'float-up'
    }));

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 3000);
  };

  return { particles, trigger, triggerPageChange };
};

const CelebrationOverlay: React.FC<{ particles: Particle[] }> = ({ particles }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className={`${p.animationType === 'pop' ? 'heart-particle' : 'page-transition-heart'}`}
          style={{
            left: p.x,
            top: p.y,
            color: p.color,
            fontSize: `${p.size}px`,
            '--float-delay': `${Math.random() * 0.5}s`,
            '--float-duration': `${2 + Math.random()}s`,
          } as React.CSSProperties}
        >
          {p.type === 'heart' ? '❤️' : '✨'}
        </div>
      ))}
      <style>{`
        .page-transition-heart {
          position: fixed;
          bottom: -50px;
          animation: floatUp var(--float-duration) ease-out forwards;
          animation-delay: var(--float-delay);
          opacity: 0;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CelebrationOverlay;