import React, { useState, useEffect, useCallback } from 'react';
import { questions } from '../data/questions';
import { useLanguage } from '../context/LanguageContext';
import RocketPath from './RocketPath';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Kid positions: [left%, top%]  — bottom-left → top-right (above the card)
// 7 positions for Q1 → Q7. Kid starts at position[current].
const KID_POSITIONS = [
  [5,  26],   // Q1 — low-left
  [14, 21],   // Q2
  [25, 16],   // Q3
  [36, 12],   // Q4
  [47,  8],   // Q5
  [58,  5],   // Q6
  [67,  2.5], // Q7 — close to planet
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

  return (
    <div className="quiz-page" style={{ position: 'relative', zIndex: 10 }}>

      {/* Planet — fixed top-right, always visible */}
      <div className="quiz-planet" />

      {/* Kid astronaut — moves up toward planet each question */}
      <div
        className={`quiz-kid ${flying ? 'flying' : ''}`}
        style={{
          left: lp + '%',
          top:  tp + '%',
        }}
      >
        <span className="quiz-kid-emoji">🧑‍🚀</span>
        <div className="quiz-kid-exhaust">
          <div className="quiz-kid-flame" />
        </div>
      </div>

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
