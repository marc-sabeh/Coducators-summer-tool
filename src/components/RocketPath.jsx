import React, { useEffect, useRef, useState } from 'react';
import { questions } from '../data/questions';

// Inline SVG rocket — cute, round, no emoji
function RocketSVG({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="18" rx="9" ry="13" fill="#e8f0ff" />
      {/* Nose */}
      <ellipse cx="20" cy="7" rx="6" ry="7" fill="#3586c7" />
      {/* Window */}
      <circle cx="20" cy="17" r="4" fill="#3586c7" opacity="0.9" />
      <circle cx="20" cy="17" r="2.5" fill="#a0d0ff" opacity="0.8" />
      {/* Left fin */}
      <path d="M11 26 Q8 32 12 30 L14 24 Z" fill="#3586c7" />
      {/* Right fin */}
      <path d="M29 26 Q32 32 28 30 L26 24 Z" fill="#3586c7" />
      {/* Flame */}
      <ellipse cx="20" cy="32" rx="4" ry="5" fill="#ff9500" opacity="0.9" />
      <ellipse cx="20" cy="33" rx="2.5" ry="3.5" fill="#ffcc00" opacity="0.9" />
    </svg>
  );
}

export default function RocketPath({ current, total }) {
  const trackRef = useRef(null);
  const [rocketLeft, setRocketLeft] = useState(0);

  // Calculate rocket position based on current question
  useEffect(() => {
    if (!trackRef.current) return;
    const stops = trackRef.current.querySelectorAll('.path-stop');
    if (stops[current]) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const stopRect = stops[current].getBoundingClientRect();
      const left = stopRect.left - trackRect.left + stopRect.width / 2;
      setRocketLeft(left);
    }
  }, [current]);

  return (
    <div className="rocket-path-wrap">
      {/* Rocket floats above the track, slides horizontally */}
      <div className="rocket-path-track" ref={trackRef}>
        <div
          className="rocket-path-vehicle"
          style={{ left: rocketLeft }}
        >
          <RocketSVG size={32} />
          <div className="rocket-path-flame" />
        </div>

        {/* Dotted connecting line */}
        <div className="rocket-path-line" />

        {/* Stops */}
        <div className="rocket-path-stops">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`path-stop ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Question counter below */}
      <p className="rocket-path-counter">
        {current + 1} <span>/ {total}</span>
      </p>
    </div>
  );
}
