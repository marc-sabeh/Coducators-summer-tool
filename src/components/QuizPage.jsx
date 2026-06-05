import React, { useState, useEffect, useCallback } from 'react';
import { questions } from '../data/questions';
import { useLanguage } from '../context/LanguageContext';
import RocketPath from './RocketPath';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Kid positions: [left%, top%]  — bottom-left → top-right
// Q1 starts at the bottom, Q7 lands near the planet (fixed top-right)
const KID_POSITIONS = [
  [4,  70],   // Q1 — bottom-left
  [16, 58],   // Q2
  [28, 46],   // Q3
  [41, 34],   // Q4
  [54, 22],   // Q5
  [67, 11],   // Q6
  [83,  3],   // Q7 — arrives at planet
];

export default function QuizPage({ initialAnswers, onComplete, onBack }) {
  const { t, num, isAr } = useLanguage();
  const total = questions.length;

  const [answers, setAnswers]   = useState(initialAnswers || Array(total).fill(null));
  const [current, setCurrent]   = useState(() => {
    const first = (initialAnswers || []).findIndex(a => a === null);
    return first === -1 ? 0 : first;
  });
  const [selected, setSelected] = useState(null);
  const [advancing, setAdvancing] = useState(false);
  const [flying, setFlying]     = useState(false);

  // Kid step mirrors current question index
  const [kidStep, setKidStep]   = useState(() => {
    const first = (initialAnswers || []).findIndex(a => a === null);
    return first === -1 ? 0 : first;
  });

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

    // Brief highlight pause → launch kid
    setTimeout(() => {
      setFlying(true);

      // Move kid to next position (CSS transition fires here)
      const nextKidStep = Math.min(kidStep + 1, KID_POSITIONS.length - 1);
      setKidStep(nextKidStep);

      // After flight settles, advance question
      setTimeout(() => {
        setFlying(false);
        setAdvancing(false);
        if (current < total - 1) {
          setCurrent(c => c + 1);
        } else {
          onComplete(updated);
        }
      }, 1300);

    }, 280);
  };

  const handleBack = () => {
    if (current === 0) {
      onBack();
    } else {
      setCurrent(c => c - 1);
      setKidStep(s => Math.max(0, s - 1));
    }
  };

  const [lp, tp] = KID_POSITIONS[kidStep];

  // Progress label shown while kid is flying
  const pct    = Math.round((current + 1) / total * 100);
  const msgEn  = pct <= 28 ? 'Just launched!' : pct <= 57 ? 'Halfway there!' : pct <= 85 ? 'Almost there!' : 'Final approach!';
  const msgAr  = pct <= 28 ? '!انطلاق'        : pct <= 57 ? '!في المنتصف'    : pct <= 85 ? '!اقتربنا'       : '!الاقتراب الأخير';

  return (
    <div className="quiz-page" style={{ position: 'relative', zIndex: 10 }}>

      {/* Planet — fixed top-right, always visible */}
      <div className="quiz-planet" />

      {/* Kid astronaut — only visible while flying between questions */}
      <div
        className={`quiz-kid ${flying ? 'flying' : ''}`}
        style={{
          left:    lp + '%',
          top:     tp + '%',
          opacity: advancing ? 1 : 0,
        }}
      >
        <span className="quiz-kid-emoji">🧑‍🚀</span>
        <div className="quiz-kid-exhaust">
          <div className="quiz-kid-flame" />
        </div>

        {/* Progress label — floats beside the kid during flight */}
        <div className="quiz-kid-label">
          <span className="quiz-kid-label-msg">{isAr ? msgAr : msgEn}</span>
          <span className="quiz-kid-label-pct">{num(pct)}%</span>
        </div>
      </div>

      {/* Progress path */}
      <RocketPath current={current} total={total} />

      {/* Question body — hides while kid is flying between questions */}
      <div
        className="quiz-body"
        style={{ opacity: advancing ? 0 : 1, pointerEvents: advancing ? 'none' : 'auto' }}
      >
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
