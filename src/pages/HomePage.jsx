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
  FiX,
  FiMail,
  FiPhoneCall,
  FiVideo,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiMessageCircle,
  FiHeadphones,
  FiBookOpen,
  FiCompass
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
    image: "/home/pranjal-maithani/Pranjal/kalpjyotish-frontend/src/data/banner1.png",
    title: "Connect with",
    highlight: "Trusted Astrologers",
    subtitle: "Get answers to love, career, wealth, and life's every question",
    ctaText: "Contact Experts",
    ctaLink: "/astro-connect"
  },
  {
    id: 2,
    image: "/home/pranjal-maithani/Pranjal/kalpjyotish-frontend/src/data/banner2.png",
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

// Updated FullScreenBanner component in HomePage.jsx

const FullScreenBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Banner images from data folder
  const bannerSlides = [
    {
      id: 1,
      image: "/src/data/banner1.png",
      fallbackImage: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Connect with Trusted Astrologers",
      ctaLink: "/astro-connect"
    },
    {
      id: 2,
      image: "/src/data/banner2.png",
      fallbackImage: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Ancient Vedic Astrology Experts",
      ctaLink: "/horoscope"
    },
    {
      id: 3,
      image: "/src/data/banner3.png",
      fallbackImage: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "24/7 Spiritual Guidance Available",
      ctaLink: "/astro-connect"
    }
  ];

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

  const handleBannerClick = () => {
    navigate(currentSlide.ctaLink);
  };

  const getImageUrl = (slide) => {
    if (imageErrors[slide.id]) {
      return slide.fallbackImage;
    }
    return slide.image;
  };

  const handleImageError = (slideId) => {
    setImageErrors(prev => ({ ...prev, [slideId]: true }));
  };

  return (
    <div className="fullscreen-banner">
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`banner-bg ${index === currentIndex ? 'active' : ''}`}
          style={{ 
            backgroundImage: `url(${getImageUrl(slide)})`,
            backgroundColor: '#FFF5F0'
          }}
          onError={() => handleImageError(slide.id)}
        />
      ))}
      
      <div className="banner-overlay-light"></div>
      <div className="banner-clickable-area" onClick={handleBannerClick}></div>

      {/* Navigation Arrows */}
      <button className="banner-arrow prev" onClick={(e) => { e.stopPropagation(); goToPrev(); }}>‹</button>
      <button className="banner-arrow next" onClick={(e) => { e.stopPropagation(); goToNext(); }}>›</button>

      {/* Dots Navigation */}
      <div className="banner-dots">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
          />
        ))}
      </div>

      <div className="banner-progress" style={{ width: `${progress}%` }} />
    </div>
  );
};

