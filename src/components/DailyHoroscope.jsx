// src/pages/DailyHoroscope.jsx - PROFESSIONAL VERSION
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DailyHoroscope.css';
import { useLazyGetHoroscopeQuery } from '../services/backendApi';
import { 
  FiStar, 
  FiMoon, 
  FiSun, 
  FiCompass, 
  FiHeart,
  FiCalendar,
  FiClock,
  FiSmile,
  FiSunrise,
  FiZap,
  FiInfo,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiShield
} from 'react-icons/fi';

const zodiacSigns = [
  { name: 'aries', icon: '♈', element: 'Fire', rulingPlanet: 'Mars', symbol: 'Ram' },
  { name: 'taurus', icon: '♉', element: 'Earth', rulingPlanet: 'Venus', symbol: 'Bull' },
  { name: 'gemini', icon: '♊', element: 'Air', rulingPlanet: 'Mercury', symbol: 'Twins' },
  { name: 'cancer', icon: '♋', element: 'Water', rulingPlanet: 'Moon', symbol: 'Crab' },
  { name: 'leo', icon: '♌', element: 'Fire', rulingPlanet: 'Sun', symbol: 'Lion' },
  { name: 'virgo', icon: '♍', element: 'Earth', rulingPlanet: 'Mercury', symbol: 'Virgin' },
  { name: 'libra', icon: '♎', element: 'Air', rulingPlanet: 'Venus', symbol: 'Scales' },
  { name: 'scorpio', icon: '♏', element: 'Water', rulingPlanet: 'Pluto', symbol: 'Scorpion' },
  { name: 'sagittarius', icon: '♐', element: 'Fire', rulingPlanet: 'Jupiter', symbol: 'Archer' },
  { name: 'capricorn', icon: '♑', element: 'Earth', rulingPlanet: 'Saturn', symbol: 'Goat' },
  { name: 'aquarius', icon: '♒', element: 'Air', rulingPlanet: 'Uranus', symbol: 'Water Bearer' },
  { name: 'pisces', icon: '♓', element: 'Water', rulingPlanet: 'Neptune', symbol: 'Fish' },
];

const LOCK_DURATION = 24 * 60 * 60 * 1000;
const USERS_STORAGE_KEY = 'horoscopeUsers';

// Professional Horoscope Card
const HoroscopeCard = ({ sign, data, type, language }) => {
  const zodiac = zodiacSigns.find(z => z.name === sign);
  
  return (
    <div className="horoscope-card">
      <div className="card-header">
        <div className="zodiac-badge">
          <span className="zodiac-symbol">{zodiac?.icon}</span>
          <div>
            <h3>{sign.charAt(0).toUpperCase() + sign.slice(1)}</h3>
            <p>{zodiac?.symbol} • {zodiac?.element}</p>
          </div>
        </div>
        <div className="type-badge">
          <span>{type === 'daily' ? 'Daily Reading' : 'Weekly Forecast'}</span>
        </div>
      </div>

      <div className="prediction-section">
        <p className="prediction-text">
          {language === 'en' ? data?.description : data?.description_hi || 'विवरण उपलब्ध नहीं है'}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Lucky Number</span>
          <strong className="stat-value">{data?.lucky_number}</strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Lucky Color</span>
          <strong className="stat-value" style={{ color: data?.color?.toLowerCase() }}>{data?.color}</strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mood</span>
          <strong className="stat-value">{data?.mood}</strong>
        </div>
        <div className="stat-item">
          <span className="stat-label">Date</span>
          <strong className="stat-value">{data?.date}</strong>
        </div>
      </div>

      <div className="compatibility-box">
        <h4>Compatible Signs</h4>
        <div className="compatibility-list">
          <span>Leo</span>
          <span>Sagittarius</span>
          <span>Libra</span>
        </div>
      </div>
    </div>
  );
};

const LockPopup = ({ onClose, language }) => (
  <div className="lock-popup">
    <div className="popup-container">
      <h4>Sign Locked</h4>
      <p>You have already selected a sign for this name. Please try again after 24 hours.</p>
      <button onClick={onClose}>Okay</button>
    </div>
  </div>
);

