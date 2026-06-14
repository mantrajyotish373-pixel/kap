// src/components/Testimonials.jsx - UPDATED
import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import './Testimonials.css';

const testimonialsData = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    testimonial: "The astrological guidance I received was incredibly accurate. It helped me make important life decisions with confidence. The astrologer was very patient and explained everything in detail.",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, India",
    rating: 5,
    testimonial: "Excellent service! The astrologer was very knowledgeable and provided remedies that actually worked. My career has improved significantly since following the guidance.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Sneha Patel",
    location: "Bangalore, India",
    rating: 4,
    testimonial: "Very professional and insightful. The predictions were spot on and the remedies suggested were very helpful. Will definitely recommend to friends and family.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 4,
    name: "Amit Mehta",
    location: "Ahmedabad, India",
    rating: 5,
    testimonial: "One of the best astrology platforms I've used. The experts are genuine and the consultation was very affordable. Got clarity on my business decisions.",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const activeTestimonial = testimonialsData[activeIndex];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        style={{ color: i < rating ? '#FFD700' : '#E8DCD0' }}
      />
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-bg">
        <div className="testimonials-nebula"></div>
        <div className="testimonials-stars">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className="testimonials-container">
        <div className="testimonials-header">
          <div className="header-badge">
            <FaStar />
            <span>TESTIMONIALS</span>
          </div>
          <h2 className="testimonials-title">
            What Our <span className="title-shine">Devotees Say</span>
          </h2>
          <p className="testimonials-subtitle">
            Real stories from people who found guidance through our services
          </p>
        </div>

        <div className="testimonial-wrapper">
          <button className="testimonial-nav prev" onClick={handlePrev}>
            <FaChevronLeft />
          </button>

          <div className="testimonial-card">
            <div className="testimonial-profile">
              <img 
                src={activeTestimonial.image} 
                alt={activeTestimonial.name}
                className="testimonial-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeTestimonial.name)}&background=FF6B6B&color=fff&bold=true&size=100`;
                }}
              />
            </div>
            
            <div className="testimonial-rating">
              {renderStars(activeTestimonial.rating)}
            </div>
            
            <p className="testimonial-text">
              <FaQuoteLeft className="quote-icon" />
              {activeTestimonial.testimonial}
            </p>
            
            <h3 className="testimonial-name">{activeTestimonial.name}</h3>
            <p className="testimonial-location">
              <FaMapMarkerAlt size={12} /> {activeTestimonial.location}
            </p>
          </div>

          <button className="testimonial-nav next" onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(idx);
                setIsAutoPlaying(false);
              }}
            />
          ))}
        </div>

        <div className="trust-badge">
          <div className="trust-icon">⭐</div>
          <div className="trust-text">
            <strong>4.9 Rating · 50,000+ Reviews</strong>
            <span>Trusted by devotees worldwide</span>
          </div>
          <FaShieldAlt style={{ color: '#FF6B6B', opacity: 0.5 }} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;