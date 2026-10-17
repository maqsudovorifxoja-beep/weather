import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './routes/Home.jsx';
import Admin from './routes/Admin.jsx';
import Dashboard from './routes/Dashboard.jsx';
import Chat from './routes/Chat.jsx';
import NavBar from './components/NavBar.jsx';
import MeteoAIAssistant from './components/MeteoAIAssistant.jsx';
import { initialWeatherData } from './data/weatherData.js';
import { Bot, Sparkles, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();

  // Load weather data from localStorage or default dataset
  const [weatherList, setWeatherList] = useState(() => {
    try {
      const saved = localStorage.getItem('atmospherex_data');
      return saved ? JSON.parse(saved) : initialWeatherData;
    } catch {
      return initialWeatherData;
    }
  });

  // Temperature unit: 'C' or 'F'
  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem('tempUnit') || 'C';
  });

  // Favorites list
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('atmospherex_favs');
      return saved ? JSON.parse(saved) : ['uz-tashkent', 'ae-dubai'];
    } catch {
      return ['uz-tashkent', 'ae-dubai'];
    }
  });

  // Floating AI Chat modal state
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Sync tempUnit to localStorage
  useEffect(() => {
    localStorage.setItem('tempUnit', tempUnit);
  }, [tempUnit]);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('atmospherex_favs', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (cityId) => {
    setFavorites(prev => {
      if (prev.includes(cityId)) {
        return prev.filter(id => id !== cityId);
      } else {
        return [...prev, cityId];
      }
    });
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation Bar */}
        <NavBar
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
          onOpenAIChat={() => setIsAIChatOpen(prev => !prev)}
        />

        {/* Main Content Area */}
        <main className="container" style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  weatherList={weatherList}
                  tempUnit={tempUnit}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenAIChat={() => setIsAIChatOpen(true)}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  weatherList={weatherList}
                  tempUnit={tempUnit}
                />
              }
            />
            <Route
              path="/admin/*"
              element={
                <Admin
                  weatherList={weatherList}
                  setWeatherList={setWeatherList}
                  tempUnit={tempUnit}
                />
              }
            />
            <Route
              path="/chat"
              element={<Chat weatherList={weatherList} />}
            />
          </Routes>
        </main>

        {/* Floating AI Assistant Trigger Button & Dialog */}
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }}>
          {isAIChatOpen ? (
            <div style={{ animation: 'zoomUp 0.25s ease-out' }}>
              <MeteoAIAssistant
                weatherList={weatherList}
                onClose={() => setIsAIChatOpen(false)}
                isFloating={true}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="pulse-glow"
              title={t('openAiChat')}
              aria-label="Open AI Weather Assistant"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.35rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 8px 25px var(--primary-glow)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Bot size={22} />
              <span>MeteoAI</span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem'
                }}
              >
                GPT
              </span>
            </button>
          )}
        </div>

        {/* Site Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border-glass)',
            background: 'var(--bg-card)',
            padding: '2rem 0',
            marginTop: '3rem'
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.85rem',
              color: 'var(--text-dim)'
            }}
          >
            <div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>AtmosphereX</strong> — Global Weather & Risk Telemetry System.
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('home')}</Link>
              <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('dashboard')}</Link>
              <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('admin')}</Link>
              <Link to="/chat" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>MeteoAI</Link>
            </div>

            <div>
              8+ Davlatlar • 12+ Shaharlar • 3 Tillar • Dark & Light
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

