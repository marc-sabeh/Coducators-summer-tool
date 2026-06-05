import React, { useMemo } from 'react';
import { profiles, PROFILE_ORDER } from '../data/profiles';
import { calculateScores, getWinningProfile, getTopStrengths } from '../utils/scoring';
import { useLanguage } from '../context/LanguageContext';
import { WHATSAPP_NUMBER, PROGRAM_NAME, COMPANY_NAME } from '../config';

function buildWALink(number, childInfo, profile, topStrengths, isAr) {
  const strengthNames = topStrengths
    .map(k => isAr ? profiles[k].strengthLabel_ar : profiles[k].strengthLabel)
    .join(', ');

  const planet = isAr ? profile.planet_ar : profile.planet;
  const path   = isAr ? profile.recommendedPath_ar : profile.recommendedPath;

  const msgEn =
`Hello Coducators! 👋 I just completed the Future Skills Assessment for my child.

👦 Child Name: ${childInfo.childName}
🎂 Age: ${childInfo.childAge}
👤 Parent Name: ${childInfo.parentName}
🪐 Mission Result: ${planet}
⭐ Recommended Path: ${path}
💪 Top 3 Strengths: ${strengthNames}

I'd love to book a free trial session at The Tech Camp. Please send me available times! 🚀`;

  const msgAr =
`أهلاً Coducators! 👋 لقد أكملت للتو تقييم المهارات المستقبلية لابني.

👦 اسم الطفل: ${childInfo.childName}
🎂 العمر: ${childInfo.childAge}
👤 اسم الولي: ${childInfo.parentName}
🪐 نتيجة المهمة: ${planet}
⭐ المسار الموصى به: ${path}
💪 أبرز ٣ مهارات: ${strengthNames}

أودّ حجز جلسة تجريبية مجانية في The Tech Camp. أرجو إرسال الأوقات المتاحة! 🚀`;

  return `https://wa.me/${number}?text=${encodeURIComponent(isAr ? msgAr : msgEn)}`;
}

const RANK_COLORS = ['#ffd700', '#c0c0c0', '#cd7f32'];

