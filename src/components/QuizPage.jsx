import React, { useState, useEffect } from 'react';
import { questions } from '../data/questions';
import { useLanguage } from '../context/LanguageContext';
import RocketPath from './RocketPath';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const PROFILE_COLORS = {
  creative:     '#7dbd42',
  engineer:     '#3586c7',
  gameDesigner: '#d8212b',
  aiExplorer:   '#6c4fcc',
  leader:       '#e07c1f',
};

function answerColor(scores) {
  if (!scores) return '#7dbd42';
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return top ? (PROFILE_COLORS[top[0]] || '#7dbd42') : '#7dbd42';
}

export default function QuizPage({ initialAnswers, onComplete, onBack }) {
  const { t, num, isAr } = useLanguage();
  const total = questions.length;

  const [answers, setAnswers]     = useState(initialAnswers || Array(total).fill(null));
  const [current, setCurrent]     = useState(() => {
    const first = (initialAnswers || []).findIndex(a => a === null);
    return first === -1 ? 0 : first;
  });
  const [selected, setSelected]   = useState(null);
  const [advancing, setAdvancing] = useState(false);

  // Boost flash state
  const [boostColor, setBoostColor] = useState(null);
  const [shake, setShake]           = useState(false);
  // Astronaut float state
  const [floatKid, setFloatKid]     = useState(false);

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

    // Get color for this answer
    const color = answerColor(q.answers[idx].scores);

    // 1. Trigger shake + color flash + kid float
    setBoostColor(color);
    setShake(true);
    setFloatKid(true);

    // 2. Clear shake after 400ms
    setTimeout(() => setShake(false), 400);

    // 3. Clear float after 600ms
    setTimeout(() => setFloatKid(false), 600);

    // 4. Clear boost flash after 420ms, advance question
    setTimeout(() => {
      setBoostColor(null);
      setAdvancing(false);
      if (current < total - 1) {
        setCurrent(c => c + 1);
      } else {
        onComplete(updated);
      }
    }, 420);
  };

  const handleBack = () => {
    if (current === 0) onBack();
    else setCurrent(c => c - 1);
  };

  return (
    <div className="quiz-page" style={{ position: 'relative', zIndex: 10 }}>

      {/* BOOST FLASH OVERLAY */}
      {boostColor && (
        <div
          className="boost-flash"
          style={{ background: boostColor }}
        />
      )}

      {/* FLOATING ASTRONAUT KID */}
      <div className={`quiz-astronaut ${floatKid ? 'float-up' : ''}`}>
        🧑‍🚀
      </div>

      {/* Progress path */}
      <RocketPath current={current} total={total} />

      {/* Question body */}
      <div className="quiz-body">
        <div className={`card question-card ${shake ? 'shake' : ''}`} key={current}>
          <p className="question-num">
            {t(`Question ${current + 1} of ${total}`, `سؤال ${num(current + 1)} من ${num(total)}`)}
          </p>
          <p className="question-text">
            {isAr ? q.text_ar : q.text_en}
          </p>

          <div className="answers-list">
            {q.answers.map((ans, idx) => {
              const isSelected = selected === idx;
              const color = isSelected ? answerColor(ans.scores) : undefined;
              return (
                <button
                  key={idx}
                  className={`answer-btn ${isSelected ? 'selected' : ''}`}
                  style={isSelected ? {
                    '--sel-color': color,
                    borderColor: color,
                    boxShadow: `0 0 18px ${color}44`,
                  } : {}}
                  onClick={() => handleAnswer(idx)}
                  disabled={advancing && !isSelected}
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
