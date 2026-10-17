import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageTabs() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'uz', flag: '🇺🇿', label: 'Oʻz' },
    { code: 'en', flag: '🇬🇧', label: 'EN' },
    { code: 'ru', flag: '🇷🇺', label: 'RU' },
  ];

  const change = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
  };

  const currentLang = i18n.language?.startsWith('uz') ? 'uz' : i18n.language?.startsWith('ru') ? 'ru' : 'en';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-card)',
        padding: '3px',
        borderRadius: '9999px',
        border: '1px solid var(--border-glass)',
        gap: '2px'
      }}
      role="tablist"
      aria-label="Language Selector"
    >
      {languages.map((l) => {
        const isActive = currentLang === l.code;
        return (
          <button
            key={l.code}
            role="tab"
            aria-selected={isActive}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              background: isActive
                ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)'
                : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive ? '0 2px 8px var(--primary-glow)' : 'none'
            }}
            onClick={() => change(l.code)}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}

