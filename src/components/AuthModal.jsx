// src/components/AuthModal.jsx - COMPLETELY FIXED (NO CAPTCHA)
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { MdPhone, MdLock, MdPerson, MdVerified, MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import authImage from "../assets/authImage.jpg";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "./AuthModal.css";

// Firebase imports
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL || "https://backend.kalpjyotish.com";

export default function AuthModal({ onClose, isLoggedIn, user }) {
  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
      navigate("/user-profile");
    }
  }, [isLoggedIn, user, navigate, onClose]);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Setup reCAPTCHA (invisible)
  const setupRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }

      const container = document.getElementById("recaptcha-container");
      if (container) container.innerHTML = "";

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
          },
        }
      );

      return window.recaptchaVerifier;
    } catch (err) {
      console.error("reCAPTCHA Init Error:", err);
      return null;
    }
  };

  useEffect(() => {
    if (step === "mobile") {
      setTimeout(() => {
        setupRecaptcha();
      }, 300);
    }
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, [step]);

  // Send OTP (NO VISIBLE CAPTCHA)
  const sendOtp = async () => {
    if (!navigator.onLine) {
      setError("No internet connection. Please check your network.");
      return;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const appVerifier = setupRecaptcha();
      if (!appVerifier) {
        setError("Verification setup failed. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const phoneNumber = `+91${mobile}`;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setMessage("OTP sent successfully! Please check your phone.");
      setTimer(60);
      setStep("otp");
    } catch (err) {
      console.error("OTP ERROR:", err);
      
      if (err.code === "auth/invalid-app-credential") {
        setError("Authentication error. Please refresh the page and try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again after some time.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await window.confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      if (!firebaseUser || !firebaseUser.uid || !firebaseUser.phoneNumber) {
        throw new Error("Missing required authentication data.");
      }

      // Prepare user data
      const userData = {
        _id: firebaseUser.uid,
        name: name || "User",
        phone: firebaseUser.phoneNumber,
        authProvider: "phone"
      };

      // Store locally
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authRole", "user");
      localStorage.setItem("userId", firebaseUser.uid);

      // Try to sync with backend
      try {
        const idToken = await firebaseUser.getIdToken(true);
        const payload = {
          idToken: idToken,
          firebaseUid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          name: name || "",
        };

        const response = await fetch(`${API_BASE_URL}/api/firebase/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("authToken", data.data.token);
          localStorage.setItem("userId", data.data.user._id || firebaseUser.uid);
        }
      } catch (backendErr) {
        console.log("Backend sync skipped, using local session");
      }

      if (onClose && typeof onClose === 'function') {
        onClose();
      }
      navigate("/user-profile");

    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      console.log("Google user:", firebaseUser);
      
      const userData = {
        _id: firebaseUser.uid,
        name: firebaseUser.displayName || "Google User",
        email: firebaseUser.email || "",
        profileImage: firebaseUser.photoURL || "",
        authProvider: "google"
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authRole", "user");
      localStorage.setItem("userId", firebaseUser.uid);

      // Try backend sync
      try {
        const idToken = await firebaseUser.getIdToken(true);
        const payload = {
          idToken: idToken,
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "Google User",
          profile: firebaseUser.photoURL || "",
        };
        
        const response = await fetch(`${API_BASE_URL}/api/firebase/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("authToken", data.data.token);
          localStorage.setItem("userId", data.data.user._id || firebaseUser.uid);
        }
      } catch (backendErr) {
        console.log("Backend sync skipped, using local session");
      }
      
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
      navigate("/user-profile");
      
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups for this site.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAstrologerLogin = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
    navigate("/astrologer-login");
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("auth-backdrop")) {
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    }
  };

  return (
    <div className="auth-backdrop" onClick={handleBackdropClick}>
      <motion.div
        className="auth-modal"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close" onClick={() => {
          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        }}>
          <IoClose />
        </button>

        {/* LEFT SIDE - Image */}
        <div className="auth-left">
          <div className="auth-left-overlay"></div>
          <img src={authImage} alt="Authentication" />
          <div className="auth-left-text">
            <div className="left-star">⭐</div>
            <h3>Welcome to MantraJyotish</h3>
            <p>Discover your cosmic path with expert astrologers</p>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="auth-right">
          {/* Hidden reCAPTCHA container */}
          <div id="recaptcha-container" style={{ display: 'none' }}></div>

          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="success-alert">
              <span className="success-icon">✓</span>
              <span>{message}</span>
            </div>
          )}

          {step === "mobile" && (
            <>
              <div className="auth-header">
                <div className="header-icon">
                  <MdPhone />
                </div>
                <h2>Welcome Back</h2>
                <p className="subtitle">Enter your mobile number to continue</p>
              </div>

              <div className="input-group">
                <div className="input-icon-wrapper">
                  <span className="input-icon">+91</span>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobile}
                    maxLength="10"
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, ""));
                      setError("");
                    }}
                  />
                </div>
              </div>

              <button
                disabled={mobile.length !== 10 || loading}
                onClick={sendOtp}
                className="primary-btn"
              >
                {loading ? (
                  <>
                    <span className="btn-loader"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Continue <MdArrowForward />
                  </>
                )}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </button>

              <button className="astrologer-btn" onClick={handleAstrologerLogin}>
                <span>🔮 Login as Astrologer</span>
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="auth-header">
                <div className="header-icon">
                  <MdVerified />
                </div>
                <h3>Verify OTP</h3>
                <p className="subtitle">Enter the 6-digit code sent to <strong>+91{mobile}</strong></p>
              </div>

              <div className="input-group">
                <div className="input-icon-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    maxLength="6"
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && otp.length === 6) {
                        verifyOtp();
                      }
                    }}
                  />
                </div>
              </div>

              <button
                disabled={otp.length !== 6 || loading}
                onClick={verifyOtp}
                className="primary-btn"
              >
                {loading ? (
                  <>
                    <span className="btn-loader"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login <MdVerified />
                  </>
                )}
              </button>

              <div className="otp-actions">
                <button className="back-btn" onClick={() => {
                  setStep("mobile");
                  setOtp("");
                  setMessage("");
                  setError("");
                  setTimer(0);
                }}>
                  ← Change Number
                </button>
                <button 
                  className="resend-btn" 
                  onClick={() => {
                    setTimer(0);
                    sendOtp();
                  }} 
                  disabled={loading || timer > 0}
                >
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          )}

          <div className="auth-footer">
            <p>By continuing, you agree to our <a href="/terms">Terms</a> & <a href="/privacy-policy">Privacy Policy</a></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}