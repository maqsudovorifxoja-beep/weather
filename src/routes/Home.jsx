import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Globe, Star, Flame, Snowflake, 
  Wind, ShieldAlert, Sparkles, Filter 
} from 'lucide-react';
import CityCard from '../components/CityCard';
import CityModal from '../components/CityModal';
import WeatherAlertBanner from '../components/WeatherAlertBanner';

export default function Home({ 
  weatherList, 
  tempUnit, 
  favorites, 
  onToggleFavorite,
  onOpenAIChat
}) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  // Distinct countries list
  const countries = useMemo(() => {
    const map = new Map();
    weatherList.forEach(c => {
      if (!map.has(c.countryCode)) {
        map.set(c.countryCode, { code: c.countryCode, flag: c.flag, name: c.country });
      }
    });
    return Array.from(map.values());
  }, [weatherList]);

  // Active alerts list
  const activeAlerts = useMemo(() => {
    return weatherList.filter(c => c.alert);
  }, [weatherList]);

  // Filtered list
  const filteredList = useMemo(() => {
    return weatherList.filter(c => {
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(c.id)) {
        return false;
      }
      // Country filter
      if (selectedCountry !== 'ALL' && c.countryCode !== selectedCountry) {
        return false;
      }
      // Search filter (matches city or country across languages)
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = (c.city || '').toLowerCase().includes(q) ||
                          (c.cityEn || '').toLowerCase().includes(q) ||
                          (c.cityRu || '').toLowerCase().includes(q) ||
                          (c.country || '').toLowerCase().includes(q) ||
                          (c.countryEn || '').toLowerCase().includes(q) ||
                          (c.countryRu || '').toLowerCase().includes(q);
        if (!matchName) return false;
      }
      return true;
    });
  }, [weatherList, search, selectedCountry, showOnlyFavorites, favorites]);

  // Global key telemetry stats
  const hottest = useMemo(() => [...weatherList].sort((a, b) => b.temp - a.temp)[0], [weatherList]);
  const coldest = useMemo(() => [...weatherList].sort((a, b) => a.temp - b.temp)[0], [weatherList]);
  const avgTemp = useMemo(() => {
    if (!weatherList.length) return 0;
    const sum = weatherList.reduce((acc, c) => acc + c.temp, 0);
    return Math.round(sum / weatherList.length);
  }, [weatherList]);

  const displayTemp = (celsius) => tempUnit === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Alert Banner for Severe Storms/Warnings */}
      <WeatherAlertBanner alerts={activeAlerts} onSelectCity={(city) => setSelectedCity(city)} />

      {/* Atmospheric Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(245, 158, 11, 0.12) 100%)',
          border: '1px solid var(--border-glass)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              background: 'rgba(2, 132, 199, 0.15)',
              color: 'var(--primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1rem',
              letterSpacing: '0.5px'
            }}
          >
            <Sparkles size={14} />
            <span>{t('liveMonitoring')}</span>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-1px',
              marginBottom: '0.75rem',
              color: 'var(--text-main)'
            }}
          >
            {t('appName')} — {t('appSubtitle')}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            {i18n.language?.startsWith('uz')
              ? 'Dunyoning 8 dan ortiq yetakchi davlatlari va shaharlaridagi jonli ob-havo sharoiti, xavf darajalari, 24 soatlik hamda 7 kunlik ob-havo prognozlari.'
              : i18n.language?.startsWith('ru')
              ? 'Оперативный мониторинг погоды и климатических рисков более чем в 8 странах мира с 24-часовым и недельным прогнозом.'
              : 'Real-time telemetry and meteorological risk intelligence across 8+ global nations with 24-hour and weekly predictive models.'}
          </p>

          {/* Search Box Input */}
          <div style={{ position: 'relative', maxWidth: '600px' }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '1.1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)'
              }}
            />
            <input
              type="text"
              className="input-field"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: '3rem',
                paddingRight: '1rem',
                fontSize: '1rem',
                height: '52px',
                borderRadius: '14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}
            />
          </div>
        </div>

        {/* Global Summary Mini-Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.85rem',
            marginTop: '2rem',
            position: 'relative',
            zIndex: 2
          }}
        >
          {hottest && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                <Flame size={15} />
                <span>MAX TEMP</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
                {hottest.flag} {displayTemp(hottest.temp)}°{tempUnit}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{hottest.city}</div>
            </div>
          )}

          {coldest && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
                <Snowflake size={15} />
                <span>MIN TEMP</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
                {coldest.flag} {displayTemp(coldest.temp)}°{tempUnit}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{coldest.city}</div>
            </div>
          )}

          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700 }}>
              <Globe size={15} />
              <span>AVG GLOBAL</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
              {displayTemp(avgTemp)}°{tempUnit}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{weatherList.length} {t('monitoredCountries')}</div>
          </div>

          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
              <ShieldAlert size={15} />
              <span>ALERTS</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
              {activeAlerts.length} Active
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{t('riskStatus')}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar: Country Pills & Favorites Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Country Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            onClick={() => setSelectedCountry('ALL')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedCountry === 'ALL' ? 'none' : '1px solid var(--border-glass)',
              background: selectedCountry === 'ALL'
                ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)'
                : 'var(--bg-card)',
              color: selectedCountry === 'ALL' ? '#fff' : 'var(--text-muted)',
              boxShadow: selectedCountry === 'ALL' ? '0 2px 10px var(--primary-glow)' : 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            🌐 {t('allCountries')}
          </button>

          {countries.map(c => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedCountry === c.code ? 'none' : '1px solid var(--border-glass)',
                background: selectedCountry === c.code
                  ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)'
                  : 'var(--bg-card)',
                color: selectedCountry === c.code ? '#fff' : 'var(--text-muted)',
                boxShadow: selectedCountry === c.code ? '0 2px 10px var(--primary-glow)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{c.flag}</span> <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Favorites Switcher */}
        <button
          onClick={() => setShowOnlyFavorites(prev => !prev)}
          className="btn"
          style={{
            background: showOnlyFavorites ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-card)',
            borderColor: showOnlyFavorites ? 'var(--accent)' : 'var(--border-glass)',
            color: showOnlyFavorites ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight: 700
          }}
        >
          <Star size={16} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
          <span>{t('favorites')} ({favorites.length})</span>
        </button>
      </div>

      {/* Weather Grid */}
      {filteredList.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {showOnlyFavorites ? t('noFavorites') : 'Hech qanday shahar topilmadi.'}
          </p>
        </div>
      ) : (
        <div className="grid-responsive">
          {filteredList.map(city => (
            <CityCard
              key={city.id}
              city={city}
              tempUnit={tempUnit}
              isFavorite={favorites.includes(city.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={(c) => setSelectedCity(c)}
            />
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedCity && (
        <CityModal
          city={selectedCity}
          tempUnit={tempUnit}
          isFavorite={favorites.includes(selectedCity.id)}
          onToggleFavorite={onToggleFavorite}
          onClose={() => setSelectedCity(null)}
        />
      )}
    </div>
  );
}

