import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { profiles } from '../data/profiles';
import { COMPANY_NAME, PROGRAM_NAME } from '../config';

const PROFILE_ORDER = ['creative', 'engineer', 'gameDesigner', 'aiExplorer', 'leader'];

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

        {/* ── Rocket Hero ── */}
        <div className="rocket-hero">
          <div className="rocket-scene">
            {/* Astronaut kid on rocket */}
            <div className="rocket-kid">🧑‍🚀</div>
            <div className="rocket-body">🚀</div>
            {/* Flame exhaust */}
            <div className="rocket-flame">
              <div className="flame flame-1" />
              <div className="flame flame-2" />
              <div className="flame flame-3" />
            </div>
          </div>
          {/* Launchpad */}
          <div className="launchpad">
            <div className="launchpad-top" />
            <div className="launchpad-legs">
              <div className="launchpad-leg" />
              <div className="launchpad-leg" />
              <div className="launchpad-leg" />
            </div>
          </div>
        </div>

        {/* Hero text */}
        <h1 className="landing-headline">
          {t('Every kid has a rocket.', 'كل ولد عنده صاروخ.')}
        </h1>
        <p className="landing-sub">
          {t("Let's find out which planet they're headed to.", 'خلّينا نكتشف شو كوكبو.')}
        </p>
        <p className="landing-body-text">
          {t(
            `Answer 7 quick questions and discover your child's unique tech learning profile — then book a free trial session at ${PROGRAM_NAME}.`,
            `جاوب على ٧ أسئلة واكتشف البروفايل التقني الخاص بابنك — وبعدين احجز جلسة تجريبية مجانية في ${PROGRAM_NAME}.`
          )}
        </p>

        {/* CTA */}
        <button className="btn btn-launch" onClick={onStart}>
          {t('Start the Mission →', 'ابدأ المهمة ←')}
        </button>

        {/* Mystery planets */}
        <div className="mystery-planets-wrap">
          <p className="mystery-hint">
            {t('5 planets. Only one is yours.', '٥ كواكب. واحد منهم كوكبك.')}
          </p>
          <div className="mystery-planets">
            {PROFILE_ORDER.map((key, i) => {
              const p = profiles[key];
              return (
                <div key={key} className="mystery-planet-item">
                  <div
                    className="mystery-planet"
                    style={{
                      '--planet-glow': p.glowColor,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  />
                  <span className="mystery-label">???</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="disclaimer" style={{ marginTop: 20 }}>
          {t(
            'A fun assessment to explore your child\'s tech learning style. Not a clinical evaluation.',
            'تقييم ممتع لاستكشاف أسلوب تعلم ابنك التقني. مش تقييم سريري.'
          )}
        </p>

      </div>
    </div>
  );
}
