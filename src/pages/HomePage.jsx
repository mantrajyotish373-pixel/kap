// src/pages/HomePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetAstrologersQuery } from '../services/backendApi';

// Import your images
import logo from '../assets/logo.jpeg';

// Import icons
import { 
  FiArrowRight, 
  FiStar, 
  FiSun, 
  FiMessageCircle,
  FiShield,
  FiAward,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiPhone,
  FiVideo,
  FiMapPin
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
              <span>Trusted by 50,000+ Devotees</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="hero-title-main">
                Connect with <span className="hero-title-highlight">Vedic Experts</span>
              </span>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
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
                <span>Connect with Experts</span>
                <FiArrowRight />
              </button>
              <Link to="/horoscope" className="cta-btn secondary">
                <FiSun />
                <span>Free Kundli</span>
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
                  <h4>Vedic Experts</h4>
                  <p>100+ Certified Astrologers</p>
                </div>
              </div>
              <div className="feature-divider"></div>
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                <div className="feature-text">
                  <h4>24/7 Support</h4>
                  <p>Anytime Consultation</p>
                </div>
              </div>
              <div className="feature-divider"></div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">
                  <h4>100% Private</h4>
                  <p>Secure & Confidential</p>
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
            <span>Our Experts</span>
          </div>
          <h2>Our <span className="title-highlight">Astrologers</span></h2>
          <p className="section-description">Connect with our certified experts having decades of experience in Vedic astrology</p>
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
                View All Astrologers <FiChevronRight />
              </button>
            </div>
          </>
        )}
      </section>

      <section className="how-it-works">
        <div className="section-header">
          <h2>Consultation Process</h2>
          <p>Simple, fast, and effective — solutions in three easy steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Choose an Astrologer</h3>
            <p>Select based on expertise and experience</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Select Service</h3>
            <p>Chat, Call, or Video Call - as you prefer</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Ask & Get Solutions</h3>
            <p>Connect instantly and receive guidance</p>
          </div>
        </div>
      </section>

      <section className="ancient-wisdom">
        <div className="wisdom-container">
          <div className="wisdom-content">
            <h2>Ancient Tradition of Vedic Astrology</h2>
            <p>At Mantra Jyotish, we follow ancient Vedic texts and rich traditions of Indian astrology. Our astrologers are proficient in astrology knowledge passed down through generations.</p>
            <div className="wisdom-features">
              <div className="wisdom-item">
                <FiCheckCircle />
                <span>Authentic Astrology Calculations</span>
              </div>
              <div className="wisdom-item">
                <FiCheckCircle />
                <span>Panchang & Muhurta Considerations</span>
              </div>
              <div className="wisdom-item">
                <FiCheckCircle />
                <span>Birth Chart Analysis</span>
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
          <h2>Why Choose Mantra Jyotish?</h2>
          <p>We make astrology simple, accessible, and effective</p>
        </div>
        <div className="features-grid">
          <div className="feature">
            <FiShield />
            <h3>100% Confidential</h3>
            <p>Your conversations are completely secure and private</p>
          </div>
          <div className="feature">
            <FiAward />
            <h3>Certified Experts</h3>
            <p>All astrologers are certified in astrology</p>
          </div>
          <div className="feature">
            <FiTrendingUp />
            <h3>Affordable Services</h3>
            <p>Starting from just ₹15 per minute</p>
          </div>
        </div>
      </section>

      <ServicesSection />
      <DailyInsights />
      <ConsultationTopics />
      <NakshatrasSection />
      <Testimonials />
      <BlogSection />
      <Footer />
    </>
  );
};

export default HomePage;