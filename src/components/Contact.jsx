// src/pages/Contact.jsx - FIXED AND RESPONSIVE
import React, { useState } from "react";
import { FiArrowRight, FiLoader, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import "./Contact.css";
import { useSendContactQueryMutation } from "../services/backendApi";

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const toastClass = type === "success" ? "toast-success" : "toast-error";
  const Icon = type === "success" ? FiCheckCircle : FiXCircle;
  return (
    <motion.div
      className={`toast-notification ${toastClass}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close-btn">&times;</button>
    </motion.div>
  );
};

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    tob: "",
    pob: "",
    query: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [sendContactQuery] = useSendContactQueryMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    try {
      const data = await sendContactQuery({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        gender: formData.gender,
        dob_time: `${formData.dob} ${formData.tob}`,
        place_of_birth: formData.pob,
        query: formData.query,
      }).unwrap();

      if (data?.success) {
        setToast({ message: "Thank you! Your query has been submitted successfully.", type: "success" });

        setFormData({
          name: "",
          email: "",
          mobile: "",
          gender: "",
          dob: "",
          tob: "",
          pob: "",
          query: "",
        });
      } else {
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (error) {
      setToast({ message: error?.data?.message || "Something went wrong. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <div className="landing-page-wrapper">
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <section className="contact-form-section">
        <div className="contact-container">
          {/* LEFT SIDE - FORM */}
          <div className="contact-left">
            <h2 className="contact-title">Let's Connect</h2>

            <motion.div
              className="contact-form-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="contact-form-actual">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input 
                    type="tel" 
                    id="mobile" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleChange} 
                    placeholder="+91 1234567890" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="dob-time">
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tob">Time of Birth</label>
                    <input type="time" id="tob" name="tob" value={formData.tob} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pob">Place of Birth</label>
                  <input 
                    type="text" 
                    id="pob" 
                    name="pob" 
                    value={formData.pob} 
                    onChange={handleChange} 
                    placeholder="e.g., New Delhi, India" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="query">Your Query</label>
                  <textarea 
                    id="query" 
                    name="query" 
                    value={formData.query} 
                    onChange={handleChange} 
                    rows="4" 
                    placeholder="Tell us about your cosmic question..." 
                    required
                  ></textarea>
                </div>

                <div className="form-card-footer">
                  <button
                    type="submit"
                    className="submit-query-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="loader-icon" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Query <FiArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* RIGHT SIDE - CONTACT INFO */}
          <motion.div 
            className="contact-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="contact-info-title">Get in Touch</h2>

            <div className="contact-info">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <h4>Email Us</h4>
                  <p>info@digitalinapp.in<br />app@digitalinapp.in</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 7419064919<br />+91 7456804919</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">⏰</span>
                <div>
                  <h4>Office Hours</h4>
                  <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h4>Our Address</h4>
                  <p>3rd Floor, Ashoka Apartment, THDC Colony</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;