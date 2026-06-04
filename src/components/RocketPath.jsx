import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// Phase definitions: which question indices belong to each phase
const PHASES = [
  { en: 'Who is your child?',  ar: 'مين ابنك؟',            qs: [0, 1] },
  { en: 'How do they think?',  ar: 'كيف بيفكر؟',           qs: [2, 3, 4] },
  { en: 'What do they need?',  ar: 'شو بيحتاج؟',           qs: [5, 6] },
];

export default function RocketPath({ current, total }) {
  const { t } = useLanguage();

  return (
    <div className="rocket-path-wrap">
      <div className="rocket-path-phases">
        {PHASES.map((phase, phaseIdx) => {
          const phaseActive = phase.qs.includes(current);
          const phaseDone   = phase.qs.every(q => q < current);

          return (
            <React.Fragment key={phaseIdx}>
              <div className={`phase-section ${phaseActive ? 'active' : ''} ${phaseDone ? 'done' : ''}`}>
                <p className="phase-label">{t(phase.en, phase.ar)}</p>
                <div className="phase-dots">
                  {phase.qs.map(qIdx => {
                    const isDone   = qIdx < current;
                    const isActive = qIdx === current;
                    return (
                      <div
                        key={qIdx}
                        className={`path-stop ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                      >
                        {isActive && <span className="path-rocket-icon">🚀</span>}
                        <div className="path-star-icon" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Divider between phases */}
              {phaseIdx < PHASES.length - 1 && (
                <div className="phase-divider" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