// Professional Logo Component
const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <div className="logo-mandala">
          <span className="logo-om">🕉️</span>
          <div className="mandala-dots">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div className="logo-text">
        <span className="logo-name">Mantra<span className="logo-highlight">Jyotish</span></span>
        <span className="logo-tagline">Vedic Astrology Center</span>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ icon, title, description, features, buttonText, buttonLink, buttonColor }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="service-card-new"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <div className="service-card-icon" style={{ background: buttonColor }}>
        {icon}
      </div>
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-description">{description}</p>
      <ul className="service-card-features">
        {features.map((feature, idx) => (
          <li key={idx}>
            <FiCheckCircle className="feature-check" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={() => navigate(buttonLink)} 
        className="service-card-btn"
        style={{ background: buttonColor }}
      >
        {buttonText} <FiArrowRight />
      </button>
    </motion.div>
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
      ourExperts: "Our Experts",
      ourExpertsDesc: "Connect with our certified experts having decades of experience in Vedic astrology",
      viewAll: "View All Astrologers",
      chatTitle: "Chat with Astrologer",
      chatDesc: "Get instant answers through private chat consultation",
      chatFeatures: "Instant Response, Private Chat, 24/7 Available",
      callTitle: "Call with Astrologer",
      callDesc: "Speak directly with expert astrologers on call",
      callFeatures: "Direct Conversation, Personalized Guidance, Recorded Sessions",
      poojaTitle: "Book Pooja",
      poojaDesc: "Book authentic Vedic poojas performed by expert priests",
      poojaFeatures: "Vedic Rituals, Online Booking, Prasad Delivery",
      chatBtn: "Start Chat",
      callBtn: "Book Call",
      poojaBtn: "Book Now",
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
      languageDesc: "Select a language to view the website in your preferred language",
      experience: "Years Exp",
      languages: "Languages",
      chat: "Chat",
      call: "Call"
    },
    hi: {
      trustBadge: "50,000+ भक्तों द्वारा विश्वसनीय",
      heroTitle: "जुड़ें",
      heroHighlight: "वैदिक विशेषज्ञों से",
      heroSubtitle: "प्रेम, करियर, धन और जीवन के हर सवाल के जवाब के लिए प्रमाणित ज्योतिषियों से बात करें",
      connectBtn: "विशेषज्ञों से जुड़ें",
      freeKundli: "मुफ्त कुंडली",
      ourExperts: "हमारे विशेषज्ञ",
      ourExpertsDesc: "वैदिक ज्योतिष में दशकों के अनुभव वाले हमारे प्रमाणित विशेषज्ञों से जुड़ें",
      viewAll: "सभी ज्योतिषी देखें",
      chatTitle: "ज्योतिषी से चैट करें",
      chatDesc: "निजी चैट परामर्श के माध्यम से त्वरित उत्तर प्राप्त करें",
      chatFeatures: "त्वरित प्रतिक्रिया, निजी चैट, 24/7 उपलब्ध",
      callTitle: "ज्योतिषी से कॉल करें",
      callDesc: "कॉल पर विशेषज्ञ ज्योतिषियों से सीधे बात करें",
      callFeatures: "सीधी बातचीत, व्यक्तिगत मार्गदर्शन, रिकॉर्डेड सत्र",
      poojaTitle: "पूजा बुक करें",
      poojaDesc: "विशेषज्ञ पुजारियों द्वारा की जाने वाली प्रामाणिक वैदिक पूजाएं बुक करें",
      poojaFeatures: "वैदिक अनुष्ठान, ऑनलाइन बुकिंग, प्रसाद डिलीवरी",
      chatBtn: "चैट शुरू करें",
      callBtn: "कॉल बुक करें",
      poojaBtn: "अभी बुक करें",
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
      languageDesc: "अपनी पसंदीदा भाषा में वेबसाइट देखने के लिए भाषा चुनें",
      experience: "वर्षों का अनुभव",
      languages: "भाषाएँ",
      chat: "चैट",
      call: "कॉल"
    },
    te: {
      trustBadge: "50,000+ భక్తులచే నమ్మకం",
      heroTitle: "కనెక్ట్ అవ్వండి",
      heroHighlight: "వేద నిపుణులతో",
      heroSubtitle: "ప్రేమ, కెరీర్, సంపద మరియు జీవితంలోని ప్రతి ప్రశ్నకు సమాధానాల కోసం సర్టిఫైడ్ జ్యోతిష్కులతో మాట్లాడండి",
      connectBtn: "నిపుణులతో కనెక్ట్ అవ్వండి",
      freeKundli: "ఉచిత కుండలి",
      ourExperts: "మా నిపుణులు",
      ourExpertsDesc: "వేద జ్యోతిషంలో దశాబ్దాల అనుభవం ఉన్న మా సర్టిఫైడ్ నిపుణులతో కనెక్ట్ అవ్వండి",
      viewAll: "అందరి జ్యోతిష్కులను చూడండి",
      chatTitle: "జ్యోతిష్కునితో చాట్ చేయండి",
      chatDesc: "ప్రైవేట్ చాట్ కన్సల్టేషన్ ద్వారా తక్షణ సమాధానాలు పొందండి",
      chatFeatures: "తక్షణ ప్రతిస్పందన, ప్రైవేట్ చాట్, 24/7 అందుబాటులో",
      callTitle: "జ్యోతిష్కునితో కాల్ చేయండి",
      callDesc: "కాల్లో నిపుణుల జ్యోతిష్కులతో నేరుగా మాట్లాడండి",
      callFeatures: "నేరుగా సంభాషణ, వ్యక్తిగత మార్గదర్శకత్వం, రికార్డ్ చేసిన సెషన్లు",
      poojaTitle: "పూజ బుక్ చేయండి",
      poojaDesc: "నిపుణుల పూజారులచే నిర్వహించబడే ప్రామాణిక వేద పూజలను బుక్ చేయండి",
      poojaFeatures: "వేద ఆచారాలు, ఆన్లైన్ బుకింగ్, ప్రసాద్ డెలివరీ",
      chatBtn: "చాట్ ప్రారంభించండి",
      callBtn: "కాల్ బుక్ చేయండి",
      poojaBtn: "ఇప్పుడే బుక్ చేయండి",
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
      languageDesc: "మీ ప్రాధాన్య భాషలో వెబ్సైట్ను చూడటానికి భాషను ఎంచుకోండి",
      experience: "సంవత్సరాల అనుభవం",
      languages: "భాషలు",
      chat: "చాట్",
      call: "కాల్"
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
// Update the AstrologerProfileCard component in HomePage.jsx
const AstrologerProfileCard = ({ astrologer }) => {
  const navigate = useNavigate();
  
  const name = astrologer.name || "Astrologer";
  const experience = astrologer.experience || Math.floor(Math.random() * 20) + 5;
  const languages = astrologer.languages || ["Hindi", "English"];
  const price = astrologer.price || "15";
  const rating = astrologer.rating || "4.9";
  const reviews = astrologer.reviews || Math.floor(Math.random() * 500) + 100;

  const handleConnect = (type) => {
    navigate('/astro-connect', { state: { selectedAstrologer: astrologer, connectType: type } });
  };

  return (
    <motion.div 
      className="astro-profile-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      style={{ opacity: 1 }} // Force opacity
    >
      <div className="profile-card-inner">
        <div className="profile-avatar-section">
          <div className="profile-avatar-frame">
            <img 
              src={astrologer.profilePhoto || astrologer.user_profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4361EE&color=fff&bold=true&size=120`}
              alt={name}
              className="profile-avatar"
            />
            <div className="avatar-status-badge online"></div>
          </div>
          <div className="profile-rating">
            <FiStar className="star-icon" /> {rating} ({reviews}+ reviews)
          </div>
        </div>

        <div className="profile-info-section">
          {/* FORCE INLINE STYLE FOR NAME */}
          <h3 className="profile-name" style={{ color: '#000000', opacity: 1, fontWeight: 800 }}>
            {name}
          </h3>
          <p className="profile-expertise">{astrologer.specialization || "Vedic Astrology Expert"}</p>
          
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">{experience}+</span>
              <span className="stat-label" data-translate="experience">Years Exp</span>
            </div>
            <div className="profile-stat-divider"></div>
            <div className="profile-stat">
              <span className="stat-value">{languages.slice(0, 2).join(", ")}</span>
              <span className="stat-label" data-translate="languages">Languages</span>
            </div>
          </div>

          {/* FORCE INLINE STYLES FOR PRICE */}
          <div className="profile-price" style={{ opacity: 1 }}>
            <span className="price-currency" style={{ color: '#4361EE', fontWeight: 700 }}>₹</span>
            <span className="price-value" style={{ color: '#000000', opacity: 1, fontWeight: 900, fontSize: '1.6rem' }}>
              {price}
            </span>
            <span className="price-period" style={{ color: '#000000', opacity: 1, fontWeight: 700 }}>
              /min
            </span>
          </div>

          <div className="profile-action-buttons">
            <button onClick={() => handleConnect('chat')} className="action-btn chat-btn">
              <FiMessageCircle /> <span data-translate="chat">Chat</span>
            </button>
            <button onClick={() => handleConnect('call')} className="action-btn call-btn">
              <FiHeadphones /> <span data-translate="call">Call</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
const HomePage = () => {
  const navigate = useNavigate();
  const { data: astrologers = [], isLoading } = useGetAstrologersQuery();
  const featuredAstrologers = astrologers.slice(0, 6);

  const handleViewAll = () => {
    navigate('/astro-connect');
  };

  // Service cards data
  const serviceCards = [
    {
      icon: <FiMessageCircle className="service-icon" />,
      title: "Chat with Astrologer",
      description: "Get instant answers through private chat consultation with expert astrologers",
      features: ["Instant Response", "Private & Secure Chat", "24/7 Availability", "Affordable Rates"],
      buttonText: "Start Chat",
      buttonLink: "/astro-connect",
      buttonColor: "linear-gradient(135deg, #6366F1, #4F46E5)"
    },
    {
      icon: <FiHeadphones className="service-icon" />,
      title: "Call with Astrologer",
      description: "Speak directly with expert astrologers on call for personalized guidance",
      features: ["Direct Conversation", "Personalized Guidance", "Recorded Sessions", "Flexible Timing"],
      buttonText: "Book Call",
      buttonLink: "/astro-connect",
      buttonColor: "linear-gradient(135deg, #10B981, #059669)"
    },
    {
      icon: <FiCalendar className="service-icon" />,
      title: "Book Pooja",
      description: "Book authentic Vedic poojas performed by expert priests from the comfort of your home",
      features: ["Vedic Rituals", "Online Booking", "Prasad Delivery", "Live Telecast Available"],
      buttonText: "Book Now",
      buttonLink: "/pooja",
      buttonColor: "linear-gradient(135deg, #F59E0B, #D97706)"
    }
  ];

  return (
    <>
      <LanguageSelector />
      
      <FullScreenBanner />

      {/* Our Astrologers Section - Directly Below Banner */}
      <section className="our-astrologers-section">
        <div className="section-header">
         
          <h2><span data-translate="ourExperts">Our Astrologers</span> </h2>
         
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
            <div className="astrologer-profiles-grid">
              {featuredAstrologers.map((astro) => (
                <AstrologerProfileCard key={astro._id} astrologer={astro} />
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

      {/* New Service Cards Section */}
      <section className="service-cards-section">
        <div className="section-header">
         
          <h2>Choose Your <span className="title-highlight">Preferred Service</span></h2>
          
        </div>

        <div className="service-cards-grid">
          {serviceCards.map((card, index) => (
            <ServiceCard key={index} {...card} />
          ))}
        </div>
      </section>

      <section className="ancient-wisdom">
        <div className="wisdom-container">
          <div className="wisdom-content">
            <div className="wisdom-badge">Vedic Heritage</div>
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
          <div className="wisdom-stats">
            <div className="stat-circle">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat-circle">
              <span className="stat-number">100+</span>
              <span className="stat-label">Expert Astrologers</span>
            </div>
            <div className="stat-circle">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Consultations</span>
            </div>
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
            <div className="feature-icon">
              <FiShield />
            </div>
            <h3 data-translate="confidential">100% Confidential</h3>
            <p data-translate="confidentialDesc">Your conversations are completely secure and private</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <FiAward />
            </div>
            <h3 data-translate="certifiedExperts">Certified Experts</h3>
            <p data-translate="certifiedDesc">All astrologers are certified in astrology</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <FiTrendingUp />
            </div>
            <h3 data-translate="affordable">Affordable Services</h3>
            <p data-translate="affordableDesc">Starting from just ₹15 per minute</p>
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="trust-badge-section">
        <div className="trust-badge-container">
          <div className="trust-badge-content">
            <div className="trust-icon">🕉️</div>
            <h3>Trusted by <span className="highlight">50,000+</span> Devotees Worldwide</h3>
            <p>Join our community of satisfied customers who have found answers and solutions through our expert astrologers</p>
            <div className="trust-stats">
              <div className="trust-stat">
                <span className="trust-num">4.9</span>
                <span className="trust-label">⭐ Rating</span>
              </div>
              <div className="trust-stat">
                <span className="trust-num">24/7</span>
                <span className="trust-label">Support</span>
              </div>
              <div className="trust-stat">
                <span className="trust-num">100%</span>
                <span className="trust-label">Secure</span>
              </div>
            </div>
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