import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bot, Send, Sparkles, X, MessageSquare, 
  HelpCircle, ThumbsUp, RefreshCw 
} from 'lucide-react';

export default function MeteoAIAssistant({ weatherList, onClose, isFloating = true }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('uz') ? 'uz' : i18n.language?.startsWith('ru') ? 'ru' : 'en';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: t('aiGreeting'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();

    // Check specific queries
    if (q.includes('toshkent') || q.includes('kiyin') || q.includes('wear') || q.includes('одеться') || q.includes('ташкент')) {
      const c = weatherList.find(x => x.id === 'uz-tashkent') || { temp: 24, condition: 'Sunny' };
      if (currentLang === 'uz') {
        return `Toshkentda hozir havo harorati ${c.temp}°C, holat: ${c.condition}. Namlik ${c.humidity}%, shamol tezligi ${c.windSpeed} km/soat. 
Tavsiya: Kun davomida iliq va quyoshli bo'ladi. Yengil paxtali kiyim (futbolka yoki yengil ko'ylak), quyoshdan himoyalovchi ko'zoynak taqish yetarli. Kechqurun harorat 16°C gacha tushishi mumkin, shuning uchun yoningizda yupqa nimcha yoki jaket olib yurish foydali!`;
      } else if (currentLang === 'ru') {
        return `В Ташкенте сейчас около ${c.temp}°C, погода: ${c.condition}. 
Совет по гардеробу: Днем тепло и солнечно, отлично подойдет легкая хлопковая одежда и солнцезащитные очки. К вечеру температура опустится до 16°C, поэтому рекомендую захватить легкую ветровку или кардиган!`;
      } else {
        return `Current weather in Tashkent is ${c.temp}°C, ${c.condition}. 
Outfit recommendation: It's warm and sunny today. Comfortable breathable cotton shirts and sunglasses are ideal. In the late evening, temperatures drop to around 16°C, so having a light cardigan or windbreaker is advisable!`;
      }
    }

    if (q.includes('dubay') || q.includes('dubai') || q.includes('дубай') || q.includes('issiq') || q.includes('heat') || q.includes('жар')) {
      const c = weatherList.find(x => x.id === 'ae-dubai') || { temp: 34, uvIndex: 9 };
      if (currentLang === 'uz') {
        return `⚠️ Dubayda hozir o'ta xavfli issiqlik kuzatilmoqda: ${c.temp}°C (his qilinishi 37°C), UV indeksi 9 (ekstremal)!
Xavfsizlik choralari: 
1. Soat 11:00 dan 16:00 gacha to'g'ridan-to'g'ri quyosh tig'idan saqlaning.
2. Kuniga kamida 3 litr toza suv iching.
3. SPF 50+ krem va bosh kiyimdan foydalaning.
4. Konditsionerli xonalarda qolish tavsiya etiladi.`;
      } else if (currentLang === 'ru') {
        return `⚠️ В Дубае зафиксирована сильная жара: ${c.temp}°C (ощущается как 37°C), УФ-индекс 9 (экстремальный)!
Меры предосторожности: избегайте полуденного солнца, пейте не менее 2.5–3 л воды, носите головной убор и используйте крем с SPF 50+.`;
      } else {
        return `⚠️ Severe heat alert in Dubai: ${c.temp}°C (feels like 37°C), UV Index is 9 (Extreme)!
Safety guidelines: Avoid direct sun exposure between 11 AM and 4 PM, stay well hydrated (3+ liters of water), wear SPF 50+ sunscreen, and remain in climate-controlled environments.`;
      }
    }

    if (q.includes('london') || q.includes('лондон') || q.includes('rain') || q.includes('yomg') || q.includes('дожд')) {
      const c = weatherList.find(x => x.id === 'uk-london') || { temp: 14, condition: 'Rainy' };
      if (currentLang === 'uz') {
        return `Londonda hozir ob-havo yomg'irli: ${c.temp}°C, namlik 82%, shamol 24 km/soat. 
Ogohlantirish: Yomg'ir bugun kechgacha davom etishi kutilmoqda. Albatta soyabon (zontik) va suv o'tkazmaydigan kurtka kiyib chiqing!`;
      } else if (currentLang === 'ru') {
        return `В Лондоне сейчас дождливая погода: ${c.temp}°C, влажность 82%, ветер 24 км/ч. 
Обязательно возьмите зонт и наденьте непромокаемую обувь и плащ!`;
      } else {
        return `In London, it is currently rainy and chilly at ${c.temp}°C with 82% humidity and 24 km/h westerly winds. Heavy rain advisory is active, so make sure to carry a sturdy umbrella and a waterproof trench coat!`;
      }
    }

    if (q.includes('tokio') || q.includes('tokyo') || q.includes('токио') || q.includes('sayohat') || q.includes('travel') || q.includes('поездк')) {
      if (currentLang === 'uz') {
        return `Tokioga sayohat qilish uchun eng qulay fasllar:
1. Bahor (Mart oxiri - May): Mashhur Sakura gullashi va musaffo 18-22°C ob-havo.
2. Kuz (Oktyabr - Noyabr): Qizil zarang barglari (Momiji) va quruq, yoqimli harorat.
Hozir Tokio harorati 21°C, musaffo va sayohat uchun ayni muddao!`;
      } else if (currentLang === 'ru') {
        return `Лучшее время для путешествия в Токио — это весна (конец марта – май) в сезон цветения сакуры, либо осень (октябрь – ноябрь) в период ярких кленов момидзи при комфортных 18–22°C. Сейчас в Токио 21°C, отличная ясная погода!`;
      } else {
        return `The prime seasons to visit Tokyo are Spring (late March to May) for cherry blossom bloom and Autumn (October to November) for vibrant foliage and pleasant 18–22°C temperatures. Current Tokyo temperature is 21°C and clear!`;
      }
    }

    // General intelligent response
    const highestCity = [...weatherList].sort((a, b) => b.temp - a.temp)[0] || { city: 'Dubai', temp: 34 };
    const lowestCity = [...weatherList].sort((a, b) => a.temp - b.temp)[0] || { city: 'Toronto', temp: 9 };

    if (currentLang === 'uz') {
      return `Savolingiz uchun rahmat! Men global iqlim ma'lumotlarini tahlil qildim. 
Bugungi monitoring natijalariga ko'ra:
• Eng issiq hudud: ${highestCity.city} (${highestCity.temp}°C)
• Eng sovuq hudud: ${lowestCity.city} (${lowestCity.temp}°C)
• Umumiy tahlil: Yevropa va AQSH hududlarida namlik yuqori, Osiyo va O'rta Sharqda esa musaffo quyoshli ob-havo hukm surmoqda. Qaysi aniq shahar yoki mavzu bo'yicha ma'lumot kerak?`;
    } else if (currentLang === 'ru') {
      return `Спасибо за вопрос! По данным нашего климатического мониторинга:
• Самый теплый регион: ${highestCity.city} (${highestCity.temp}°C)
• Самый прохладный: ${lowestCity.city} (${lowestCity.temp}°C)
В Европе преобладает влажная и ветреная погода, а в Азии и на Ближнем Востоке — сухо и солнечно. О каком городе или маршруте вы хотите узнать подробнее?`;
    } else {
      return `Thank you for asking! Based on our continuous atmospheric telemetry:
• Warmest registered point: ${highestCity.city} (${highestCity.temp}°C)
• Coldest registered point: ${lowestCity.city} (${lowestCity.temp}°C)
Western Europe and North America are experiencing precipitation, whereas Asia and the Middle East enjoy clear conditions. Which specific location can I assist you with?`;
    }
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reply = generateAIResponse(query);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 600);
  };

  const quickQuestions = [
    t('q1'),
    t('q2'),
    t('q3'),
    t('q4')
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isFloating ? '540px' : '650px',
        width: isFloating ? '400px' : '100%',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--border-glass)',
        borderRadius: '20px',
        boxShadow: 'var(--card-hover-shadow)',
        overflow: 'hidden'
      }}
    >
      {/* AI Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 10px var(--primary-glow)'
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <strong style={{ fontSize: '0.95rem' }}>{t('aiTitle')}</strong>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t('aiBadge')}</span>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        {messages.map((m) => {
          const isAI = m.sender === 'ai';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isAI ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                alignSelf: isAI ? 'flex-start' : 'flex-end'
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: isAI ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                  background: isAI ? 'var(--bg-card-hover)' : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                  color: isAI ? 'var(--text-main)' : '#ffffff',
                  border: isAI ? '1px solid var(--border-glass)' : 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                {m.text}
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.2rem', padding: '0 0.3rem' }}>
                {m.time}
              </span>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.82rem' }}>
            <RefreshCw size={14} className="weather-icon-sun" />
            <span>{t('thinking')}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div
        style={{
          padding: '0.5rem 1rem',
          background: 'rgba(0,0,0,0.02)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto'
        }}
      >
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              flex: '0 0 auto',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              borderRadius: '9999px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          gap: '0.5rem',
          background: 'var(--bg-card)'
        }}
      >
        <input
          type="text"
          className="input-field"
          style={{ padding: '0.6rem 0.85rem', fontSize: '0.88rem' }}
          placeholder={t('aiInputPlaceholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '0.6rem 1rem' }}
          disabled={loading || !input.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

