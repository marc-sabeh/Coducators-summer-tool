import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { profiles } from '../data/profiles';

export default function LaunchSequence({ winnerKey, onComplete }) {
  const { isAr, lang } = useLanguage();
  const profile = profiles[winnerKey] || profiles.creative;

  const [act,     setAct]     = useState(1);     // 1 | 2 | 3
  const [count,   setCount]   = useState(3);     // 3 → 2 → 1
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const doShake = () => {
      setShaking(true);
      setTimeout(() => setShaking(false), 300);
    };

    // Act 1 — countdown ticks at 0 / 600 / 1200 ms
    doShake();                                            // count=3, immediate

    const t1 = setTimeout(() => { setCount(2); doShake(); },  600);
    const t2 = setTimeout(() => { setCount(1); doShake(); }, 1200);
    const t3 = setTimeout(() => setAct(2),                   1800); // Act 2: rocket
    const t4 = setTimeout(() => setAct(3),                   3200); // Act 3: planet fill
    const t5 = setTimeout(() => onComplete(),                4400); // done

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <div className={`launch-page${shaking ? ' screen-shake' : ''}`}>

      {/* ── Act 1: Countdown ── */}
      {act === 1 && (
        <div className="launch-countdown">
          <div className="launch-count-number" key={count}>
            {count}
          </div>
          <p className="launch-count-label">
            {lang === 'ar' ? 'الإقلاع خلال…' : lang === 'fr' ? 'Lancement dans…' : 'Launching in…'}
          </p>
        </div>
      )}

      {/* ── Act 2: Rocket flight + target planet ── */}
      {act === 2 && (
        <div className="launch-flight-wrap">
          <div className="launch-flight-trail" />
          <div className={`launch-flight-rocket${isAr ? ' rtl' : ''}`}>🚀</div>
          <div
            className="launch-target-planet"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${profile.lightColor}, ${profile.darkColor})`,
              boxShadow: `0 0 28px ${profile.glowColor}, 0 0 60px ${profile.glowColor}`,
            }}
          >
            <span className="launch-target-icon">{profile.icon}</span>
          </div>
        </div>
      )}

      {/* ── Act 3: Planet fills screen ── */}
      {act === 3 && (
        <div
          className="launch-planet-expand"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${profile.lightColor}, ${profile.darkColor})`,
          }}
        >
          <span className="launch-planet-icon">{profile.icon}</span>
        </div>
      )}
    </div>
  );
}
