import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  CloudSun, Home, LayoutDashboard, Shield, 
  Bot, Thermometer
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageTabs from './LanguageTabs';

export default function NavBar({ tempUnit, setTempUnit, onOpenAIChat }) {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.5rem 0.95rem',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)' : 'transparent',
    boxShadow: isActive ? '0 2px 10px var(--primary-glow)' : 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: '2rem'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Brand Logo */}
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px var(--primary-glow)'
            }}
          >
            <CloudSun size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                Atmosphere<span style={{ color: 'var(--primary)' }}>X</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: 'rgba(2, 132, 199, 0.15)',
                  color: 'var(--primary)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
              >
                PRO
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginTop: '-2px' }}>
              {t('appSubtitle')}
            </span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <NavLink to="/" style={navLinkStyle}>
            <Home size={16} />
            <span>{t('home')}</span>
          </NavLink>
          <NavLink to="/dashboard" style={navLinkStyle}>
            <LayoutDashboard size={16} />
            <span>{t('dashboard')}</span>
          </NavLink>
          <NavLink to="/admin" style={navLinkStyle}>
            <Shield size={16} />
            <span>{t('admin')}</span>
          </NavLink>
          {onOpenAIChat && (
            <button
              onClick={onOpenAIChat}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--accent)',
                background: 'rgba(245, 158, 11, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Bot size={16} />
              <span>{t('aiAssistant')}</span>
            </button>
          )}
        </nav>

        {/* Utility Controls: Unit °C/°F, Lang, Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Unit Toggle Button */}
          <button
            onClick={() => setTempUnit(prev => (prev === 'C' ? 'F' : 'C'))}
            className="btn"
            title="Toggle Celsius / Fahrenheit"
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '9999px',
              border: '1px solid var(--border-glass)'
            }}
          >
            <Thermometer size={15} style={{ color: 'var(--primary)' }} />
            <span>°{tempUnit}</span>
          </button>

          {/* 3-Language Tabs */}
          <LanguageTabs />

          {/* Dark / Light Theme Toggle */}
          <ThemeToggle />

          {/* Clock badge */}
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-dim)',
              padding: '0.35rem 0.65rem',
              background: 'rgba(100, 150, 220, 0.08)',
              borderRadius: '8px',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {currentTime}
          </div>
        </div>
      </div>
    </header>
  );
}

