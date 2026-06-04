import React, { useState, useMemo } from 'react';
import { useLanguage } from './context/LanguageContext';
import { calculateScores, getWinningProfile } from './utils/scoring';
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
  const [answers, setAnswers]     = useState(Array(7).fill(null));

  // Pre-calculate winner for LaunchSequence planet reveal
  const winnerKey = useMemo(() => {
    if (step !== 'launch' && step !== 'result') return 'creative';
    const scores = calculateScores(answers);
    return getWinningProfile(scores, answers);
  }, [step, answers]);

  const handleInfoSubmit = info => {
    setChildInfo(info);
    setStep('quiz');
  };

  const handleQuizComplete = finalAnswers => {
    setAnswers(finalAnswers);
    setStep('launch');
  };

  const handleRestart = () => {
    setAnswers(Array(7).fill(null));
    setChildInfo({ childName:'', childAge:'', parentName:'', whatsapp:'' });
    setStep('landing');
  };

  return (
    <div className="app-root" dir={isAr ? 'rtl' : 'ltr'}>
      <StarField />
      <LangToggle />

      {step === 'landing' && <LandingPage key="landing" onStart={() => setStep('info')} />}
      {step === 'info'    && <InfoForm    key="info"    initialValues={childInfo} onSubmit={handleInfoSubmit} onBack={() => setStep('landing')} />}
      {step === 'quiz'    && <QuizPage   key="quiz"    initialAnswers={answers} onComplete={handleQuizComplete} onBack={() => setStep('info')} />}
      {step === 'launch'  && <LaunchSequence key="launch" winnerKey={winnerKey} onComplete={() => setStep('result')} />}
      {step === 'result'  && <ResultPage key="result"  childInfo={childInfo} answers={answers} onRestart={handleRestart} />}
    </div>
  );
}
