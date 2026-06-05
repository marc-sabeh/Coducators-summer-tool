import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { profiles, PROFILE_ORDER } from '../data/profiles';
import { COMPANY_NAME, PROGRAM_NAME } from '../config';

// Big inline SVG rocket for hero
function HeroRocket() {
  return (
    <div className="hero-rocket-wrap">
      <div className="hero-rocket-scene">
        {/* Astronaut sitting on rocket */}
        <div className="hero-astronaut">🧑‍🚀</div>

        <svg
          className="hero-rocket-svg"
          width="90" height="140"
          viewBox="0 0 90 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main body */}
          <ellipse cx="45" cy="70" rx="28" ry="50" fill="#dce8ff" />
          {/* Nose cone */}
          <path d="M45 5 C30 5 17 25 17 45 L73 45 C73 25 60 5 45 5Z" fill="#3586c7" />
          {/* Window */}
          <circle cx="45" cy="58" r="14" fill="#3586c7" opacity="0.9" />
          <circle cx="45" cy="58" r="10" fill="#7ab8f5" opacity="0.7" />
          <circle cx="40" cy="54" r="3" fill="white" opacity="0.5" />
          {/* Left fin */}
          <path d="M17 95 Q4 115 18 108 L25 85 Z" fill="#2567a8" />
          {/* Right fin */}
          <path d="M73 95 Q86 115 72 108 L65 85 Z" fill="#2567a8" />
          {/* Bottom ring */}
          <ellipse cx="45" cy="118" rx="22" ry="6" fill="#b8cce8" opacity="0.7" />
          {/* Stripes */}
          <rect x="20" y="78" width="50" height="4" rx="2" fill="rgba(53,134,199,0.3)" />
          <rect x="22" y="86" width="46" height="3" rx="1.5" fill="rgba(53,134,199,0.2)" />
        </svg>

        {/* Flame */}
        <div className="hero-flame-wrap">
          <div className="hero-flame hero-flame-l" />
          <div className="hero-flame hero-flame-c" />
          <div className="hero-flame hero-flame-r" />
        </div>
      </div>

      {/* Launch pad */}
      <div className="hero-launchpad">
        <div className="hero-pad-top" />
        <div className="hero-pad-legs">
          <div className="hero-pad-leg" />
          <div className="hero-pad-leg" />
          <div className="hero-pad-leg" />
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ onStart }) {
  const { t, isAr } = useLanguage();

  return (
    <div className="page landing-page">
      <div className="page-inner" style={{ paddingTop: 0, paddingBottom: 40 }}>

        {/* Logo */}
        <img
          src="/logo.png"
          alt={COMPANY_NAME}
          className="landing-logo"
          onError={e => { e.target.style.display = 'none'; }}
        />

        {/* Big rocket hero */}
        <HeroRocket />

        {/* Headlines */}
        <h1 className="landing-headline">
          {t('Every kid has a rocket.', 'كل ولد عنده صاروخ.')}
        </h1>
        <p className="landing-sub">
          {t("Let's find out which planet they're headed to.", 'خلّينا نكتشف شو كوكبو.')}
        </p>
        <p className="landing-body-text">
          {t(
            `Answer 7 quick questions and discover your child's unique tech learning profile — then book a free trial at ${PROGRAM_NAME}.`,
            `جاوب على ٧ أسئلة واكتشف البروفايل التقني الخاص بابنك — وبعدين احجز جلسة تجريبية مجانية في ${PROGRAM_NAME}.`
          )}
        </p>

        {/* CTA */}
        <button className="btn btn-launch" onClick={onStart}>
          {t('Start the Mission →', 'ابدأ المهمة ←')}
        </button>

        {/* 5 real colored planets with profile icons */}
        <div className="planets-teaser-wrap">
          <p className="planets-teaser-hint">
            {t('5 planets. Only one is yours.', '٥ كواكب. واحد منهم كوكبك.')}
          </p>
          <div className="planets-teaser-row">
            {PROFILE_ORDER.map((key, i) => {
              const p = profiles[key];
              return (
                <div key={key} className="planet-teaser-item" style={{ '--delay': `${i * 0.3}s` }}>
                  <div
                    className="planet-teaser-ball"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${p.lightColor}, ${p.darkColor})`,
                      boxShadow: `0 0 18px ${p.glowColor}, 0 0 36px ${p.glowColor}`,
                    }}
                  >
                    <span className="planet-teaser-icon">{p.icon}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="disclaimer" style={{ marginTop: 20 }}>
          {t(
            "A fun assessment to explore your child's tech learning style. Not a clinical evaluation.",
            'تقييم ممتع لاستكشاف أسلوب تعلم ابنك التقني. مش تقييم سريري.'
          )}
        </p>

      </div>
    </div>
  );
}
