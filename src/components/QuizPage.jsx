import React, { useState, useEffect, useRef } from 'react';
import { questions } from '../data/questions';
import { useLanguage } from '../context/LanguageContext';
import RocketPath from './RocketPath';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Hardcoded comet positions for the transit overlay
const COMETS = [
  { left: '8%',  top: '12%', h: 22, delay: '0.05s', dur: '0.65s' },
  { left: '20%', top: '5%',  h: 18, delay: '0.2s',  dur: '0.7s'  },
  { left: '35%', top: '18%', h: 24, delay: '0.35s', dur: '0.6s'  },
  { left: '50%', top: '8%',  h: 20, delay: '0.1s',  dur: '0.75s' },
  { left: '62%', top: '22%', h: 16, delay: '0.45s', dur: '0.6s'  },
  { left: '75%', top: '14%', h: 22, delay: '0.3s',  dur: '0.65s' },
  { left: '88%', top: '30%', h: 18, delay: '0.15s', dur: '0.7s'  },
  { left: '14%', top: '40%', h: 20, delay: '0.5s',  dur: '0.6s'  },
  { left: '42%', top: '35%', h: 26, delay: '0.25s', dur: '0.75s' },
  { left: '68%', top: '45%', h: 18, delay: '0.4s',  dur: '0.65s' },
  { left: '28%', top: '55%', h: 16, delay: '0.55s', dur: '0.6s'  },
  { left: '82%', top: '55%', h: 22, delay: '0.08s', dur: '0.7s'  },
  { left: '55%', top: '60%', h: 20, delay: '0.32s', dur: '0.65s' },
  { left: '92%', top: '20%', h: 18, delay: '0.48s', dur: '0.6s'  },
];

// Full-screen flying animation between questions
function TransitOverlay({ onDone, isAr }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="transit-overlay">
      {/* Shooting comets */}
      {COMETS.map((c, i) => (
        <div
          key={i}
          className="transit-comet"
          style={{ left: c.left, top: c.top, height: c.h, '--delay': c.delay, '--dur': c.dur }}
        />
      ))}

      {/* Glowing mystery planet at top-right */}
      <div className="transit-planet" />

      {/* Kid astronaut flying from bottom-left toward planet */}
      <div className={`transit-kid-wrap ${isAr ? 'rtl' : ''}`}>
        <div className="transit-kid">🧑‍🚀</div>
        <div className="transit-exhaust">
          <div className="transit-flame" />
        </div>
      </div>
    </div>
  );
}

export default function QuizPage({ initialAnswers, onComplete, onBack }) {
  const { t, num, isAr } = useLanguage();
  const total = questions.length;

  const [answers, setAnswers]       = useState(initialAnswers || Array(total).fill(null));
  const [current, setCurrent]       = useState(() => {
    const first = (initialAnswers || []).findIndex(a => a === null);
    return first === -1 ? 0 : first;
  });
  const [selected, setSelected]     = useState(null);
  const [advancing, setAdvancing]   = useState(false);
  const [showTransit, setShowTransit] = useState(false);

  // Store pending advance info so transit callback can act on it
  const pending = useRef(null);

  const q = questions[current];

  useEffect(() => {
    setSelected(answers[current] ?? null);
  }, [current]);

  const handleAnswer = idx => {
    if (advancing) return;

    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
    setSelected(idx);
    setAdvancing(true);

    // Save what we need for after the transit
    pending.current = {
      updated,
      isLast: current >= total - 1,
      nextIdx: current + 1,
    };

    // Brief pause so the selected answer highlights, then launch transit
    setTimeout(() => setShowTransit(true), 300);
  };

  const handleTransitDone = () => {
    setShowTransit(false);
    const { updated, isLast, nextIdx } = pending.current;
    setAdvancing(false);
    if (isLast) {
      onComplete(updated);
    } else {
      setCurrent(nextIdx);
    }
  };

  const handleBack = () => {
    if (current === 0) onBack();
    else setCurrent(c => c - 1);
  };

  return (
    <div className="quiz-page" style={{ position: 'relative', zIndex: 10 }}>

      {/* FLYING TRANSIT OVERLAY */}
      {showTransit && <TransitOverlay onDone={handleTransitDone} isAr={isAr} />}

      {/* Progress path */}
      <RocketPath current={current} total={total} />

      {/* Question body */}
      <div className="quiz-body">
        <div className="card question-card" key={current}>
          <p className="question-num">
            {t(`Question ${current + 1} of ${total}`, `سؤال ${num(current + 1)} من ${num(total)}`)}
          </p>
          <p className="question-text">
            {isAr ? q.text_ar : q.text_en}
          </p>

          <div className="answers-list">
            {q.answers.map((ans, idx) => {
              const isSelected = selected === idx;
              return (
                <button
                  key={idx}
                  className={`answer-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswer(idx)}
                  disabled={advancing}
                >
                  <span className="answer-letter">{LETTERS[idx]}</span>
                  <span>{isAr ? ans.text_ar : ans.text_en}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="camp-msg">
          🪐 {isAr ? q.campMessage_ar : q.campMessage_en}
        </p>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button className="btn-ghost" onClick={handleBack}>
            {t('← Back', '→ رجوع')}
          </button>
        </div>
      </div>
    </div>
  );
}
