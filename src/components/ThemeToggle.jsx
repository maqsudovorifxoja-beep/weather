import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      className="btn"
      onClick={toggle}
      title={dark ? t('themeLight') : t('themeDark')}
      aria-label="Toggle Theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem 0.85rem',
        borderRadius: '9999px',
        border: '1px solid var(--border-glass)',
        background: 'var(--bg-card)',
        cursor: 'pointer'
      }}
    >
      {dark ? (
        <>
          <Sun size={17} style={{ color: '#fbbf24' }} className="weather-icon-sun" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t('themeLight')}</span>
        </>
      ) : (
        <>
          <Moon size={17} style={{ color: '#0284c7' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t('themeDark')}</span>
        </>
      )}
    </button>
  );
}

