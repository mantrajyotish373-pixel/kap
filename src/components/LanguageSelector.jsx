// src/components/LanguageSelector.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
];

const translations = {
  en: {
    welcome: "Welcome to Mantra Jyotish",
    subtitle: "Connect with Vedic Experts",
    description: "Talk to certified astrologers for answers to love, career, wealth, and all life's questions",
    connect: "Connect with Experts",
    freeKundli: "Free Kundli",
    vedicExperts: "Vedic Experts",
    certified: "100+ Certified Astrologers",
    support: "24/7 Support",
    private: "100% Private",
    ourExperts: "Our Experts",
    consultation: "Consultation Process",
    choose: "Choose an Astrologer",
    select: "Select Service",
    ask: "Ask & Get Solutions",
  },
  hi: {
    welcome: "मंत्र ज्योतिष में आपका स्वागत है",
    subtitle: "वैदिक विशेषज्ञों से जुड़ें",
    description: "प्रेम, करियर, धन और जीवन के हर सवाल के जवाब के लिए प्रमाणित ज्योतिषियों से बात करें",
    connect: "विशेषज्ञों से जुड़ें",
    freeKundli: "मुफ्त कुंडली",
    vedicExperts: "वैदिक विशेषज्ञ",
    certified: "100+ प्रमाणित ज्योतिषी",
    support: "24x7 सहायता",
    private: "100% निजी",
    ourExperts: "हमारे विशेषज्ञ",
    consultation: "परामर्श प्रक्रिया",
    choose: "ज्योतिषी चुनें",
    select: "सेवा चुनें",
    ask: "पूछें और समाधान पाएं",
  },
  te: {
    welcome: "మంత్ర జ్యోతిష్కి స్వాగతం",
    subtitle: "వేద నిపుణులతో కనెక్ట్ అవ్వండి",
    description: "ప్రేమ, కెరీర్, సంపద మరియు జీవితంలోని ప్రతి ప్రశ్నకు సమాధానాల కోసం సర్టిఫైడ్ జ్యోతిష్కులతో మాట్లాడండి",
    connect: "నిపుణులతో కనెక్ట్ అవ్వండి",
    freeKundli: "ఉచిత కుండలి",
    vedicExperts: "వేద నిపుణులు",
    certified: "100+ సర్టిఫైడ్ జ్యోతిష్కులు",
    support: "24/7 మద్దతు",
    private: "100% ప్రైవేట్",
    ourExperts: "మా నిపుణులు",
    consultation: "సంప్రదింపుల ప్రక్రియ",
    choose: "జ్యోతిష్కుని ఎంచుకోండి",
    select: "సేవను ఎంచుకోండి",
    ask: "అడగండి & పరిష్కారాలు పొందండి",
  },
  ta: {
    welcome: "மந்த்ர ஜோதிஷிற்கு வரவேற்கிறோம்",
    subtitle: "வேத நிபுணர்களுடன் இணையுங்கள்",
    description: "காதல், தொழில், செல்வம் மற்றும் வாழ்க்கையின் ஒவ்வொரு கேள்விக்கும் பதில்களுக்கு சான்றளிக்கப்பட்ட ஜோதிடர்களுடன் பேசுங்கள்",
    connect: "நிபுணர்களுடன் இணையுங்கள்",
    freeKundli: "இலவச குண்டலி",
    vedicExperts: "வேத நிபுணர்கள்",
    certified: "100+ சான்றளிக்கப்பட்ட ஜோதிடர்கள்",
    support: "24/7 ஆதரவு",
    private: "100% தனிப்பட்ட",
    ourExperts: "எங்கள் நிபுணர்கள்",
    consultation: "ஆலோசனை செயல்முறை",
    choose: "ஜோதிடரைத் தேர்ந்தெடுக்கவும்",
    select: "சேவையைத் தேர்ந்தெடுக்கவும்",
    ask: "கேளுங்கள் & தீர்வுகளைப் பெறுங்கள்",
  },
  ml: {
    welcome: "മന്ത്ര ജ്യോതിഷിലേക്ക് സ്വാഗതം",
    subtitle: "വേദ വിദഗ്ധരുമായി ബന്ധപ്പെടുക",
    description: "പ്രണയം, കരിയർ, സമ്പത്ത്, ജീവിതത്തിലെ എല്ലാ ചോദ്യങ്ങൾക്കും ഉത്തരം ലഭിക്കാൻ സർട്ടിഫൈഡ് ജ്യോതിഷികളോട് സംസാരിക്കുക",
    connect: "വിദഗ്ധരുമായി ബന്ധപ്പെടുക",
    freeKundli: "സൗജന്യ കുണ്ഡലി",
    vedicExperts: "വേദ വിദഗ്ധർ",
    certified: "100+ സർട്ടിഫൈഡ് ജ്യോതിഷികൾ",
    support: "24/7 പിന്തുണ",
    private: "100% സ്വകാര്യം",
    ourExperts: "ഞങ്ങളുടെ വിദഗ്ധർ",
    consultation: "കൺസൾട്ടേഷൻ പ്രക്രിയ",
    choose: "ജ്യോതിഷിയെ തിരഞ്ഞെടുക്കുക",
    select: "സേവനം തിരഞ്ഞെടുക്കുക",
    ask: "ചോദിക്കുക & പരിഹാരങ്ങൾ നേടുക",
  },
};

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred_language");
    const hasSeenPopup = localStorage.getItem("has_seen_language_popup");

    if (!hasSeenPopup) {
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    } else if (savedLanguage && savedLanguage !== "en") {
      setCurrentLang(savedLanguage);
      applyTranslation(savedLanguage);
    }
  }, []);

  const applyTranslation = (langCode) => {
    setCurrentLang(langCode);
    const t = translations[langCode];
    
    // Update all elements with data-translate attributes
    document.querySelectorAll("[data-translate-key]").forEach((element) => {
      const key = element.getAttribute("data-translate-key");
      if (t[key]) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = t[key];
        } else {
          element.textContent = t[key];
        }
      }
    });
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: langCode, translations: t } }));
  };

  const handleLanguageSelect = (langCode) => {
    setIsOpen(false);
    localStorage.setItem("preferred_language", langCode);
    localStorage.setItem("has_seen_language_popup", "true");
    
    if (langCode === "en") {
      window.location.reload();
    } else {
      applyTranslation(langCode);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("has_seen_language_popup", "true");
  };

  return (
    <>
      {/* Floating Language Button */}
      <button
        className="floating-lang-btn"
        onClick={() => setIsOpen(true)}
      >
        🌐 {currentLang.toUpperCase()}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="language-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="language-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={handleClose}>×</button>
              
              <div className="modal-header">
                <div className="modal-icon">🌐</div>
                <h2>Choose Your Language</h2>
                <p>अपनी भाषा चुनें | మీ భాషను ఎంచుకోండి</p>
              </div>

              <div className="language-grid">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    className={`language-option ${currentLang === lang.code ? "selected" : ""}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-name">{lang.name}</span>
                    {currentLang === lang.code && <span className="lang-check">✓</span>}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LanguageSelector;