import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sun, Cloud, CloudRain, CloudSun, Wind, Droplets, 
  Eye, AlertTriangle, Star, ArrowUpRight 
} from 'lucide-react';

export default function CityCard({ 
  city, 
  tempUnit, 
  isFavorite, 
  onToggleFavorite, 
  onSelect 
}) {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith('uz') ? 'uz' : i18n.language?.startsWith('ru') ? 'ru' : 'en';

  const cityName = currentLang === 'uz' ? (city.city || city.name) : currentLang === 'ru' ? (city.cityRu || city.city) : (city.cityEn || city.city);
  const countryName = currentLang === 'uz' ? (city.country || city.countryName) : currentLang === 'ru' ? (city.countryRu || city.country) : (city.countryEn || city.country);

  // Convert temperature if Fahrenheit
  const displayTemp = tempUnit === 'F' ? Math.round((city.temp * 9) / 5 + 32) : city.temp;
  const displayFeelsLike = tempUnit === 'F' ? Math.round((city.feelsLike * 9) / 5 + 32) : city.feelsLike;

  // Icon selector
  const renderWeatherIcon = () => {
    const c = (city.condition || '').toLowerCase();
    if (c.includes('rain')) return <CloudRain size={36} className="weather-icon-rain" />;
    if (c.includes('partly')) return <CloudSun size={36} style={{ color: '#f59e0b' }} />;
    if (c.includes('cloud')) return <Cloud size={36} style={{ color: '#94a3b8' }} className="cloud-float" />;
    return <Sun size={36} className="weather-icon-sun" />;
  };

  const getRiskClass = () => {
    const r = (city.riskLevel || '').toLowerCase();
    if (r.includes('severe')) return 'severe';
    if (r.includes('high')) return 'high';
    if (r.includes('mod')) return 'moderate';
    return 'low';
  };

  const getRiskLabel = () => {
    const r = (city.riskLevel || '').toLowerCase();
    if (r.includes('severe')) return t('riskSevere');
    if (r.includes('high')) return t('riskHigh');
    if (r.includes('mod')) return t('riskModerate');
    return t('riskLow');
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: 'relative',
        padding: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        overflow: 'hidden'
      }}
      onClick={() => onSelect(city)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Top Banner if Alert exists */}
      {city.alert && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.2rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            letterSpacing: '0.4px',
            textTransform: 'uppercase'
          }}
        >
          <AlertTriangle size={12} />
          <span>{city.alert}</span>
        </div>
      )}

      {/* Card Header: Country, City & Favorite */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: city.alert ? '0.75rem' : '0' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{city.flag || '🌐'}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{countryName}</span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
            {cityName}
          </h3>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(city.id);
          }}
          title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
          style={{
            background: isFavorite ? 'rgba(245, 158, 11, 0.18)' : 'rgba(150, 150, 150, 0.1)',
            border: isFavorite ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isFavorite ? '#f59e0b' : 'var(--text-dim)',
            transition: 'all 0.2s ease'
          }}
        >
          <Star size={18} fill={isFavorite ? '#f59e0b' : 'transparent'} />
        </button>
      </div>

      {/* Mid Body: Temperature & Weather Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.25rem 0' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-1.5px', color: 'var(--text-main)' }}>
              {displayTemp}
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)', marginLeft: '2px' }}>
              °{tempUnit}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {t('feelsLike')}: <strong style={{ color: 'var(--text-main)' }}>{displayFeelsLike}°{tempUnit}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          {renderWeatherIcon()}
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {city.condition}
          </span>
        </div>
      </div>

      {/* Weather Attributes: Wind, Humidity & AQI */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          padding: '0.75rem',
          background: 'rgba(100, 150, 220, 0.05)',
          borderRadius: '12px',
          marginBottom: '1rem',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', color: 'var(--primary)' }}>
            <Droplets size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{city.humidity}%</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{t('humidity')}</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', color: 'var(--accent)' }}>
            <Wind size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{city.windSpeed} km/h</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{t('windSpeed')}</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', color: '#10b981' }}>
            <Eye size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>AQI {city.aqi}</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{city.aqiStatus}</span>
        </div>
      </div>

      {/* Card Footer: Risk Badge and Details Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div className={`risk-badge ${getRiskClass()}`}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
          <span>{getRiskLabel()}</span>
        </div>

        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}
        >
          {t('viewDetails')}
          <ArrowUpRight size={14} />
        </span>
      </div>
    </div>
  );
}

