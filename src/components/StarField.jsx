import React, { useMemo } from 'react';

// 3 layers: small/slow, medium/mid, large/fast
const LAYERS = [
  { count: 180, minSize: 1, maxSize: 1.5, minDur: 2.5, maxDur: 4.5, lo: 0.1, hi: 0.7 },
  { count: 100, minSize: 1.5, maxSize: 2.5, minDur: 1.8, maxDur: 3.2, lo: 0.2, hi: 0.9 },
  { count:  50, minSize: 2.5, maxSize: 4,   minDur: 1.2, maxDur: 2.2, lo: 0.4, hi: 1.0 },
];

function rand(min, max) { return min + Math.random() * (max - min); }

export default function StarField() {
  const stars = useMemo(() => {
    const out = [];
    LAYERS.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        out.push({
          id: out.length,
          top:   `${rand(0,100).toFixed(2)}%`,
          left:  `${rand(0,100).toFixed(2)}%`,
          size:  `${rand(layer.minSize, layer.maxSize).toFixed(1)}px`,
          dur:   `${rand(layer.minDur, layer.maxDur).toFixed(2)}s`,
          delay: `${rand(0, 5).toFixed(2)}s`,
          lo:    layer.lo,
          hi:    layer.hi,
        });
      }
    });
    return out;
  }, []);

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            top:    s.top,
            left:   s.left,
            width:  s.size,
            height: s.size,
            '--dur':   s.dur,
            '--delay': s.delay,
            '--lo':    s.lo,
            '--hi':    s.hi,
          }}
        />
      ))}
    </div>
  );
}
