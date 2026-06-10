import React, { useState, useEffect, useCallback } from 'react';
import { questions } from '../data/questions';
import { useLanguage } from '../context/LanguageContext';
import RocketPath from './RocketPath';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// One unique message per question answered (indexed by current 0–6)
const STEP_MESSAGES = [
  { en: 'Engines on!',          ar: '!المحركات تشتغل',      fr: 'Moteurs allumés !',       emoji: '🔥' },
  { en: 'Leaving atmosphere!',  ar: '!خارج الغلاف الجوي',   fr: 'On quitte l\'atmosphère !', emoji: '🌍' },
  { en: 'Into the stars!',      ar: '!بين النجوم',           fr: 'Dans les étoiles !',      emoji: '⭐' },
  { en: 'Halfway there!',       ar: '!في المنتصف',           fr: 'À mi-chemin !',           emoji: '🌌' },
  { en: 'Deep space!',          ar: '!الفضاء العميق',        fr: 'Espace profond !',        emoji: '💫' },
  { en: 'Almost there!',        ar: '!اقتربنا',              fr: 'Presque là !',            emoji: '🌟' },
  { en: 'Final approach!',      ar: '!الاقتراب الأخير',      fr: 'Approche finale !',       emoji: '🪐' },
];

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
  const { t, num, isAr, isFr, lang } = useLanguage();
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

  // Big progress overlay shown while kid is flying
  const pct  = Math.round((current + 1) / total * 100);
  const step = STEP_MESSAGES[Math.min(current, STEP_MESSAGES.length - 1)];

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
      </div>

      {/* Big centered progress text — only visible while kid is flying */}
      {advancing && (
        <div className="quiz-progress-overlay" key={current}>
          <span className="quiz-progress-emoji">{step.emoji}</span>
          <span className="quiz-progress-msg">{lang === 'ar' ? step.ar : lang === 'fr' ? step.fr : step.en}</span>
          <span className="quiz-progress-pct">{num(pct)}%</span>
        </div>
      )}

      {/* Progress path */}
      <RocketPath current={current} total={total} />

      {/* Question body — hides while kid is flying between questions */}
      <div
        className="quiz-body"
        style={{ opacity: advancing ? 0 : 1, pointerEvents: advancing ? 'none' : 'auto' }}
      >
        <div className="card question-card" key={current}>
          <p className="question-num">
            {t(`Question ${current + 1} of ${total}`, `سؤال ${num(current + 1)} من ${num(total)}`, `Question ${current + 1} sur ${total}`)}
          </p>
          <p className="question-text">
            {lang === 'ar' ? q.text_ar : lang === 'fr' ? q.text_fr : q.text_en}
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
                  <span>{lang === 'ar' ? ans.text_ar : lang === 'fr' ? ans.text_fr : ans.text_en}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="camp-msg">
          🪐 {lang === 'ar' ? q.campMessage_ar : lang === 'fr' ? q.campMessage_fr : q.campMessage_en}
        </p>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button className="btn-ghost" onClick={handleBack}>
            {t('← Back', '→ رجوع', '← Retour')}
          </button>
        </div>
      </div>
    </div>
  );
}
