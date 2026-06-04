import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { COMPANY_NAME } from '../config';

const AGES = [5,6,7,8,9,10,11,12,13,14,15,16,17];

export default function InfoForm({ initialValues, onSubmit, onBack }) {
  const { t, isAr } = useLanguage();
  const [v, setV] = useState({
    childName:  initialValues?.childName  || '',
    childAge:   initialValues?.childAge   || '',
    parentName: initialValues?.parentName || '',
    whatsapp:   initialValues?.whatsapp   || '',
  });
  const [errors, setErrors] = useState({});

  const set = (field, val) => {
    setV(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!v.childName.trim())  e.childName  = t('Required', 'مطلوب');
    if (!v.childAge)          e.childAge   = t('Required', 'مطلوب');
    if (!v.parentName.trim()) e.parentName = t('Required', 'مطلوب');
    if (!v.whatsapp.trim())   e.whatsapp   = t('Required', 'مطلوب');
    else if (v.whatsapp.replace(/\D/g,'').length < 7)
                              e.whatsapp   = t('Enter a valid number', 'أدخل رقماً صحيحاً');
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(v);
  };

  return (
    <div className="page form-page">
      <div className="page-inner">
        {/* Logo */}
        <img src="/logo.png" alt={COMPANY_NAME} style={{ height: 36, marginBottom: 20 }}
          onError={e => { e.target.style.display='none'; }} />

        <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 12, display: 'block' }}>
          {t('← Back', 'رجوع →')}
        </button>

        <div className="card form-card">
          <h2 className="form-title">{t('Mission Briefing', 'ملف المهمة')}</h2>
          <p className="form-sub">
            {t(
              "Tell us about your child and we'll personalize their mission result.",
              'أخبرنا عن ابنك وسنخصص نتيجة مهمتو.'
            )}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Child name */}
            <div className="form-group">
              <label className="form-label">{t("Child's Name", 'اسم الطفل')}</label>
              <input
                className={`form-input ${errors.childName ? 'error' : ''}`}
                type="text"
                placeholder={t('e.g. Lara', 'مثلاً: لارا')}
                value={v.childName}
                onChange={e => set('childName', e.target.value)}
                autoComplete="off"
              />
              {errors.childName && <p className="form-error">{errors.childName}</p>}
            </div>

            {/* Age */}
            <div className="form-group">
              <label className="form-label">{t('Age', 'العمر')}</label>
              <select
                className={`form-select ${errors.childAge ? 'error' : ''}`}
                value={v.childAge}
                onChange={e => set('childAge', e.target.value)}
              >
                <option value="">{t('Select age', 'اختر العمر')}</option>
                {AGES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.childAge && <p className="form-error">{errors.childAge}</p>}
            </div>

            {/* Parent name */}
            <div className="form-group">
              <label className="form-label">{t('Your Name', 'اسمك')}</label>
              <input
                className={`form-input ${errors.parentName ? 'error' : ''}`}
                type="text"
                placeholder={t('e.g. Sara', 'مثلاً: سارة')}
                value={v.parentName}
                onChange={e => set('parentName', e.target.value)}
                autoComplete="off"
              />
              {errors.parentName && <p className="form-error">{errors.parentName}</p>}
            </div>

            {/* WhatsApp */}
            <div className="form-group">
              <label className="form-label">{t('WhatsApp', 'واتساب')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{
                  padding: '12px 12px', background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--r)',
                  fontSize: '0.95rem', color: 'rgba(240,244,255,0.6)', whiteSpace: 'nowrap'
                }}>+961</span>
                <input
                  className={`form-input ${errors.whatsapp ? 'error' : ''}`}
                  type="tel"
                  placeholder={t('70 123 456', '70 123 456')}
                  value={v.whatsapp}
                  onChange={e => set('whatsapp', e.target.value)}
                  autoComplete="tel"
                />
              </div>
              {errors.whatsapp && <p className="form-error">{errors.whatsapp}</p>}
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn btn-launch">
                {t('Launch Mission 🚀', 'أطلق المهمة 🚀')}
              </button>
            </div>
          </form>

          <p className="form-privacy">
            {t(
              "Your info is only used to send you the result and book your free trial. We don't share it with anyone.",
              'معلوماتك بتُستخدم بس لإرسال النتيجة وحجز الجلسة. ما منشاركها مع أي أحد.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
