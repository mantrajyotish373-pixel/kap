// src/pages/HomePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetAstrologersQuery } from '../services/backendApi';

// Import icons
import { 
  FiArrowRight, 
  FiStar, 
  FiSun, 
  FiShield,
  FiAward,
  FiCheckCircle,
  FiTrendingUp,
  FiChevronRight,
  FiGlobe,
  FiX
} from 'react-icons/fi';

// Import components
import ServicesSection from '../components/ServicesSection';
import DailyInsights from '../components/DailyInsights';
import ConsultationTopics from '../components/ConsultationTopics';
import NakshatrasSection from '../components/NakshatrasSection';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

import './HomePage.css';

// Banner Images
const bannerSlides = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1920",
    title: "Connect with",
    highlight: "Trusted Astrologers",
    subtitle: "Get answers to love, career, wealth, and life's every question",
    ctaText: "Contact Experts",
    ctaLink: "/astro-connect"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1920",
    title: "Ancient Vedic",
    highlight: "Astrology Experts",
    subtitle: "Discover your future - Career, Health, Wealth, and Success",
    ctaText: "Create Free Kundli",
    ctaLink: "/horoscope"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920",
    title: "24/7 Spiritual",
    highlight: "Guidance Available",
    subtitle: "Connect anytime - Solutions for every problem with our experts",
    ctaText: "Talk Now",
    ctaLink: "/astro-connect"
  }
];

const FullScreenBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setProgress(0);
    resetInterval();
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setProgress(0);
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
    setProgress(0);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startAutoSlide();
  };

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
      setProgress(0);
    }, 6000);
  };

  useEffect(() => {
    const startTime = Date.now();
    const duration = 6000;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      if (newProgress < 100) requestAnimationFrame(updateProgress);
    };
    
    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [currentIndex]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const currentSlide = bannerSlides[currentIndex];

  const handleCtaClick = () => {
    navigate(currentSlide.ctaLink);
  };

  return (
    <div className="fullscreen-banner">
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`banner-bg ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="banner-overlay-gradient"></div>

      <div className="banner-content">
        <div className="banner-text-container">
          <h1 className="banner-title">
            {currentSlide.title} <span className="banner-highlight">{currentSlide.highlight}</span>
          </h1>
          <p className="banner-subtitle">{currentSlide.subtitle}</p>
          <button onClick={handleCtaClick} className="banner-cta">
            {currentSlide.ctaText} <FiArrowRight />
          </button>
        </div>
      </div>

      <button className="banner-arrow prev" onClick={goToPrev}>‹</button>
      <button className="banner-arrow next" onClick={goToNext}>›</button>

      <div className="banner-dots">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <div className="banner-progress" style={{ width: `${progress}%` }} />
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { value: "50K+", label: "Happy Clients" },
    { value: "100+", label: "Expert Astrologers" },
    { value: "24/7", label: "Support Available" },
    { value: "4.9", label: "Rating" }
  ];

  return (
    <div className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
            {index < stats.length - 1 && <div className="stat-divider"></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Simple Language Selector Component
const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  const languages = [
    { code: "en", name: "English", native: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
    { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
    { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  ];

  const translations = {
    en: {
      trustBadge: "Trusted by 50,000+ Devotees",
      heroTitle: "Connect with",
      heroHighlight: "Vedic Experts",
      heroSubtitle: "Talk to certified astrologers for answers to love, career, wealth, and all life's questions",
      connectBtn: "Connect with Experts",
      freeKundli: "Free Kundli",
      vedicExperts: "Vedic Experts",
      certified: "100+ Certified Astrologers",
      support: "24/7 Support",
      supportText: "Anytime Consultation",
      private: "100% Private",
      privateText: "Secure & Confidential",
      ourExperts: "Our Experts",
      ourExpertsDesc: "Connect with our certified experts having decades of experience in Vedic astrology",
      viewAll: "View All Astrologers",
      consultation: "Consultation Process",
      consultationDesc: "Simple, fast, and effective — solutions in three easy steps",
      chooseAstrologer: "Choose an Astrologer",
      chooseDesc: "Select based on expertise and experience",
      selectService: "Select Service",
      selectDesc: "Chat, Call, or Video Call - as you prefer",
      askSolutions: "Ask & Get Solutions",
      askDesc: "Connect instantly and receive guidance",
      ancientTitle: "Ancient Tradition of Vedic Astrology",
      ancientDesc: "At Mantra Jyotish, we follow ancient Vedic texts and rich traditions of Indian astrology. Our astrologers are proficient in astrology knowledge passed down through generations.",
      authentic: "Authentic Astrology Calculations",
      panchang: "Panchang & Muhurta Considerations",
      birthChart: "Birth Chart Analysis",
      whyChoose: "Why Choose Mantra Jyotish?",
      whyDesc: "We make astrology simple, accessible, and effective",
      confidential: "100% Confidential",
      confidentialDesc: "Your conversations are completely secure and private",
      certifiedExperts: "Certified Experts",
      certifiedDesc: "All astrologers are certified in astrology",
      affordable: "Affordable Services",
      affordableDesc: "Starting from just ₹15 per minute",
      chooseLanguage: "Choose Your Preferred Language",
      languageDesc: "Select a language to view the website in your preferred language"
    },
    hi: {
      trustBadge: "50,000+ भक्तों द्वारा विश्वसनीय",
      heroTitle: "जुड़ें",
      heroHighlight: "वैदिक विशेषज्ञों से",
      heroSubtitle: "प्रेम, करियर, धन और जीवन के हर सवाल के जवाब के लिए प्रमाणित ज्योतिषियों से बात करें",
      connectBtn: "विशेषज्ञों से जुड़ें",
      freeKundli: "मुफ्त कुंडली",
      vedicExperts: "वैदिक विशेषज्ञ",
      certified: "100+ प्रमाणित ज्योतिषी",
      support: "24x7 सहायता",
      supportText: "कभी भी परामर्श",
      private: "100% निजी",
      privateText: "सुरक्षित और गोपनीय",
      ourExperts: "हमारे विशेषज्ञ",
      ourExpertsDesc: "वैदिक ज्योतिष में दशकों के अनुभव वाले हमारे प्रमाणित विशेषज्ञों से जुड़ें",
      viewAll: "सभी ज्योतिषी देखें",
      consultation: "परामर्श प्रक्रिया",
      consultationDesc: "सरल, तेज़ और प्रभावी — तीन आसान चरणों में समाधान",
      chooseAstrologer: "ज्योतिषी चुनें",
      chooseDesc: "विशेषज्ञता और अनुभव के आधार पर चयन करें",
      selectService: "सेवा चुनें",
      selectDesc: "चैट, कॉल या वीडियो कॉल - जैसा आप चाहें",
      askSolutions: "पूछें और समाधान पाएं",
      askDesc: "तुरंत जुड़ें और मार्गदर्शन प्राप्त करें",
      ancientTitle: "वैदिक ज्योतिष की प्राचीन परंपरा",
      ancientDesc: "मंत्र ज्योतिष में, हम प्राचीन वैदिक ग्रंथों और भारतीय ज्योतिष की समृद्ध परंपराओं का पालन करते हैं। हमारे ज्योतिषी पीढ़ियों से हस्तांतरित ज्योतिष ज्ञान में निपुण हैं।",
      authentic: "प्रामाणिक ज्योतिष गणना",
      panchang: "पंचांग और मुहूर्त संबंधी विचार",
      birthChart: "जन्म कुंडली विश्लेषण",
      whyChoose: "मंत्र ज्योतिष क्यों चुनें?",
      whyDesc: "हम ज्योतिष को सरल, सुलभ और प्रभावी बनाते हैं",
      confidential: "100% गोपनीय",
      confidentialDesc: "आपकी बातचीत पूरी तरह से सुरक्षित और निजी है",
      certifiedExperts: "प्रमाणित विशेषज्ञ",
      certifiedDesc: "सभी ज्योतिषी ज्योतिष में प्रमाणित हैं",
      affordable: "किफायती सेवाएं",
      affordableDesc: "सिर्फ ₹15 प्रति मिनट से शुरू",
      chooseLanguage: "अपनी पसंदीदा भाषा चुनें",
      languageDesc: "अपनी पसंदीदा भाषा में वेबसाइट देखने के लिए भाषा चुनें"
    },
    te: {
      trustBadge: "50,000+ భక్తులచే నమ్మకం",
      heroTitle: "కనెక్ట్ అవ్వండి",
      heroHighlight: "వేద నిపుణులతో",
      heroSubtitle: "ప్రేమ, కెరీర్, సంపద మరియు జీవితంలోని ప్రతి ప్రశ్నకు సమాధానాల కోసం సర్టిఫైడ్ జ్యోతిష్కులతో మాట్లాడండి",
      connectBtn: "నిపుణులతో కనెక్ట్ అవ్వండి",
      freeKundli: "ఉచిత కుండలి",
      vedicExperts: "వేద నిపుణులు",
      certified: "100+ సర్టిఫైడ్ జ్యోతిష్కులు",
      support: "24/7 మద్దతు",
      supportText: "ఎప్పుడైనా సంప్రదింపులు",
      private: "100% ప్రైవేట్",
      privateText: "సురక్షితం మరియు గోప్యం",
      ourExperts: "మా నిపుణులు",
      ourExpertsDesc: "వేద జ్యోతిషంలో దశాబ్దాల అనుభవం ఉన్న మా సర్టిఫైడ్ నిపుణులతో కనెక్ట్ అవ్వండి",
      viewAll: "అందరి జ్యోతిష్కులను చూడండి",
      consultation: "సంప్రదింపుల ప్రక్రియ",
      consultationDesc: "సులభం, వేగవంతం మరియు ప్రభావవంతం — మూడు సులభ దశల్లో పరిష్కారాలు",
      chooseAstrologer: "జ్యోతిష్కుని ఎంచుకోండి",
      chooseDesc: "నైపుణ్యం మరియు అనుభవం ఆధారంగా ఎంచుకోండి",
      selectService: "సేవను ఎంచుకోండి",
      selectDesc: "చాట్, కాల్ లేదా వీడియో కాల్ - మీ ప్రాధాన్యత ప్రకారం",
      askSolutions: "అడగండి & పరిష్కారాలు పొందండి",
      askDesc: "తక్షణమే కనెక్ట్ అవ్వండి మరియు మార్గదర్శకత్వం పొందండి",
      ancientTitle: "వేద జ్యోతిషం యొక్క ప్రాచీన సంప్రదాయం",
      ancientDesc: "మంత్ర జ్యోతిష్లో, మేము ప్రాచీన వేద గ్రంథాలను మరియు భారతీయ జ్యోతిషం యొక్క సంపన్న సంప్రదాయాలను అనుసరిస్తాము. మా జ్యోతిష్కులు తరాలుగా బదిలీ చేయబడిన జ్యోతిష జ్ఞానంలో ప్రావీణ్యం కలిగి ఉంటారు.",
      authentic: "ప్రామాణిక జ్యోతిష గణనలు",
      panchang: "పంచాంగం & ముహూర్త పరిగణనలు",
      birthChart: "జన్మ కుండలి విశ్లేషణ",
      whyChoose: "మంత్ర జ్యోతిష్ ఎందుకు ఎంచుకోవాలి?",
      whyDesc: "మేము జ్యోతిషాన్ని సరళంగా, అందుబాటులో మరియు ప్రభావవంతంగా చేస్తాము",
      confidential: "100% గోప్యమైన",
      confidentialDesc: "మీ సంభాషణలు పూర్తిగా సురక్షితం మరియు ప్రైవేట్",
      certifiedExperts: "సర్టిఫైడ్ నిపుణులు",
      certifiedDesc: "అందరు జ్యోతిష్కులు జ్యోతిషంలో సర్టిఫైడ్",
      affordable: "సరసమైన సేవలు",
      affordableDesc: "కేవలం ₹15 ప్రతి నిమిషం నుండి ప్రారంభం",
      chooseLanguage: "మీ ప్రాధాన్య భాషను ఎంచుకోండి",
      languageDesc: "మీ ప్రాధాన్య భాషలో వెబ్సైట్ను చూడటానికి భాషను ఎంచుకోండి"
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("preferred_language");
    if (savedLang && savedLang !== "en") {
      setCurrentLang(savedLang);
      applyTranslation(savedLang);
    }
  }, []);

  const applyTranslation = (langCode) => {
    const t = translations[langCode];
    if (!t) return;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.getAttribute("data-translate");
      if (t[key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = t[key];
        } else {
          el.innerHTML = t[key];
        }
      }
    });
  };

  const handleLanguageSelect = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem("preferred_language", langCode);
    localStorage.setItem("has_seen_language_popup", "true");
    
    if (langCode === "en") {
      window.location.reload();
    } else {
      applyTranslation(langCode);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button className="floating-lang-btn" onClick={() => setIsOpen(true)}>
        <FiGlobe /> {currentLang.toUpperCase()}
      </button>

      {isOpen && (
        <div className="lang-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="lang-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lang-modal-close" onClick={() => setIsOpen(false)}>
              <FiX />
            </button>
            <div className="lang-modal-header">
              <span className="lang-modal-icon">🌐</span>
              <h3 data-translate="chooseLanguage">Choose Your Preferred Language</h3>
              <p data-translate="languageDesc">Select a language to view the website in your preferred language</p>
            </div>
            <div className="lang-grid">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-option ${currentLang === lang.code ? "active" : ""}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <div className="lang-text">
                    <span className="lang-name">{lang.name}</span>
                    <span className="lang-native">{lang.native}</span>
                  </div>
                  {currentLang === lang.code && <span className="lang-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CosmicParticles = () => {
  const particleCount = 40;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.25 + 0.05
  }));

  return (
    <div className="cosmic-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            opacity: particle.opacity
          }}
        />
      ))}
    </div>
  );
};

const FloatingSymbols = () => {
  const symbols = ["🕉️", "🔱", "🪔", "🌙", "☀️", "🔔"];

  return (
    <div className="floating-symbols">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className="divine-symbol"
          style={{
            animationDelay: `${index * 1.2}s`,
            animationDuration: `${30 + index * 3}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
};

const AstrologerAvatarCard = ({ astrologer }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/astro-connect');
  };

  return (
    <motion.div 
      className="astro-avatar-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
    >
      <div className="avatar-frame">
        <img 
          src={astrologer.profilePhoto || astrologer.user_profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=E67E22&color=fff&bold=true&size=100`}
          alt={astrologer.name}
          className="astro-mini-avatar"
        />
        <div className="avatar-pulse"></div>
      </div>
      <h4 className="astro-mini-name">{astrologer.name.split(' ')[0]}</h4>
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { data: astrologers = [], isLoading } = useGetAstrologersQuery();
  const featuredAstrologers = astrologers.slice(0, 8);

  const handleViewAll = () => {
    navigate('/astro-connect');
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <LanguageSelector />
      
      <FullScreenBanner />
      <StatsSection />

      <section className="hero-section">
        <div className="divine-background">
          <div className="mandala-bg"></div>
          <div className="om-bg"></div>
        </div>

        <CosmicParticles />
        <FloatingSymbols />

        <div className="hero-vignette"></div>

        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <motion.div 
              className="trust-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="badge-icon">⭐</span>
              <span data-translate="trustBadge">Trusted by 50,000+ Devotees</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="hero-title-main">
                <span data-translate="heroTitle">Connect with</span>{' '}
                <span className="hero-title-highlight" data-translate="heroHighlight">Vedic Experts</span>
              </span>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              data-translate="heroSubtitle"
            >
              Talk to certified astrologers for answers to love, career, wealth, and all life's questions
            </motion.p>

            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <button onClick={() => navigate('/astro-connect')} className="cta-btn primary">
                <span data-translate="connectBtn">Connect with Experts</span>
                <FiArrowRight />
              </button>
              <Link to="/horoscope" className="cta-btn secondary">
                <FiSun />
                <span data-translate="freeKundli">Free Kundli</span>
              </Link>
            </motion.div>

            <motion.div 
              className="hero-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="feature-item">
                <div className="feature-icon">🔮</div>
                <div className="feature-text">
                  <h4 data-translate="vedicExperts">Vedic Experts</h4>
                  <p data-translate="certified">100+ Certified Astrologers</p>
                </div>
              </div>
              <div className="feature-divider"></div>
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                <div className="feature-text">
                  <h4 data-translate="support">24/7 Support</h4>
                  <p data-translate="supportText">Anytime Consultation</p>
                </div>
              </div>
              <div className="feature-divider"></div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">
                  <h4 data-translate="private">100% Private</h4>
                  <p data-translate="privateText">Secure & Confidential</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="scroll-indicator" onClick={handleScrollToTop}>
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <p>SCROLL</p>
        </div>
      </section>

      <section className="our-astrologers-section">
        <div className="section-header">
          <div className="header-badge">
            <FiStar />
            <span data-translate="ourExperts">Our Experts</span>
          </div>
          <h2><span data-translate="ourExperts">Our</span> <span className="title-highlight" data-translate="ourExperts">Astrologers</span></h2>
          <p className="section-description" data-translate="ourExpertsDesc">
            Connect with our certified experts having decades of experience in Vedic astrology
          </p>
        </div>

        {isLoading ? (
          <div className="loader-container">
            <div className="divine-loader">
              <div className="loader-om">🕉️</div>
              <p>Loading astrologers...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="astrologer-avatars-grid">
              {featuredAstrologers.map((astro) => (
                <AstrologerAvatarCard key={astro._id} astrologer={astro} />
              ))}
            </div>

            <div className="view-all-container">
              <button onClick={handleViewAll} className="view-all-btn">
                <span data-translate="viewAll">View All Astrologers</span> <FiChevronRight />
              </button>
            </div>
          </>
        )}
      </section>

      <section className="how-it-works">
        <div className="section-header">
          <h2 data-translate="consultation">Consultation Process</h2>
          <p data-translate="consultationDesc">Simple, fast, and effective — solutions in three easy steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 data-translate="chooseAstrologer">Choose an Astrologer</h3>
            <p data-translate="chooseDesc">Select based on expertise and experience</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3 data-translate="selectService">Select Service</h3>
            <p data-translate="selectDesc">Chat, Call, or Video Call - as you prefer</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3 data-translate="askSolutions">Ask & Get Solutions</h3>
            <p data-translate="askDesc">Connect instantly and receive guidance</p>
          </div>
        </div>
      </section>

      <section className="ancient-wisdom">
        <div className="wisdom-container">
          <div className="wisdom-content">
            <h2 data-translate="ancientTitle">Ancient Tradition of Vedic Astrology</h2>
            <p data-translate="ancientDesc">At Mantra Jyotish, we follow ancient Vedic texts and rich traditions of Indian astrology. Our astrologers are proficient in astrology knowledge passed down through generations.</p>
            <div className="wisdom-features">
              <div className="wisdom-item">
                <FiCheckCircle />
                <span data-translate="authentic">Authentic Astrology Calculations</span>
              </div>
              <div className="wisdom-item">
                <FiCheckCircle />
                <span data-translate="panchang">Panchang & Muhurta Considerations</span>
              </div>
              <div className="wisdom-item">
                <FiCheckCircle />
                <span data-translate="birthChart">Birth Chart Analysis</span>
              </div>
            </div>
          </div>
          <div className="wisdom-symbol">
            <div className="rudraksha">🔱</div>
            <div className="shlok">"As is the atom, so is the universe"</div>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <div className="section-header">
          <h2 data-translate="whyChoose">Why Choose Mantra Jyotish?</h2>
          <p data-translate="whyDesc">We make astrology simple, accessible, and effective</p>
        </div>
        <div className="features-grid">
          <div className="feature">
            <FiShield />
            <h3 data-translate="confidential">100% Confidential</h3>
            <p data-translate="confidentialDesc">Your conversations are completely secure and private</p>
          </div>
          <div className="feature">
            <FiAward />
            <h3 data-translate="certifiedExperts">Certified Experts</h3>
            <p data-translate="certifiedDesc">All astrologers are certified in astrology</p>
          </div>
          <div className="feature">
            <FiTrendingUp />
            <h3 data-translate="affordable">Affordable Services</h3>
            <p data-translate="affordableDesc">Starting from just ₹15 per minute</p>
          </div>
        </div>
      </section>

      <ServicesSection />
    
      <Testimonials />
      <BlogSection />
      
      <Footer />
    </>
  );
};

export default HomePage;