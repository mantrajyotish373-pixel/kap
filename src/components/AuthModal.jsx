// src/components/AuthModal.jsx - COMPLETELY FIXED
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
import { RecaptchaVerifier, signInWithPhoneNumber, getIdToken } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL || "https://backend.kalpjyotish.com";

export default function AuthModal({ onClose, isLoggedIn, user }) {
  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
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

  // Setup reCAPTCHA
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

      auth.useDeviceLanguage();
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: (response) => {
            console.log("reCAPTCHA solved:", response);
            setIsVerified(true);
            setError("");
          },
          "expired-callback": () => {
            setIsVerified(false);
            setError("reCAPTCHA expired. Please verify again.");
            setupRecaptcha();
          },
        }
      );

      return window.recaptchaVerifier.render();
    } catch (err) {
      console.error("reCAPTCHA Init Error:", err);
      setError("Failed to load verification. Please refresh the page.");
    }
  };

  useEffect(() => {
    let timeoutId;
    if (step === "mobile") {
      timeoutId = setTimeout(() => {
        setupRecaptcha();
      }, 500);
    }

    return () => {
      clearTimeout(timeoutId);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
      setIsVerified(false);
    };
  }, [step]);

  useEffect(() => {
    const handleOnline = () => setError("");
    const handleOffline = () => setError("You are currently offline. Please check your internet connection.");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Send OTP
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
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier || !isVerified) {
        setError("Please verify the reCAPTCHA checkbox first.");
        setLoading(false);
        return;
      }

      const phoneNumber = `+91${mobile}`;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setMessage("OTP sent successfully! Please check your phone.");
      setStep("otp");
    } catch (err) {
      console.error("OTP ERROR:", err);
      setIsVerified(false);
      
      if (window.recaptchaVerifier) {
        setupRecaptcha();
      }

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

  // Register User
  const registerUser = async () => {
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    await sendOtp();
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

      const idToken = await getIdToken(firebaseUser, true);
      
      if (!idToken || !firebaseUser.uid || !firebaseUser.phoneNumber) {
        throw new Error("Missing required authentication data.");
      }

      const payload = {
        idToken: idToken,
        firebaseUid: firebaseUser.uid,
        phone: firebaseUser.phoneNumber,
        name: name || "",
      };

      try {
        const backendResp = await fetch(`${API_BASE_URL}/api/firebase/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await backendResp.json();

        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("authToken", data.data.token);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("authRole", "user");
          localStorage.setItem("userId", data.data.user._id || firebaseUser.uid);
          
          if (onClose && typeof onClose === 'function') {
            onClose();
          }
          navigate("/user-profile");
          return;
        }
      } catch (backendErr) {
        console.log("Backend error, using local session");
      }
      
      // Fallback local session
      const localUser = {
        _id: firebaseUser.uid,
        name: name || "User",
        phone: firebaseUser.phoneNumber,
      };
      localStorage.setItem("user", JSON.stringify(localUser));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authRole", "user");
      localStorage.setItem("userId", firebaseUser.uid);
      
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

  // FIXED: Google Login with proper onClose check
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      console.log("Google user:", firebaseUser);
      
      // Create user object
      const userData = {
        _id: firebaseUser.uid,
        name: firebaseUser.displayName || "Google User",
        email: firebaseUser.email || "",
        profileImage: firebaseUser.photoURL || "",
        authProvider: "google"
      };
      
      // Store in localStorage immediately
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authRole", "user");
      localStorage.setItem("userId", firebaseUser.uid);
      
      // Try to sync with backend (optional, don't block)
      try {
        const idToken = await getIdToken(firebaseUser, true);
        const payload = {
          idToken: idToken,
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "Google User",
          profile: firebaseUser.photoURL || "",
        };
        
        await fetch(`${API_BASE_URL}/api/firebase/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (backendErr) {
        console.log("Backend sync failed, but user is logged in locally");
      }
      
      // Close modal if onClose exists
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
      
      // Redirect to profile
      navigate("/user-profile");
      
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups for this site.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized. Please contact support.");
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
            <h3>Welcome to MantraJyotish</h3>
            <p>Discover your cosmic path with expert astrologers</p>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="auth-right">
          {error && (
            <div className="error-alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="success-alert">
              <span>✓</span>
              <span>{message}</span>
            </div>
          )}

          <div id="recaptcha-container" className="recaptcha-box" style={{ display: step === "mobile" ? "flex" : "none" }}></div>

          {step === "mobile" && (
            <>
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Enter your mobile number to continue</p>
              </div>

              <div className="input-group">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  maxLength="10"
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, ""));
                    setError("");
                    setIsVerified(false);
                  }}
                />
              </div>

              <button
                disabled={mobile.length !== 10 || loading || !isVerified}
                onClick={sendOtp}
                className="primary-btn"
              >
                {loading ? "Sending..." : "Continue"}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </button>

              <button className="astrologer-btn" onClick={handleAstrologerLogin}>
                <span>Login as Astrologer</span>
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="auth-header">
                <h3>Verify OTP</h3>
                <p>Enter the 6-digit code sent to {mobile}</p>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength="6"
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                />
              </div>

              <button
                disabled={otp.length !== 6 || loading}
                onClick={verifyOtp}
                className="primary-btn"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <div className="otp-actions">
                <button className="back-btn" onClick={() => {
                  setStep("mobile");
                  setOtp("");
                  setMessage("");
                  setError("");
                  setIsVerified(false);
                }}>
                  ← Change Number
                </button>
                <button className="resend-btn" onClick={sendOtp} disabled={loading}>
                  Resend OTP
                </button>
              </div>
            </>
          )}

          {step === "register" && (
            <>
              <div className="auth-header">
                <h3>Create Account</h3>
                <p>Please enter your details to register</p>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                />
              </div>

              <div className="input-group">
                <input type="tel" value={mobile} disabled />
              </div>

              <button
                disabled={!name.trim() || loading}
                onClick={registerUser}
                className="primary-btn"
              >
                {loading ? "Sending..." : "Register & Continue"}
              </button>

              <button className="back-btn" onClick={() => {
                setStep("mobile");
                setName("");
                setError("");
                setMessage("");
              }}>
                ← Back
              </button>
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