import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { calculateScores, getWinningProfile, getTopStrengths } from './utils/scoring';
import { questions } from './data/questions';
import { profiles } from './data/profiles';
import StarField    from './components/StarField';
import LandingPage  from './components/LandingPage';
import InfoForm     from './components/InfoForm';
import QuizPage     from './components/QuizPage';
import LaunchSequence from './components/LaunchSequence';
import ResultPage   from './components/ResultPage';

function LangToggle() {
  const { lang, toggleLang } = useLanguage();
  return (
    <div className="lang-toggle">
      <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => lang !== 'en' && toggleLang()}>EN</button>
      <button className={`lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => lang !== 'ar' && toggleLang()}>AR</button>
    </div>
  );
}

export default function App() {
  const { isAr } = useLanguage();
  const [step, setStep]           = useState('landing');
  const [childInfo, setChildInfo] = useState({ childName:'', childAge:'', parentName:'', whatsapp:'' });
  const [answers, setAnswers]     = useState(Array(questions.length).fill(null));

  // Pre-calculate winner for LaunchSequence planet reveal
  const winnerKey = useMemo(() => {
    if (step !== 'launch' && step !== 'result') return 'creative';
    const scores = calculateScores(answers);
    return getWinningProfile(scores, answers);
  }, [step, answers]);

  // Scroll to top on every page transition
  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const handleInfoSubmit = info => {
    setChildInfo(info);
    setStep('quiz');
  };

  const handleQuizComplete = finalAnswers => {
    setAnswers(finalAnswers);
    setStep('launch');

    // Save lead to Notion in the background — never blocks the user
    try {
      const scores      = calculateScores(finalAnswers);
      const winner      = getWinningProfile(scores, finalAnswers);
      const profile     = profiles[winner];
      const strengths   = getTopStrengths(scores);

      fetch('/.netlify/functions/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName:    childInfo.childName,
          childAge:     childInfo.childAge,
          parentName:   childInfo.parentName,
          whatsapp:     '+961' + childInfo.whatsapp,
          profile:      winner,
          planet:       profile.planet,
          topStrengths: strengths.map(k => profiles[k].strengthLabel).join(', '),
          language:     isAr ? 'AR' : 'EN',
        }),
      }).catch(e => console.warn('Notion save skipped:', e));
    } catch (e) {
      console.warn('Could not prepare Notion payload:', e);
    }
  };

  const handleRestart = () => {
    setAnswers(Array(questions.length).fill(null));
    setChildInfo({ childName:'', childAge:'', parentName:'', whatsapp:'' });
    setStep('landing');
  };

  return (
    <div className="app-root" dir={isAr ? 'rtl' : 'ltr'}>
      <StarField />
      <LangToggle />

      {/* Persistent WhatsApp FAB — always visible */}
      <a
        href="https://wa.me/96170128107"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {step === 'landing' && <LandingPage key="landing" onStart={() => setStep('info')} />}
      {step === 'info'    && <InfoForm    key="info"    initialValues={childInfo} onSubmit={handleInfoSubmit} onBack={() => setStep('landing')} />}
      {step === 'quiz'    && <QuizPage   key="quiz"    initialAnswers={answers} onComplete={handleQuizComplete} onBack={() => setStep('info')} />}
      {step === 'launch'  && <LaunchSequence key="launch" winnerKey={winnerKey} onComplete={() => setStep('result')} />}
      {step === 'result'  && <ResultPage key="result"  childInfo={childInfo} answers={answers} onRestart={handleRestart} />}
    </div>
  );
}
