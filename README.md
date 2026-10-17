# 🌤️ AtmosphereX - Global Ob-havo & Meteorologik Boshqaruv Markazi

> 8+ davlatlarning jonli telemetriyasi, 3 tilda xalqaro interfeys, Dark/Light rejim, Sun'iy intellekt (MeteoAI) yordamchisi va Aero-Sidebar'li to'liq Admin Boshqaruv Markazi.

![AtmosphereX Weather](https://img.shields.io/badge/Status-Live%20Production-success?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-8.3.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌟 Asosiy Imkoniyatlar (Key Features)

- 🌍 **8+ Global Davlatlar & Shaharlar:** O'zbekiston, AQSH, Buyuk Britaniya, Yaponiya, Fransiya, Germaniya, BAA, Turkiya, Janubiy Koreya, Kanada, Italiya.
- 🌓 **Dark & Light Mode:** Kosmik qorong'i (Cosmic Nebula) va musaffo kunduzgi (Fresh Sky) mavzular. Sozlamalar `localStorage`da saqlanadi.
- 🌐 **3 Tilli Tizim:** O'zbekcha 🇺🇿, English 🇬🇧, Русский 🇷🇺 (i18next asosida to'liq tarjima).
- 🎛️ **Interaktiv Admin Boshqaruv Markazi (Command Center):**
  - **Aero-Sidebar ("Sayt bar"):** Kengayuvchi/yig'iluvchi menyu, Bosh meteorolog statusi, jonli tarmoq ko'rsatkichlari.
  - **Jonli Harorat Sliders:** Haroratni -20°C dan +50°C gacha dinamik rangli slayderlar orqali boshqarish.
  - **1-Click Holat Sozlagichlari:** ☀️ Quyoshli, ⛅ Bulutli, 🌧️ Yomg'irli, ❄️ Qorli, 🔥 Jazirama.
  - **Jonli Simulyatsiya Dvigateli:** Har 3 soniyada avtomatik o'zgarishlar va jonli terminal loglari (`ATMOSPHEREX_KERNEL_STREAM`).
  - **Favqulodda Dispetcher:** Butun platformaga qizil sirenli xabar tarqatuvchi 1-click tayyor shablonlar (Qum bo'roni, Sel, Qor to'foni, Jazirama).
  - **Doppler Radari & Sun'iy Yo'ldosh:** 360° aylanuvchi skaner nuri, Sentinel-6, Meteosat-11 va GOES-16 telemetriyasi.
  - **JSON Zahira (Backup & Restore):** Ma'lumotlarni JSON fayl qilib yuklab olish va fayldan tiklash.
- 🤖 **MeteoAI - Sun'iy Intellekt Maslahatchisi:** Ob-havoga mos kiyinish, sayohat rejalashtirish, qishloq xo'jaligi va ekstremal xavflar bo'yicha tavsiyalar.
- 💫 **Dinamik Animatsiyalar:** Suzuvchi bulutlar, quyosh aylanishi, yomg'ir mikrodinamikasi, pulsatsiyalovchi nurlar.

---

## 🛠️ Texnologiyalar (Tech Stack)

- **Frontend:** React 19, Vite
- **Styling:** Vanilla CSS Design System (Glassmorphism, CSS Custom Properties, HSL-tailored)
- **Icons:** Lucide React
- **Internationalization:** i18next, react-i18next
- **Routing:** React Router DOM (v7)
- **Deployment:** Vercel

---

## 🚀 O'rnatish va Ishga Tushirish (Local Setup)

```bash
# 1. Repozitoriyani klonlash
git clone https://github.com/maqsudovorifxoja-beep/weather.git

# 2. Papkaga kirish
cd weather

# 3. Bog'liqliklarni o'rnatish
npm install

# 4. Mahalliy serverni ishga tushirish
npm run dev
```

Brauzeringizda oching: `http://localhost:3000/`

---

## 📦 Vercel Deploy

Ushbu loyiha Vercel platformasi uchun to'liq moslashtirilgan (`vercel.json` SPA routing bilan).

```bash
# Vercel CLI orqali:
npx vercel
```
Yoki [vercel.com](https://vercel.com) saytida ushbu GitHub repozitoriyasini bog'lab, 1 ta tugma bilan deploy qilishingiz mumkin.
