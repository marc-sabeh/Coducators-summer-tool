import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { profiles } from '../data/profiles';

const MESSAGES_EN = [
  'Analyzing mission data…',
  'Identifying your child\'s strongest skills…',
  'Matching your child with their planet…',
  'Preparing mission report…',
];
const MESSAGES_AR = [
  'جارٍ تحليل بيانات المهمة…',
  'تحديد أقوى مهارات ابنك…',
  'مطابقة ابنك مع كوكبه…',
  'جارٍ إعداد تقرير المهمة…',
];

export default function LaunchSequence({ winnerKey, onComplete }) {
  const { isAr } = useLanguage();
  const [phase,   setPhase]   = useState('analyzing'); // analyzing | flying | landing
  const [msgIdx,  setMsgIdx]  = useState(0);
  const messages = isAr ? MESSAGES_AR : MESSAGES_EN;
  const profile  = profiles[winnerKey] || profiles.creative;

  useEffect(() => {
    // Cycle through messages
    const msgTimer = setInterval(() => {
      setMsgIdx(i => (i + 1 < messages.length ? i + 1 : i));
    }, 950);

    const t1 = setTimeout(() => setPhase('flying'),   800);
    const t2 = setTimeout(() => setPhase('landing'), 3000);
    const t3 = setTimeout(() => onComplete(),        4200);

    return () => {
      clearInterval(msgTimer);
      [t1, t2, t3].forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="launch-page" style={{ position: 'relative', zIndex: 10 }}>

      {/* Status text */}
      <p className="launch-status" style={{ opacity: phase === 'landing' ? 0 : 1 }}>
        {messages[msgIdx]}
      </p>

      {/* Rocket flight phase */}
      {(phase === 'analyzing' || phase === 'flying') && (
        <div className="launch-rocket-wrap">
          {phase === 'flying' && (
            <>
              <div className="launch-trail" />
              <div className="launch-rocket">🚀</div>
            </>
          )}
          {phase === 'analyzing' && (
            <div style={{ fontSize: '3rem', textAlign: 'center', animation: 'rocketBob 1.5s ease-in-out infinite' }}>
              🚀
            </div>
          )}
        </div>
      )}

      {/* Planet landing phase */}
      {phase === 'landing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div
            className="launch-planet planet-sphere"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${profile.lightColor}, ${profile.darkColor})`,
              boxShadow: `0 0 40px ${profile.glowColor}, 0 0 80px ${profile.glowColor}`,
            }}
          >
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
              {profile.icon}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: profile.color }}>
            {isAr ? profile.planet_ar : profile.planet}
          </p>
        </div>
      )}
    </div>
  );
}