export default function ResultPage({ childInfo, answers, onRestart }) {
  const { t, isAr } = useLanguage();

  const scores       = useMemo(() => calculateScores(answers), [answers]);
  const winnerKey    = useMemo(() => getWinningProfile(scores, answers), [scores, answers]);
  const topStrengths = useMemo(() => getTopStrengths(scores), [scores]);
  const profile      = profiles[winnerKey];
  const waLink       = buildWALink(WHATSAPP_NUMBER, childInfo, profile, topStrengths, isAr);

  return (
    <div className="result-page" style={{ position: 'relative', zIndex: 10 }}>

      {/* HERO */}
      <div
        className="result-hero"
        style={{ background: `radial-gradient(ellipse at center, ${profile.glowColor} 0%, rgba(10,14,26,0.0) 70%), linear-gradient(180deg, #0d1224 0%, var(--space-bg) 100%)` }}
      >
        {/* Logo — same style as landing page */}
        <img src="/logo.png" alt={COMPANY_NAME}
          className="landing-logo"
          onError={e => { e.target.style.display='none'; }} />

        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: profile.color, marginBottom: 16 }}>
          {t('Mission Report — Complete', 'تقرير المهمة — مكتمل')}
        </p>

        {/* Planet */}
        <div
          className="result-planet planet-sphere"
          style={{
            '--ring-color': profile.color,
            '--ring-glow': profile.glowColor,
            background: `
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22) 0%, transparent 45%),
              radial-gradient(circle at 70% 65%, rgba(0,0,0,0.52) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, ${profile.lightColor} 0%, ${profile.darkColor} 58%, rgba(0,0,0,0.86) 100%)
            `,
            boxShadow: `0 0 60px ${profile.glowColor}, 0 0 110px ${profile.glowColor}, inset -14px -14px 34px rgba(0,0,0,0.38)`,
          }}
        >
          <div className="result-planet-icon">{profile.icon}</div>
        </div>

        <h1 className="result-planet-name" style={{ marginTop: 20 }}>
          {isAr ? profile.planet_ar : profile.planet}
        </h1>

        {childInfo.childName && (
          <div className="result-personal-headline">
            <span className="result-personal-name">{childInfo.childName}</span>
            <span className="result-personal-sep">
              {t('is headed to', 'متجه نحو')}
            </span>
            <span className="result-personal-planet" style={{ color: profile.color }}>
              {isAr ? profile.planet_ar : profile.planet} {profile.icon}
            </span>
          </div>
        )}

        <p className="result-tagline">{isAr ? profile.tagline_ar : profile.tagline}</p>
      </div>

      {/* BODY */}
      <div className="result-body">

        {/* What this means */}
        <div className="card result-section">
          <p className="result-section-title" style={{ color: profile.color }}>
            {t('Mission Analysis', 'تحليل المهمة')}
          </p>
          <p>{isAr ? profile.shortResult_ar : profile.shortResult}</p>
        </div>

        {/* Top 3 strengths */}
        <div className="card result-section mt-12">
          <p className="result-section-title" style={{ color: profile.color }}>
            {t('Top Strengths Identified', 'أبرز المهارات المكتشفة')}
          </p>
          <div className="strength-list">
            {topStrengths.map((key, i) => (
              <div key={key} className="strength-item">
                <div className="strength-rank" style={{ background: RANK_COLORS[i] }}>{i + 1}</div>
                <div>
                  <p className="strength-name">
                    {isAr ? profiles[key].strengthLabel_ar : profiles[key].strengthLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended path */}
        <div className="card result-section mt-12">
          <p className="result-section-title" style={{ color: profile.color }}>
            {t('Recommended Tech Camp Path', 'المسار الموصى به')}
          </p>
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--r)',
            background: 'rgba(255,255,255,0.04)',
            borderInlineStart: `4px solid ${profile.color}`,
            fontWeight: 700, fontSize: '0.9rem', marginBottom: 12
          }}>
            🗺️ {isAr ? profile.recommendedPath_ar : profile.recommendedPath}
          </div>
          <div className="chips">
            {(isAr ? profile.activities_ar : profile.activities).map(a => (
              <span key={a} className="chip">✦ {a}</span>
            ))}
          </div>
          <p style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {isAr ? profile.campMessage_ar : profile.campMessage}
          </p>
        </div>

        {/* Nudge */}
        <div className="nudge-card" style={{ background: `rgba(${profile.color.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',')},0.08)`, borderColor: `${profile.color}30` }}>
          <p>
            {t(
              "This result gives a strong early read on your child's strengths — but the best way to discover their full potential is to see them in action. The free trial session is designed exactly for this.",
              'هيدا النتيجة بتعطي قراءة مبكرة قوية لنقاط قوة ابنك — بس أحسن طريقة تكتشف طاقتو الكاملة هي تشوفو بالعمل. جلسة التجربة المجانية مصممة بالضبط لهيدا.'
            )}
          </p>
        </div>

        {/* In-page CTA */}
        <div className="mt-24">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('📲 Book Free Trial on WhatsApp', '📲 احجز جلسة تجريبية مجانية على واتساب')}
          </a>
        </div>

        <div className="mt-12">
          <button className="btn btn-outline" onClick={onRestart}>
            {t('Retake the assessment', 'أعد التقييم')}
          </button>
        </div>

        <p className="disclaimer mt-16">
          {t(
            'This assessment is designed to explore your child\'s tech learning preferences. It is not a scientific or clinical evaluation.',
            'هيدا التقييم مصمم لاستكشاف تفضيلات تعلم ابنك التقنية. مش تقييم علمي أو سريري.'
          )}
        </p>
      </div>

      {/* STICKY CTA */}
      <div className="sticky-cta">
        <div className="sticky-cta-inner">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('Book Free Trial on WhatsApp', 'احجز جلسة تجريبية مجانية على واتساب')}
          </a>
        </div>
      </div>
    </div>
  );
}
