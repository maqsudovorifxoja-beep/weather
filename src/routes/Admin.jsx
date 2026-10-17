import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, MapPin, AlertOctagon, Bot, Activity, 
  Plus, Trash2, Edit3, Check, X, ShieldAlert,
  Server, Globe, RefreshCw, Radio, Zap, Sliders, 
  Eye, Droplets, Wind, Sun, CloudRain, Cloud, Flame,
  Search, ShieldCheck, Play, Pause, ChevronRight, ChevronLeft,
  Download, Upload, Terminal, Compass, Satellite, BellRing,
  Sparkles, Filter, CheckCircle2, AlertTriangle
} from 'lucide-react';
import MeteoAIAssistant from '../components/MeteoAIAssistant';
import { initialWeatherData } from '../data/weatherData';

export default function Admin({ weatherList, setWeatherList, tempUnit }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('uz') ? 'uz' : i18n.language?.startsWith('ru') ? 'ru' : 'en';

  // Active Admin Sidebar Tab: 'cities' | 'telemetry' | 'alerts' | 'radar' | 'ai' | 'backup'
  const [activeTab, setActiveTab] = useState('cities');

  // Sidebar Collapsed state (icon-only vs full)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // View Mode: 'cards' or 'table'
  const [viewMode, setViewMode] = useState('cards');

  // Search & Filters inside Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');

  // Live simulation state & terminal logs
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState(3000);
  const [simLogs, setSimLogs] = useState([
    { id: 1, time: '19:40:12', msg: 'AtmosphereX telemetriya yadrosi ishga tushirildi.', type: 'info' },
    { id: 2, time: '19:40:15', msg: '12 ta tayanch stansiyalar bilan aloqa oʻrnatildi.', type: 'success' },
    { id: 3, time: '19:40:22', msg: 'Sentinel-6 sunʻiy yoʻldosh kanali sinxronlandi.', type: 'info' }
  ]);

  // Floating Toast Notification
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Live Digital Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('uz-UZ'));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('uz-UZ'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Custom Confirmation Modal State for Deletion
  const [cityToDelete, setCityToDelete] = useState(null);

  // New City Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCity, setNewCity] = useState({
    city: '',
    country: '',
    countryCode: 'UZ',
    flag: '🇺🇿',
    temp: 22,
    condition: 'Sunny',
    riskLevel: 'Low',
    humidity: 45,
    windSpeed: 14
  });

  // Emergency Broadcast Announcement
  const [emergencyText, setEmergencyText] = useState('');
  const [activeBroadcast, setActiveBroadcast] = useState(
    localStorage.getItem('emergency_broadcast') || ''
  );

  // Auto-simulation effect
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setWeatherList(prev => {
          if (!prev || prev.length === 0) return prev;
          const randomIndex = Math.floor(Math.random() * prev.length);
          const target = prev[randomIndex];
          const delta = (Math.random() > 0.5 ? 1 : -1);
          const newT = Math.max(-20, Math.min(49, target.temp + delta));

          const logTime = new Date().toLocaleTimeString('uz-UZ');
          const newLog = {
            id: Date.now(),
            time: logTime,
            msg: `SENSOR_T: ${target.city} harorati ${target.temp}°C -> ${newT}°C (${delta > 0 ? '+' : ''}${delta}°C) yangilandi.`,
            type: delta > 0 ? 'warning' : 'info'
          };

          setSimLogs(currentLogs => [newLog, ...currentLogs.slice(0, 24)]);

          return prev.map((c, i) => {
            if (i === randomIndex) {
              return {
                ...c,
                temp: newT,
                feelsLike: newT - 1
              };
            }
            return c;
          });
        });
      }, simSpeed);
    }
    return () => clearInterval(interval);
  }, [isSimulating, simSpeed, setWeatherList]);

  // Sync weather changes to localStorage
  const saveWeatherList = (updated, toastMsg) => {
    setWeatherList(updated);
    localStorage.setItem('atmospherex_data', JSON.stringify(updated));
    if (toastMsg) showToast(toastMsg, 'success');
  };

  // Add City
  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCity.city.trim() || !newCity.country.trim()) return;

    const id = `${newCity.countryCode.toLowerCase()}-${newCity.city.toLowerCase().replace(/\s+/g, '')}-${Date.now()}`;
    const cityToAdd = {
      ...newCity,
      id,
      cityEn: newCity.city,
      cityRu: newCity.city,
      countryEn: newCity.country,
      countryRu: newCity.country,
      feelsLike: newCity.temp - 1,
      pressure: 1014,
      uvIndex: 6,
      visibility: 10,
      aqi: 38,
      aqiStatus: 'Good',
      hourly: [
        { time: '09:00', temp: newCity.temp - 2, icon: 'sun' },
        { time: '12:00', temp: newCity.temp, icon: 'sun' },
        { time: '15:00', temp: newCity.temp + 2, icon: 'sun' },
        { time: '18:00', temp: newCity.temp - 1, icon: 'sunset' }
      ],
      weekly: [
        { day: 'Mon', dayUz: 'Dush', dayRu: 'Пн', max: newCity.temp + 2, min: newCity.temp - 4, icon: 'sun', condition: newCity.condition },
        { day: 'Tue', dayUz: 'Sesh', dayRu: 'Вт', max: newCity.temp + 3, min: newCity.temp - 3, icon: 'sun', condition: newCity.condition },
        { day: 'Wed', dayUz: 'Chor', dayRu: 'Ср', max: newCity.temp + 1, min: newCity.temp - 2, icon: 'cloud', condition: 'Cloudy' }
      ]
    };

    const updated = [cityToAdd, ...weatherList];
    saveWeatherList(updated, `${newCity.city} shahar reestriga muvaffaqiyatli qoʻshildi!`);
    setShowAddModal(false);
    setNewCity({
      city: '',
      country: '',
      countryCode: 'UZ',
      flag: '🇺🇿',
      temp: 22,
      condition: 'Sunny',
      riskLevel: 'Low',
      humidity: 45,
      windSpeed: 14
    });
  };

  // Confirm delete city
  const confirmDeleteCity = () => {
    if (!cityToDelete) return;
    const updated = weatherList.filter(c => c.id !== cityToDelete.id);
    saveWeatherList(updated, `${cityToDelete.city} shahar maʻlumotlari oʻchirildi.`);
    setCityToDelete(null);
  };

  // Live Slider Temp Change
  const handleTempSliderChange = (id, newTemp) => {
    const updated = weatherList.map(c => {
      if (c.id === id) {
        return {
          ...c,
          temp: Number(newTemp),
          feelsLike: Number(newTemp) - 1
        };
      }
      return c;
    });
    saveWeatherList(updated);
  };

  // Quick Condition Change
  const handleConditionChange = (id, newCondition) => {
    const updated = weatherList.map(c => {
      if (c.id === id) {
        return { ...c, condition: newCondition };
      }
      return c;
    });
    const cityName = weatherList.find(c => c.id === id)?.city || '';
    saveWeatherList(updated, `${cityName}: holat "${newCondition}" ga oʻzgartirildi.`);
  };

  // Quick Risk Change
  const handleRiskChange = (id, newRisk) => {
    const updated = weatherList.map(c => {
      if (c.id === id) {
        return { ...c, riskLevel: newRisk };
      }
      return c;
    });
    saveWeatherList(updated, `Xavf darajasi yangilandi: ${newRisk}`);
  };

  // Toggle Alert
  const handleToggleAlert = (id, currentAlert) => {
    let triggeredName = '';
    const updated = weatherList.map(c => {
      if (c.id === id) {
        triggeredName = c.city;
        return {
          ...c,
          alert: currentAlert ? null : 'Ekstremal Boʻron Ogohlantirishi'
        };
      }
      return c;
    });
    saveWeatherList(
      updated, 
      currentAlert 
        ? `${triggeredName} boʻyicha boʻron signali bekor qilindi.` 
        : `⚠️ ${triggeredName} uchun qizil xavf signali faollashtirildi!`
    );
  };

  // Emergency Broadcast Dispatcher
  const handleSetBroadcast = (textToSet) => {
    const msg = textToSet !== undefined ? textToSet : emergencyText;
    if (!msg.trim()) {
      setActiveBroadcast('');
      localStorage.removeItem('emergency_broadcast');
      showToast('Favqulodda eʻlon bekor qilindi.', 'info');
      return;
    }
    setActiveBroadcast(msg.trim());
    localStorage.setItem('emergency_broadcast', msg.trim());
    setEmergencyText('');
    showToast('🚨 Global favqulodda eʻlon zudlik bilan tarqatildi!', 'warning');
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(weatherList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `atmospherex_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Telemetriya konfiguratsiyasi JSON fayl qilib yuklab olindi.', 'success');
  };

  // Import JSON Backup
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          saveWeatherList(parsed, 'Zahira fayldan maʻlumotlar muvaffaqiyatli tiklandi!');
        } else {
          showToast('Xato: JSON formati yaroqsiz!', 'warning');
        }
      } catch (err) {
        showToast('JSON faylni oʻqishda xatolik yuz berdi.', 'warning');
      }
    };
    reader.readAsText(file);
  };

  // Factory Reset
  const handleFactoryReset = () => {
    if (window.confirm("Barcha maʻlumotlarni zavod (default) holatiga qaytarishni tasdiqlaysizmi?")) {
      saveWeatherList(initialWeatherData, 'Tizim dastlabki parametrlariga qaytarildi.');
      setActiveBroadcast('');
      localStorage.removeItem('emergency_broadcast');
    }
  };

  // Filtered & Sorted cities list
  const filteredCities = useMemo(() => {
    let list = [...weatherList];

    // Search filter
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase();
      list = list.filter(c =>
        (c.city || '').toLowerCase().includes(q) ||
        (c.country || '').toLowerCase().includes(q)
      );
    }

    // Region / Condition filter
    if (selectedRegion === 'UZ') {
      list = list.filter(c => c.countryCode === 'UZ');
    } else if (selectedRegion === 'EU') {
      list = list.filter(c => ['GB', 'FR', 'DE', 'IT'].includes(c.countryCode));
    } else if (selectedRegion === 'ASIA') {
      list = list.filter(c => ['JP', 'KR', 'AE', 'TR'].includes(c.countryCode));
    } else if (selectedRegion === 'AMERICA') {
      list = list.filter(c => ['US', 'CA'].includes(c.countryCode));
    } else if (selectedRegion === 'ALERTS') {
      list = list.filter(c => c.alert || c.riskLevel === 'Severe' || c.riskLevel === 'High');
    }

    // Sorting
    if (sortBy === 'temp_desc') {
      list.sort((a, b) => b.temp - a.temp);
    } else if (sortBy === 'temp_asc') {
      list.sort((a, b) => a.temp - b.temp);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.city.localeCompare(b.city));
    }

    return list;
  }, [weatherList, adminSearch, selectedRegion, sortBy]);

  // Telemetry Aggregates
  const hottestCity = useMemo(() => [...weatherList].sort((a, b) => b.temp - a.temp)[0], [weatherList]);
  const coldestCity = useMemo(() => [...weatherList].sort((a, b) => a.temp - b.temp)[0], [weatherList]);
  const avgTemp = useMemo(() => {
    if (!weatherList.length) return 0;
    const sum = weatherList.reduce((acc, c) => acc + c.temp, 0);
    return Math.round(sum / weatherList.length);
  }, [weatherList]);
  const activeAlertCount = useMemo(() => weatherList.filter(c => c.alert).length, [weatherList]);

  const displayTemp = (celsius) => tempUnit === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius;

  // Temperature color helper
  const getTempColor = (t) => {
    if (t < 0) return '#38bdf8'; // cold blue
    if (t <= 15) return '#0284c7'; // mild sky blue
    if (t <= 26) return '#10b981'; // optimal green
    if (t <= 34) return '#f59e0b'; // warm amber
    return '#ef4444'; // severe heat
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div
          className="toast-message"
          style={{
            position: 'fixed',
            top: '80px',
            right: '25px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '16px',
            background: toast.type === 'warning' ? '#dc2626' : toast.type === 'info' ? 'var(--primary)' : '#059669',
            color: '#ffffff',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            fontWeight: 600,
            fontSize: '0.88rem'
          }}
        >
          {toast.type === 'warning' ? <AlertOctagon size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP EMERGENCY BROADCAST BANNER (IF ACTIVE) */}
      {activeBroadcast && (
        <div
          style={{
            background: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 50%, #ea580c 100%)',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)',
            animation: 'fadeIn 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.25)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
              <Radio size={20} className="pulse-glow" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                JONLI FAVQULODDA XABAR TARQATISH REJIMI:
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, marginTop: '2px' }}>
                {activeBroadcast}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleSetBroadcast('')}
            className="btn"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '8px',
              fontWeight: 700
            }}
          >
            Bekor qilish
          </button>
        </div>
      )}

      {/* MISSION COMMAND HEADER & QUICK METRICS */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          borderRadius: '24px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(245, 158, 11, 0.06) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 6px 18px var(--primary-glow)'
            }}
          >
            <Compass size={26} className="rotate-sun" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px', margin: 0 }}>
                AtmosphereX Boshqaruv Markazi
              </h1>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', padding: '3px 8px', borderRadius: '6px' }}>
                SUPERADMIN v2.4
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>🕒 Jonli vaqt: <strong style={{ color: 'var(--text-main)' }}>{currentTime}</strong></span>
              <span>•</span>
              <span>🛰️ Sunʻiy yoʻldosh: <strong style={{ color: '#10b981' }}>Sentinel-6 AKTIV</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Telemetry Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
            <Globe size={15} color="var(--primary)" />
            <span>Stansiyalar: <strong style={{ color: 'var(--text-main)' }}>{weatherList.length} ta</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
            <Flame size={15} color="#ef4444" />
            <span>Eng issiq: <strong style={{ color: '#ef4444' }}>{hottestCity?.flag} {hottestCity?.city} ({hottestCity?.temp}°C)</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
            <Droplets size={15} color="#0284c7" />
            <span>Oʻrtacha: <strong style={{ color: 'var(--primary)' }}>{avgTemp}°C</strong></span>
          </div>

          {activeAlertCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>
              <AlertTriangle size={15} />
              <span>{activeAlertCount} Boʻron xavfi</span>
            </div>
          )}

          {/* Live Simulator Toggle Switch */}
          <button
            onClick={() => {
              setIsSimulating(!isSimulating);
              showToast(
                !isSimulating 
                  ? 'Jonli iqlim simulyatsiyasi ishga tushirildi (Har 3 soniyada oʻzgarish).' 
                  : 'Iqlim simulyatsiyasi toʻxtatildi.',
                !isSimulating ? 'success' : 'info'
              );
            }}
            className="btn"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.82rem',
              background: isSimulating ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-card)',
              color: isSimulating ? '#10b981' : 'var(--text-muted)',
              borderColor: isSimulating ? '#10b981' : 'var(--border-glass)',
              boxShadow: isSimulating ? '0 0 15px rgba(16, 185, 129, 0.35)' : 'none'
            }}
          >
            {isSimulating ? <Pause size={15} /> : <Play size={15} />}
            <span>{isSimulating ? 'Simulyatsiya: Yoniq' : 'Simulyatsiya: Oʻchiq'}</span>
          </button>
        </div>
      </div>

      {/* ADMIN WORKSPACE: SIDEBAR + CONTENT AREA */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isSidebarCollapsed ? '75px 1fr' : '260px 1fr',
          gap: '1.75rem',
          alignItems: 'start',
          transition: 'grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* ENHANCED AERO SIDEBAR ("Sayt bar") */}
        <aside
          className="glass-panel"
          style={{
            padding: isSidebarCollapsed ? '1rem 0.5rem' : '1.25rem',
            borderRadius: '24px',
            position: 'sticky',
            top: '85px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {/* Sidebar Top: Collapse/Expand Switch & Profile Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'space-between' }}>
              {!isSidebarCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    SAYT BAR MENYU
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="btn-icon"
                title={isSidebarCollapsed ? 'Kengaytirish' : 'Yigʻish'}
                style={{ width: '30px', height: '30px' }}
              >
                {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            {/* Admin Profile Mini Card */}
            {!isSidebarCollapsed && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '16px',
                  background: 'rgba(100, 150, 220, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.95rem'
                  }}
                >
                  BM
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Bosh Meteorolog
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                    ● Online (Boshqaruvchi)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Category: ASOSIY BOSHQARUV */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', paddingLeft: '0.5rem', letterSpacing: '0.5px' }}>
                ASOSIY TELEMETRIYA
              </span>
            )}

            <button
              onClick={() => setActiveTab('cities')}
              className={`admin-nav-item ${activeTab === 'cities' ? 'active' : ''}`}
              title="Shaharlar & Harorat Sliders"
              style={{ justifyContent: isSidebarCollapsed ? 'center' : 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} />
                {!isSidebarCollapsed && <span>Shaharlar & Sliders</span>}
              </div>
              {!isSidebarCollapsed && (
                <span style={{ fontSize: '0.72rem', background: activeTab === 'cities' ? 'rgba(255,255,255,0.25)' : 'rgba(100,150,220,0.15)', padding: '2px 7px', borderRadius: '10px', fontWeight: 700 }}>
                  {weatherList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`admin-nav-item ${activeTab === 'telemetry' ? 'active' : ''}`}
              title="Jonli Telemetriya & Dashboard"
              style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
            >
              <LayoutDashboard size={18} />
              {!isSidebarCollapsed && <span>Telemetriya & Metrika</span>}
            </button>
          </div>

          {/* Navigation Category: XAVFSIZLIK & OPERATSIYALAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', paddingLeft: '0.5rem', letterSpacing: '0.5px' }}>
                XAVF & OPERATSIYALAR
              </span>
            )}

            <button
              onClick={() => setActiveTab('alerts')}
              className={`admin-nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
              title="Favqulodda Dispetcher"
              style={{ justifyContent: isSidebarCollapsed ? 'center' : 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertOctagon size={18} />
                {!isSidebarCollapsed && <span>Favqulodda Dispetcher</span>}
              </div>
              {!isSidebarCollapsed && activeAlertCount > 0 && (
                <span style={{ fontSize: '0.72rem', background: '#ef4444', color: '#fff', padding: '2px 7px', borderRadius: '10px', fontWeight: 800 }}>
                  {activeAlertCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`admin-nav-item ${activeTab === 'radar' ? 'active' : ''}`}
              title="Sunʻiy Yoʻldosh & Radar"
              style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
            >
              <Satellite size={18} />
              {!isSidebarCollapsed && <span>Radar & Sunʻiy Yoʻldosh</span>}
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`admin-nav-item ${activeTab === 'ai' ? 'active' : ''}`}
              title="MeteoAI Terminali"
              style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
            >
              <Bot size={18} />
              {!isSidebarCollapsed && <span>MeteoAI Terminali</span>}
            </button>
          </div>

          {/* Navigation Category: TIZIM & ZAHIRA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', paddingLeft: '0.5rem', letterSpacing: '0.5px' }}>
                TIZIM & ARXİV
              </span>
            )}

            <button
              onClick={() => setActiveTab('backup')}
              className={`admin-nav-item ${activeTab === 'backup' ? 'active' : ''}`}
              title="JSON Zahira & Tiklash"
              style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
            >
              <Server size={18} />
              {!isSidebarCollapsed && <span>Zahira & Eksport</span>}
            </button>
          </div>

          {/* Sidebar Footer Widget */}
          {!isSidebarCollapsed && (
            <div
              style={{
                marginTop: 'auto',
                padding: '0.85rem',
                borderRadius: '16px',
                background: 'rgba(2, 132, 199, 0.06)',
                border: '1px solid rgba(2, 132, 199, 0.15)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Tarmoq holati:</span>
                <strong style={{ color: '#10b981' }}>100% Sinxron</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Kechikish:</span>
                <strong style={{ color: 'var(--text-main)' }}>14 ms</strong>
              </div>
            </div>
          )}
        </aside>

        {/* WORKSPACE MAIN CONTENT */}
        <div style={{ minWidth: 0 }}>
          
          {/* TAB 1: SHAHARLAR VA HARORAT SLIDERLARI */}
          {activeTab === 'cities' && (
            <div>
              {/* Filter Toolbar: Search, Region Pills, Sorter, View Toggle & Add Button */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: '20px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                {/* Search */}
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Shaharni qidirish..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Region Filter Chips */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'ALL', label: `Barchasi (${weatherList.length})` },
                    { id: 'UZ', label: '🇺🇿 Oʻzbekiston' },
                    { id: 'EU', label: '🇪🇺 Yevropa' },
                    { id: 'ASIA', label: '🌏 Osiyo' },
                    { id: 'AMERICA', label: '🇺🇸 Amerika' },
                    { id: 'ALERTS', label: '⚠️ Xavflilar' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedRegion(tab.id)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: selectedRegion === tab.id ? 'var(--primary)' : 'var(--border-glass)',
                        background: selectedRegion === tab.id ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-card)',
                        color: selectedRegion === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: selectedRegion === tab.id ? 700 : 500,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* View Toggle & Add Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '3px'
                    }}
                  >
                    <button
                      onClick={() => setViewMode('cards')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        border: 'none',
                        borderRadius: '7px',
                        background: viewMode === 'cards' ? 'var(--primary)' : 'transparent',
                        color: viewMode === 'cards' ? '#fff' : 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      3D Kartalar
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        border: 'none',
                        borderRadius: '7px',
                        background: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                        color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Jadval
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                    style={{ height: '40px', padding: '0 1.1rem', fontSize: '0.85rem' }}
                  >
                    <Plus size={18} />
                    <span>Yangi Shahar</span>
                  </button>
                </div>
              </div>

              {/* 3D CARDS VIEW WITH REAL-TIME SLIDERS */}
              {viewMode === 'cards' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {filteredCities.map(city => {
                    const tempColor = getTempColor(city.temp);
                    return (
                      <div
                        key={city.id}
                        className="glass-panel"
                        style={{
                          padding: '1.5rem',
                          borderRadius: '22px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderTop: city.alert ? '5px solid #ef4444' : `5px solid ${tempColor}`,
                          position: 'relative'
                        }}
                      >
                        {/* Header: Flag, City, Country & Delete Action */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                              <span style={{ fontSize: '1.6rem' }}>{city.flag}</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{city.country}</span>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
                              {city.city}
                            </h3>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => setCityToDelete(city)}
                              className="btn-icon"
                              title="Shaharni oʻchirish"
                              style={{ width: '32px', height: '32px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.25)' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Real-Time Slider Gauge */}
                        <div
                          style={{
                            margin: '1.25rem 0',
                            padding: '1rem',
                            background: 'rgba(100, 150, 220, 0.06)',
                            borderRadius: '16px',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Sliders size={14} /> Jonli Harorat Sozlagichi:
                            </span>
                            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: tempColor, transition: 'color 0.2s' }}>
                              {city.temp > 0 ? `+${city.temp}` : city.temp}°C
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                                ({displayTemp(city.temp)}°{tempUnit})
                              </span>
                            </span>
                          </div>

                          <input
                            type="range"
                            className="admin-slider"
                            min="-20"
                            max="50"
                            value={city.temp}
                            onChange={(e) => handleTempSliderChange(city.id, e.target.value)}
                          />

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                            <span>❄️ -20°C (Qor)</span>
                            <span>🌱 +15°C (Moʻtadil)</span>
                            <span>🔥 +50°C (Jazirama)</span>
                          </div>
                        </div>

                        {/* 1-Click Condition Selector Pills */}
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem' }}>
                            OB-HAVO HOLATI (1 CLICK):
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem' }}>
                            {[
                              { label: 'Quyosh', val: 'Sunny', icon: '☀️' },
                              { label: 'Bulut', val: 'Partly Cloudy', icon: '⛅' },
                              { label: 'Yomgʻir', val: 'Rainy', icon: '🌧️' },
                              { label: 'Qor', val: 'Snowy', icon: '❄️' },
                              { label: 'Issiq', val: 'Hot & Clear', icon: '🔥' }
                            ].map(cond => (
                              <button
                                key={cond.val}
                                onClick={() => handleConditionChange(city.id, cond.val)}
                                style={{
                                  padding: '0.35rem 0.2rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  border: '1px solid',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  borderColor: city.condition === cond.val ? 'var(--primary)' : 'var(--border-subtle)',
                                  background: city.condition === cond.val ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-card)',
                                  color: city.condition === cond.val ? 'var(--primary)' : 'var(--text-muted)',
                                  textAlign: 'center'
                                }}
                                title={cond.label}
                              >
                                <div>{cond.icon}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Risk Level & Alert Trigger Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                          {/* Risk Level Badge Selector */}
                          <div>
                            <select
                              className="input-field"
                              value={city.riskLevel || 'Low'}
                              onChange={(e) => handleRiskChange(city.id, e.target.value)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', height: '32px' }}
                            >
                              <option value="Low">🟢 Xavfsiz (Normal)</option>
                              <option value="Moderate">🟡 Oʻrtacha xavf</option>
                              <option value="High">🟠 Yuqori xavf</option>
                              <option value="Severe">🔴 Ekstremal xavf</option>
                            </select>
                          </div>

                          {/* Emergency Storm Alert Button */}
                          <button
                            onClick={() => handleToggleAlert(city.id, city.alert)}
                            className="btn"
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: city.alert ? 'rgba(239, 68, 68, 0.15)' : 'rgba(2, 132, 199, 0.1)',
                              color: city.alert ? '#ef4444' : 'var(--primary)',
                              borderColor: city.alert ? 'rgba(239, 68, 68, 0.3)' : 'rgba(2, 132, 199, 0.2)'
                            }}
                          >
                            {city.alert ? '⚠️ Boʻronni yopish' : '+ Boʻron xabari'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TABLE VIEW */}
              {viewMode === 'table' && (
                <div className="glass-panel" style={{ overflowX: 'auto', padding: '0.5rem', borderRadius: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '720px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Shahar</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Davlat</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Harorat (Slider)</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Holat</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Xavf darajasi</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Ogohlantirish</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Amal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCities.map(city => (
                        <tr key={city.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                            {city.flag} {city.city}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                            {city.country}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', minWidth: '160px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <strong style={{ minWidth: '40px', color: getTempColor(city.temp) }}>
                                {city.temp}°C
                              </strong>
                              <input
                                type="range"
                                min="-20"
                                max="50"
                                value={city.temp}
                                onChange={(e) => handleTempSliderChange(city.id, e.target.value)}
                                style={{ flex: 1, accentColor: 'var(--primary)' }}
                              />
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{city.condition}</span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span className={`risk-badge ${(city.riskLevel || '').toLowerCase()}`}>
                              {city.riskLevel}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            {city.alert ? (
                              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.78rem' }}>⚠️ {city.alert}</span>
                            ) : (
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => setCityToDelete(city)}
                              className="btn-icon"
                              style={{ width: '32px', height: '32px', color: '#ef4444' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TELEMETRIYA & JONLI DASHBOARD */}
          {activeTab === 'telemetry' && (
            <div>
              {/* Telemetry KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Faol Stansiyalar
                  </span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
                    {weatherList.length}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>● 100% Onlayn sinxron</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Oʻrtacha Harorat
                  </span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
                    {avgTemp}°C
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>12 shahar boʻyicha oʻrtacha</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Boʻron Ogohlantirishi
                  </span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: activeAlertCount > 0 ? '#ef4444' : '#10b981', marginTop: '0.2rem' }}>
                    {activeAlertCount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: activeAlertCount > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                    {activeAlertCount > 0 ? 'Ekstremal xavf zonalari' : 'Barcha hududlar barqaror'}
                  </span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Sensor Aniqligi
                  </span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                    99.98%
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>WMO ISO-9001 standarti</span>
                </div>
              </div>

              {/* Temperature Bar Comparison Chart */}
              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '22px', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                  Shaharlar Harorati Qiyosiy Barometri (°C)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {weatherList.map(c => {
                    const percent = Math.max(5, Math.min(100, ((c.temp + 20) / 70) * 100));
                    const barColor = getTempColor(c.temp);
                    return (
                      <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 60px', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.flag} {c.city}
                        </div>
                        <div style={{ background: 'rgba(100, 150, 220, 0.1)', height: '14px', borderRadius: '8px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              background: barColor,
                              borderRadius: '8px',
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, textAlign: 'right', color: barColor }}>
                          {c.temp > 0 ? `+${c.temp}` : c.temp}°C
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Streaming Simulation Terminal Logs */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  borderRadius: '20px',
                  background: 'rgba(8, 12, 22, 0.95)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#e2e8f0',
                  fontFamily: 'monospace'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Terminal size={18} color="#38bdf8" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                      ATMOSPHEREX_KERNEL_STREAM (JONLI LOGLAR)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: isSimulating ? '#10b981' : '#64748b' }}>
                    {isSimulating ? '● STREAM_ACTIVE (3s)' : '○ STREAM_PAUSED'}
                  </span>
                </div>

                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
                  {simLogs.map(log => (
                    <div key={log.id} style={{ display: 'flex', gap: '0.75rem', opacity: 0.9 }}>
                      <span style={{ color: '#64748b' }}>[{log.time}]</span>
                      <span style={{ color: log.type === 'warning' ? '#f59e0b' : log.type === 'success' ? '#10b981' : '#38bdf8' }}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAVQULODDA DISPETCHER & BROADCAST */}
          {activeTab === 'alerts' && (
            <div>
              {/* Emergency Broadcast Creator with 1-Click Templates */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  borderRadius: '24px',
                  marginBottom: '1.75rem',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.35)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', color: '#ef4444' }}>
                  <BellRing size={24} className="pulse-glow" />
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    Global Favqulodda Eʻlon Yuborish (Live Dispatcher)
                  </h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Bu yerda kiritilgan matn darhol butun platforma foydalanuvchilarining ekranida qizil sirenli lenta sifatida aks etadi.
                </p>

                {/* 1-Click Quick Emergency Templates */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>
                    TEZKOR TAYYOR SHABLONLAR (1 CLICK BILAN EʻLON QILISH):
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                    {[
                      { icon: '🌪️', title: 'Qum Boʻroni', msg: 'Toshkent va voha viloyatlarida kuchli shamol va koʻrish masofasi cheklandi!' },
                      { icon: '⚡', title: 'Momaqaldiroq & Sel', msg: 'Togʻli va togʻoldi hududlarda kuchli sel xavfi va momaqaldiroq eʻlon qilindi!' },
                      { icon: '❄️', title: 'Qor Boʻroni & Muzlama', msg: 'Perevallarda kuchli qor yogʻishi va avtomobil yoʻllarida muzlama xavfi!' },
                      { icon: '🔥', title: 'Ekstremal Jazirama', msg: 'Harorat +44°C dan oshishi kutilmoqda! Toʻgʻridan-toʻgʻri quyoshdan saqlaning!' }
                    ].map((template, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSetBroadcast(template.msg)}
                        className="btn"
                        style={{
                          padding: '0.65rem 0.85rem',
                          textAlign: 'left',
                          fontSize: '0.78rem',
                          borderRadius: '12px',
                          background: 'var(--bg-card)',
                          borderColor: 'rgba(239, 68, 68, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{template.icon}</span>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-main)' }}>{template.title}</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1 click bilan tarqatish</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Emergency Broadcast Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSetBroadcast(emergencyText);
                  }}
                  style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}
                >
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Yoki oʻz favqulodda ogohlantirishingizni yozing..."
                    value={emergencyText}
                    onChange={(e) => setEmergencyText(e.target.value)}
                    style={{ flex: 1, height: '46px' }}
                  />
                  <button type="submit" className="btn-primary" style={{ background: '#ef4444', minWidth: '170px', height: '46px' }}>
                    <Radio size={18} />
                    <span>Zudlik bilan eʻlon</span>
                  </button>
                </form>
              </div>

              {/* City Risk Alert Cards */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Hududiy Xavf Signallarini Faollashtirish
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {weatherList.map(city => (
                  <div
                    key={city.id}
                    className="glass-panel"
                    style={{
                      padding: '1.25rem',
                      borderRadius: '18px',
                      borderLeft: city.alert ? '5px solid #ef4444' : '5px solid #10b981',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{city.flag}</span>
                          <strong style={{ fontSize: '1.15rem' }}>{city.city}</strong>
                        </div>
                        <span className={`risk-badge ${(city.riskLevel || '').toLowerCase()}`}>
                          {city.riskLevel}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                        Harorat: {city.temp}°C • Shamol: {city.windSpeed} km/h • Namlik: {city.humidity}%
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: city.alert ? '#ef4444' : '#10b981' }}>
                        {city.alert ? `⚠️ ${city.alert}` : '✅ Xavf aniqlanmadi'}
                      </span>
                      <button
                        onClick={() => handleToggleAlert(city.id, city.alert)}
                        className="btn"
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.35rem 0.75rem',
                          background: city.alert ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: city.alert ? '#ef4444' : '#10b981',
                          borderColor: city.alert ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        {city.alert ? 'Bekor qilish' : 'Xavf eʻlon qilish'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUNʻIY YOʻLDOSH & RADAR STANSIYALARI */}
          {activeTab === 'radar' && (
            <div>
              <div
                className="glass-panel"
                style={{
                  padding: '2rem',
                  borderRadius: '24px',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '2rem',
                  alignItems: 'center'
                }}
              >
                {/* ANIMATED RADAR SWEEP CANVAS */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '280px',
                      height: '280px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(2, 6, 23, 0.95) 100%)',
                      border: '2px solid rgba(56, 189, 248, 0.4)',
                      boxShadow: '0 0 35px rgba(56, 189, 248, 0.25)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Concentric Radar Rings */}
                    <div style={{ position: 'absolute', inset: '25%', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.3)' }} />
                    <div style={{ position: 'absolute', inset: '50%', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.4)' }} />
                    <div style={{ position: 'absolute', inset: '75%', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.5)' }} />

                    {/* Crosshairs */}
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(56, 189, 248, 0.25)' }} />
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(56, 189, 248, 0.25)' }} />

                    {/* Rotating Radar Sweep Beam */}
                    <div className="radar-sweep-beam" />

                    {/* Blinking City Blips on Radar */}
                    <div style={{ position: 'absolute', top: '42%', left: '58%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} className="pulse-glow" />
                      <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 800, marginTop: '2px' }}>Toshkent</span>
                    </div>

                    <div style={{ position: 'absolute', top: '28%', left: '72%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} className="pulse-glow" />
                      <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 800, marginTop: '2px' }}>Tokio</span>
                    </div>

                    <div style={{ position: 'absolute', top: '35%', left: '32%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} className="pulse-glow" />
                      <span style={{ fontSize: '0.62rem', color: '#f59e0b', fontWeight: 800, marginTop: '2px' }}>Parij</span>
                    </div>

                    <div style={{ position: 'absolute', top: '65%', left: '25%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} className="pulse-glow" />
                      <span style={{ fontSize: '0.62rem', color: '#ef4444', fontWeight: 800, marginTop: '2px' }}>Nyu-York</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Doppler Meteorologik Radar: Faol
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      360° skanerlash • 800 km radius
                    </div>
                  </div>
                </div>

                {/* Satellite Feeds Telemetry */}
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Orbital Sunʻiy Yoʻldosh Kanallari
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.9rem' }}>SENTINEL-6 (NASA/ESA)</strong>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                          98.4% SIGNAL
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        Okean va atmosfera sirt balandligi radar altimetriyasi. Kechikish: 8ms.
                      </p>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.9rem' }}>METEOSAT-11 (EUMETSAT)</strong>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                          99.2% SIGNAL
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        Yevroosiyo qitʼasi multispektral infraqizil bulutlar tahlili.
                      </p>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.9rem' }}>GOES-16 (NOAA)</strong>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                          97.8% SIGNAL
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        Global chaqmoq xaritasi va siklon detektori.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: METEOAI TERMINALI */}
          {activeTab === 'ai' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  MeteoAI Neyron Tarmogʻi Konsoli
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Sunʻiy intellekt maslahatchisi parametrlarini sinash va jonli ob-havo tavsiyalarini tahlil qilish
                </p>
              </div>
              <MeteoAIAssistant weatherList={weatherList} isFloating={false} />
            </div>
          )}

          {/* TAB 6: JSON ZAHIRA & TIZIMNI TIKLASH */}
          {activeTab === 'backup' && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <Server size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Maʻlumotlar Zahirasi va JSON Eksport
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                AtmosphereX platformasidagi barcha shaharlar, haroratlar, prognozlar va xavf darajalarini toʻliq JSON fayl koʻrinishida yuklab olishingiz yoki avval saqlangan zahiradan tiklashingiz mumkin.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {/* Export Card */}
                <div style={{ padding: '1.5rem', borderRadius: '18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Download size={18} color="var(--primary)" />
                      JSON Formatda Eksport
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Joriy {weatherList.length} ta shahar maʻlumotlari va sozlamalarini arxiv fayl qilib kompyuteringizga saqlang.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="btn-primary"
                    style={{ marginTop: '1.25rem', width: '100%', height: '42px', fontSize: '0.88rem' }}
                  >
                    <Download size={16} />
                    <span>JSON Yuklab Olish</span>
                  </button>
                </div>

                {/* Import Card */}
                <div style={{ padding: '1.5rem', borderRadius: '18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Upload size={18} color="#10b981" />
                      JSON Zahiradan Tiklash
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Avval saqlangan .json faylni yuklang va ob-havo maʻlumotlarini bir zumda yangilang.
                    </p>
                  </div>
                  <label
                    className="btn"
                    style={{
                      marginTop: '1.25rem',
                      width: '100%',
                      height: '42px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      borderColor: 'rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Upload size={16} />
                    <span>Faylni Tanlash</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Danger Zone: Factory Reset */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#ef4444', display: 'block' }}>
                    Zavod Sozlamalariga Qaytarish (Factory Reset)
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Barcha kiritilgan oʻzgarishlarni tozalab, standart 12 ta davlatlar maʻlumotini tiklaydi.
                  </span>
                </div>
                <button
                  onClick={handleFactoryReset}
                  className="btn"
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem'
                  }}
                >
                  <RefreshCw size={15} />
                  <span>Dastlabki Holatga Qaytarish</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CUSTOM CONFIRMATION MODAL FOR DELETION */}
      {cityToDelete && (
        <div className="modal-overlay" onClick={() => setCityToDelete(null)}>
          <div className="modal-content" style={{ maxWidth: '440px', borderRadius: '24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Shaharni oʻchirishni tasdiqlaysizmi?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              <strong>{cityToDelete.flag} {cityToDelete.city} ({cityToDelete.country})</strong> shahri tizim reestridan butunlay oʻchiriladi.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setCityToDelete(null)}
                className="btn"
                style={{ flex: 1, padding: '0.65rem' }}
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDeleteCity}
                className="btn"
                style={{ flex: 1, padding: '0.65rem', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 700 }}
              >
                Oʻchirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW CITY */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Yangi Shahar Roʻyxatga Olish</h3>
              <button onClick={() => setShowAddModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCity} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>
                  Shahar nomi
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Masalan: Buxoro, Madrid, Dublin"
                  value={newCity.city}
                  onChange={(e) => setNewCity({ ...newCity, city: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>
                  Davlat nomi va Bayrogʻi
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="🇺🇿"
                    value={newCity.flag}
                    onChange={(e) => setNewCity({ ...newCity, flag: e.target.value })}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Oʻzbekiston, Spain"
                    value={newCity.country}
                    onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>
                    Harorat (°C)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={newCity.temp}
                    onChange={(e) => setNewCity({ ...newCity, temp: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>
                    Ob-havo holati
                  </label>
                  <select
                    className="input-field"
                    value={newCity.condition}
                    onChange={(e) => setNewCity({ ...newCity, condition: e.target.value })}
                  >
                    <option value="Sunny">☀️ Quyoshli</option>
                    <option value="Clear">✨ Musaffo</option>
                    <option value="Partly Cloudy">⛅ Qisman bulutli</option>
                    <option value="Cloudy">☁️ Bulutli</option>
                    <option value="Rainy">🌧️ Yomgʻirli</option>
                    <option value="Snowy">❄️ Qorli</option>
                    <option value="Hot & Clear">🔥 Jazirama issiq</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>
                  Xavf darajasi
                </label>
                <select
                  className="input-field"
                  value={newCity.riskLevel}
                  onChange={(e) => setNewCity({ ...newCity, riskLevel: e.target.value })}
                >
                  <option value="Low">Xavfsiz (Normal)</option>
                  <option value="Moderate">Oʻrtacha xavf</option>
                  <option value="High">Yuqori xavf</option>
                  <option value="Severe">Ekstremal xavf</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ height: '48px', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                <Plus size={18} />
                <span>Reestrga qoʻshish</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
