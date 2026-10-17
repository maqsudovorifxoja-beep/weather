import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, Sun, Cloud, CloudRain, CloudSun, Wind, Droplets, 
  Eye, Sunrise, Sunset, Compass, ShieldAlert, BarChart3, Star
} from 'lucide-react';

export default function CityModal({ city, tempUnit, onClose, isFavorite, onToggleFavorite }) {
  const { t, i18n } = useTranslation();

  if (!city) return null;

  const currentLang = i18n.language?.startsWith('uz') ? 'uz' : i18n.language?.startsWith('ru') ? 'ru' : 'en';

  const cityName = currentLang === 'uz' ? (city.city || city.name) : currentLang === 'ru' ? (city.cityRu || city.city) : (city.cityEn || city.city);
  const countryName = currentLang === 'uz' ? (city.country || city.countryName) : currentLang === 'ru' ? (city.countryRu || city.country) : (city.countryEn || city.country);

  const displayTemp = (celsius) => tempUnit === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius;

  const renderIcon = (type) => {
    switch (type) {
      case 'sunrise': return <Sunrise size={20} style={{ color: '#f59e0b' }} />;
      case 'sunset': return <Sunset size={20} style={{ color: '#f97316' }} />;
      case 'cloud-rain': return <CloudRain size={20} style={{ color: '#38bdf8' }} />;
      case 'cloud-sun': return <CloudSun size={20} style={{ color: '#f59e0b' }} />;
      case 'cloud': return <Cloud size={20} style={{ color: '#94a3b8' }} />;
      default: return <Sun size={20} style={{ color: '#f59e0b' }} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.8rem' }}>{city.flag || '🌐'}</span>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{countryName}</span>
              <span className={`risk-badge ${(city.riskLevel || '').toLowerCase()}`}>
                {city.riskLevel}
              </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              {cityName}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => onToggleFavorite(city.id)}
              className="btn-icon"
              title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
              style={{ color: isFavorite ? '#f59e0b' : 'inherit' }}
            >
              <Star size={20} fill={isFavorite ? '#f59e0b' : 'transparent'} />
            </button>
            <button onClick={onClose} className="btn-icon" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Current Core Snapshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '3.6rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}>
                {displayTemp(city.temp)}
              </span>
              <span style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--primary)', marginLeft: '4px' }}>
                °{tempUnit}
              </span>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {t('feelsLike')}: <strong style={{ color: 'var(--text-main)' }}>{displayTemp(city.feelsLike)}°{tempUnit}</strong> • {city.condition}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            {city.alert ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '10px',
                  color: '#ef4444',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                <ShieldAlert size={18} />
                <span>{city.alert}</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.8rem',
                  background: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: '10px',
                  color: '#10b981',
                  fontWeight: 600,
                  fontSize: '0.82rem'
                }}
              >
                <span>{t('riskLow')}</span>
              </div>
            )}
          </div>
        </div>

        {/* 24-Hour Hourly Forecast Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            {t('hourlyForecast')}
          </h4>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem'
            }}
          >
            {(city.hourly || []).map((h, idx) => (
              <div
                key={idx}
                style={{
                  flex: '0 0 auto',
                  minWidth: '85px',
                  padding: '0.75rem 0.5rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>{h.time}</span>
                {renderIcon(h.icon)}
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {displayTemp(h.temp)}°
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            {t('weeklyForecast')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(city.weekly || []).map((w, idx) => {
              const dayLabel = currentLang === 'uz' ? w.dayUz : currentLang === 'ru' ? w.dayRu : w.day;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px'
                  }}
                >
                  <span style={{ width: '60px', fontWeight: 700, fontSize: '0.9rem' }}>{dayLabel}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, paddingLeft: '1rem' }}>
                    {renderIcon(w.icon)}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{w.condition}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '120px', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{displayTemp(w.min)}°</span>
                    <div style={{ width: '60px', height: '6px', background: 'rgba(100, 150, 220, 0.2)', borderRadius: '3px', position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '20%',
                          right: '20%',
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{displayTemp(w.max)}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Grid: UV, Air Quality, Wind, Pressure, Sun */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
          <div style={{ padding: '0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', marginBottom: '0.3rem' }}>
              <Sun size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t('uvIndex')}</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{city.uvIndex} / 10</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{city.uvIndex > 7 ? 'High' : 'Moderate'}</span>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', marginBottom: '0.3rem' }}>
              <Eye size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t('airQuality')}</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{city.aqi} AQI</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{city.aqiStatus}</span>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>
              <Droplets size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t('humidity')}</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{city.humidity}%</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Dew point normal</span>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', marginBottom: '0.3rem' }}>
              <Wind size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t('windSpeed')}</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{city.windSpeed} km/h</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{city.windDirection}</span>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', marginBottom: '0.3rem' }}>
              <Sunrise size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t('sunrise')} / {t('sunset')}</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{city.sunrise} / {city.sunset}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Day length 12h 30m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