const WelcomeMessage = ({ language }) => (
  <div className="welcome-container">
    <div className="welcome-icon">
      <FiStar />
    </div>
    <h3>Get Your Horoscope</h3>
    <p>Enter your name and select your zodiac sign to receive your personalized reading</p>
    <div className="steps">
      <div className="step">
        <div className="step-num">1</div>
        <span>Enter Name</span>
      </div>
      <div className="step">
        <div className="step-num">2</div>
        <span>Select Sign</span>
      </div>
      <div className="step">
        <div className="step-num">3</div>
        <span>Get Reading</span>
      </div>
    </div>
  </div>
);

const DailyHoroscope = () => {
  const [name, setName] = useState('');
  const [sign, setSign] = useState('');
  const [type, setType] = useState('daily');
  const [data, setData] = useState(null);
  const [language, setLanguage] = useState('en');
  const [showLockPopup, setShowLockPopup] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [getHoroscope, { isFetching: loading }] = useLazyGetHoroscopeQuery();

  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!name || !sign) {
        setData(null);
        return;
      }

      try {
        const result = await getHoroscope({ sign, type }).unwrap();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch horoscope:', err);
        setData(null);
      }
    };

    fetchHoroscope();
  }, [name, sign, type, getHoroscope]);

  useEffect(() => {
    if (!name) return;
    const normalizedName = name.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || {};
    const userData = users[normalizedName];

    if (userData && new Date().getTime() - userData.timestamp < LOCK_DURATION) {
      setSign(userData.sign);
      setShowNameError(false);
    } else {
      setSign('');
    }
  }, [name]);

  const handleSignChange = (newSign) => {
    if (!name.trim()) {
      setShowNameError(true);
      setTimeout(() => setShowNameError(false), 3000);
      return;
    }

    const normalizedName = name.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || {};
    const userData = users[normalizedName];
    const now = new Date().getTime();

    if (userData && now - userData.timestamp < LOCK_DURATION && userData.sign !== newSign) {
      setShowLockPopup(true);
    } else {
      setSign(newSign);
      users[normalizedName] = { sign: newSign, timestamp: now };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      setShowNameError(false);
    }
  };

  return (
    <div className="horoscope-page">
      <AnimatePresence>
        {showLockPopup && <LockPopup onClose={() => setShowLockPopup(false)} language={language} />}
      </AnimatePresence>

      <div className="horoscope-header">
        <div className="header-badge">
          <FiStar />
          <span>Vedic Astrology</span>
        </div>
        <h1>Daily Horoscope</h1>
        <p>Discover what the stars have in store for you today</p>
      </div>

      <div className="input-area">
        <div className="name-field">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={showNameError ? 'error' : ''}
          />
          {showNameError && (
            <div className="error-msg">
              <FiInfo />
              <span>Please enter your name first</span>
            </div>
          )}
        </div>

        <div className="controls">
          <div className="sign-select">
            <select value={sign} onChange={(e) => handleSignChange(e.target.value)}>
              <option value="" disabled>Select Zodiac Sign</option>
              {zodiacSigns.map((z) => (
                <option key={z.name} value={z.name}>
                  {z.icon} {z.name.charAt(0).toUpperCase() + z.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="type-toggle">
            <button className={type === 'daily' ? 'active' : ''} onClick={() => setType('daily')}>
              <FiSun /> Daily
            </button>
            <button className={type === 'weekly' ? 'active' : ''} onClick={() => setType('weekly')}>
              <FiCalendar /> Weekly
            </button>
          </div>

          <button className="lang-btn" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </div>

      <div className="results-area">
        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading horoscope...</p>
          </div>
        )}
        
        {!loading && data && (
          <HoroscopeCard 
            sign={sign} 
            data={data} 
            type={type} 
            language={language} 
          />
        )}
        
        {!loading && !data && !loading && (
          <WelcomeMessage language={language} />
        )}
      </div>
    </div>
  );
};

export default DailyHoroscope;