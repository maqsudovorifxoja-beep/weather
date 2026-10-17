import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertOctagon, ArrowRight, ShieldAlert, Radio } from 'lucide-react';

export default function WeatherAlertBanner({ alerts, onSelectCity }) {
  const { t } = useTranslation();
  const [broadcast, setBroadcast] = useState(() => localStorage.getItem('emergency_broadcast') || '');

  useEffect(() => {
    const handleStorage = () => {
      setBroadcast(localStorage.getItem('emergency_broadcast') || '');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if ((!alerts || alerts.length === 0) && !broadcast) return null;

  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* GLOBAL EMERGENCY BROADCAST FROM ADMIN */}
      {broadcast && (
        <div
          style={{
            background: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 50%, #ea580c 100%)',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(220, 38, 38, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.25)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
              <Radio size={20} className="pulse-glow" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                SHOSHILINCH EKSTREMAL OGOHLANTIRISH:
              </div>
              <div style={{ fontSize: '0.96rem', fontWeight: 700, marginTop: '2px' }}>
                {broadcast}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGIONAL STORM ALERTS */}
      {alerts && alerts.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.9) 0%, rgba(249, 115, 22, 0.9) 100%)',
            color: '#ffffff',
            padding: '0.65rem 1rem',
            borderRadius: '14px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.25)', borderRadius: '50%', padding: '4px', display: 'flex' }}>
              <ShieldAlert size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t('weatherAlert')}:
              </strong>{' '}
              <span style={{ fontSize: '0.88rem', opacity: 0.95 }}>
                {alerts.length} {t('activeAlerts').toLowerCase()} ({alerts.map(a => `${a.flag} ${a.city} - ${a.alert}`).join(' • ')})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {alerts.slice(0, 2).map((a) => (
              <button
                key={a.id}
                onClick={() => onSelectCity(a)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#fff',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>{a.flag} {a.city}</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
