import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart2, TrendingUp, AlertTriangle, ShieldCheck, 
  Droplets, Wind, Sun, Compass, Activity, Globe 
} from 'lucide-react';

export default function Dashboard({ weatherList, tempUnit }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('uz') ? 'uz' : i18n.language?.startsWith('ru') ? 'ru' : 'en';

  const displayTemp = (celsius) => tempUnit === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius;

  // Stats calculation
  const stats = useMemo(() => {
    if (!weatherList.length) return null;
    const total = weatherList.length;
    const sumTemp = weatherList.reduce((acc, c) => acc + c.temp, 0);
    const avgTemp = Math.round(sumTemp / total);

    const sumHumidity = weatherList.reduce((acc, c) => acc + c.humidity, 0);
    const avgHumidity = Math.round(sumHumidity / total);

    const sumWind = weatherList.reduce((acc, c) => acc + c.windSpeed, 0);
    const avgWind = Math.round(sumWind / total);

    const lowRiskCount = weatherList.filter(c => (c.riskLevel || '').toLowerCase().includes('low')).length;
    const modRiskCount = weatherList.filter(c => (c.riskLevel || '').toLowerCase().includes('mod')).length;
    const highRiskCount = weatherList.filter(c => (c.riskLevel || '').toLowerCase().includes('high')).length;
    const severeRiskCount = weatherList.filter(c => (c.riskLevel || '').toLowerCase().includes('severe')).length;

    const sortedByTemp = [...weatherList].sort((a, b) => b.temp - a.temp);

    return {
      total,
      avgTemp,
      avgHumidity,
      avgWind,
      lowRiskCount,
      modRiskCount,
      highRiskCount,
      severeRiskCount,
      sortedByTemp
    };
  }, [weatherList]);

  if (!stats) return null;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Dashboard Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Activity size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            {t('dashboard')} — {t('adminSubtitle')}
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {currentLang === 'uz'
            ? 'Dunyo bo\'ylab 8+ davlatlarning iqlim ko\'rsatkichlari, xavf tahlili va telemetriya diagrammalari.'
            : currentLang === 'ru'
            ? 'Климатические показатели более чем 8 стран мира, анализ рисков и телеметрические диаграммы.'
            : 'Multi-nation climate telemetry, predictive threat matrices, and global atmospheric indices.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--primary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('totalCities')}</span>
            <Globe size={18} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            100% online • Telemetriya faol
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('avgGlobalTemp')}</span>
            <TrendingUp size={18} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
            {displayTemp(stats.avgTemp)}°{tempUnit}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            Seasonal average variance ±1.2°
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#10b981' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('humidity')} & {t('windSpeed')}</span>
            <Droplets size={18} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
            {stats.avgHumidity}% <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {stats.avgWind}km/h</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            Global namlik va shamol me'yorda
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ef4444' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('extremeAlerts')}</span>
            <AlertTriangle size={18} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.5rem', color: '#ef4444' }}>
            {stats.severeRiskCount + stats.highRiskCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            {stats.severeRiskCount} Favqulodda • {stats.highRiskCount} Yuqori
          </div>
        </div>
      </div>

      {/* Global Temperature Interactive Chart */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={20} style={{ color: 'var(--primary)' }} />
              {currentLang === 'uz' ? 'Global Shaharlar Harorati Diagrammasi' : currentLang === 'ru' ? 'Диаграмма температур мировых городов' : 'Global Cities Temperature Matrix'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {currentLang === 'uz' ? 'Eng issiqdan eng sovuqqacha tartiblangan' : 'Sorted from highest to lowest registered values'}
            </span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(2, 132, 199, 0.12)', padding: '0.3rem 0.75rem', borderRadius: '8px' }}>
            Live Telemetry (°{tempUnit})
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {stats.sortedByTemp.map(city => {
            const cityName = currentLang === 'uz' ? (city.city || city.name) : currentLang === 'ru' ? (city.cityRu || city.city) : (city.cityEn || city.city);
            const val = displayTemp(city.temp);
            // Calculate width percentage relative to max
            const widthPct = Math.min(100, Math.max(15, (city.temp / 40) * 100));

            const getBarColor = (t) => {
              if (t >= 30) return 'linear-gradient(90deg, #f97316 0%, #ef4444 100%)';
              if (t >= 20) return 'linear-gradient(90deg, #f59e0b 0%, #f97316 100%)';
              if (t >= 15) return 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)';
              return 'linear-gradient(90deg, #64748b 0%, #94a3b8 100%)';
            };

            return (
              <div key={city.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 60px', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{city.flag}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cityName}
                  </span>
                </div>

                <div style={{ background: 'rgba(100, 150, 220, 0.1)', height: '24px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${widthPct}%`,
                      background: getBarColor(city.temp),
                      borderRadius: '6px',
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {val}°{tempUnit}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Climate Risk Breakdown & Alerts Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Risk Breakdown */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
            {t('riskSummary')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, color: '#10b981' }}>{t('riskLow')}</span>
                <strong>{stats.lowRiskCount} ({Math.round((stats.lowRiskCount / stats.total) * 100)}%)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(100, 150, 220, 0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.lowRiskCount / stats.total) * 100}%`, height: '100%', background: '#10b981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, color: '#f59e0b' }}>{t('riskModerate')}</span>
                <strong>{stats.modRiskCount} ({Math.round((stats.modRiskCount / stats.total) * 100)}%)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(100, 150, 220, 0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.modRiskCount / stats.total) * 100}%`, height: '100%', background: '#f59e0b' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, color: '#f97316' }}>{t('riskHigh')}</span>
                <strong>{stats.highRiskCount} ({Math.round((stats.highRiskCount / stats.total) * 100)}%)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(100, 150, 220, 0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.highRiskCount / stats.total) * 100}%`, height: '100%', background: '#f97316' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>{t('riskSevere')}</span>
                <strong>{stats.severeRiskCount} ({Math.round((stats.severeRiskCount / stats.total) * 100)}%)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(100, 150, 220, 0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.severeRiskCount / stats.total) * 100}%`, height: '100%', background: '#ef4444' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Threat Warnings Table */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
            {currentLang === 'uz' ? 'Faol Iqlim Ogohlantirishlari' : currentLang === 'ru' ? 'Активные климатические угрозы' : 'Active Climate Threats'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {weatherList.filter(c => c.alert).map(city => (
              <div
                key={city.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{city.flag}</span>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                      {city.city}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{city.country}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      background: 'rgba(239, 68, 68, 0.18)',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px'
                    }}
                  >
                    {city.alert}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {displayTemp(city.temp)}°{tempUnit} • {city.condition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

