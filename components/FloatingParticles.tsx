import React from 'react';

const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 15 + 15}s`,
    delay: `${Math.random() * 10}s`,
    size: `${Math.random() * 10 + 10}px`,
    type: Math.random() > 0.5 ? 'petal' : 'sparkle'
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute opacity-0"
          style={{
            left: p.left,
            bottom: '-10%',
            fontSize: p.size,
            animation: `float-particle ${p.duration} linear infinite`,
            animationDelay: p.delay,
          }}
        >
          {p.type === 'petal' ? (
            <span className="text-pink-200/40">🌸</span>
          ) : (
            <span className="text-gold/20">✨</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;