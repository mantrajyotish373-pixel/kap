// src/components/AuthModal.jsx - FIXED Google Login
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { MdPhone, MdLock, MdPerson, MdVerified, MdArrowForward, MdStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import authImage from "../assets/authImage.jpg";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "./AuthModal.css";

// Firebase imports
import { RecaptchaVerifier, signInWithPhoneNumber, getIdToken } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend.kalpjyotish.com";

export default function AuthModal({ onClose, isLoggedIn, user }) {
  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      onClose();
      navigate("/user-profile");
    }
  }, [isLoggedIn, user, navigate, onClose]);

  // Setup reCAPTCHA
  const setupRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
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
            setupRecaptcha();
          },
        },
      );

      return window.recaptchaVerifier.render();
    } catch (err) {
      console.error("reCAPTCHA Init Error:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === "mobile") {
        setupRecaptcha();
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) { }
        window.recaptchaVerifier = null;
      }
      setIsVerified(false);
    };
  }, [step]);

  useEffect(() => {
    const handleOnline = () => setError("");
    const handleOffline = () => setError("You are currently offline.");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) { }
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
      setError("Please enter a valid 10-digit number.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier || !isVerified) {
        setError("Please verify the reCAPTCHA checkbox first.");
        return;
      }

      const phoneNumber = `+91${mobile}`;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier,
      );

      window.confirmationResult = confirmationResult;
      setMessage("OTP sent successfully!");
      setStep("otp");
    } catch (err) {
      console.error("OTP ERROR:", err);
      setIsVerified(false);
      if (window.recaptchaVerifier) {
        setupRecaptcha();
      }

      if (err.code === "auth/invalid-app-credential" || err.message?.includes("INVALID_APP_CREDENTIAL")) {
        setError("Authentication Error: Please ensure 'localhost' is added to 'Authorized Domains' in Firebase Console.");
      } else if (err.message?.includes("already-rendered")) {
        setError("Connection lag. Please try clicking once more.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "Failed to send OTP. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Register User
  const registerUser = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    await sendOtp();
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);

      const result = await window.confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      const idToken = await getIdToken(firebaseUser, true);
      console.log("ID Token length:", idToken?.length);

      if (!idToken || !firebaseUser.uid || !firebaseUser.phoneNumber) {
        throw new Error("Missing required Firebase fields.");
      }

      const payload = {
        idToken: idToken,
        firebaseUid: firebaseUser.uid,
        phone: firebaseUser.phoneNumber,
      };

      const backendResp = await fetch(`${API_BASE_URL}/api/firebase/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await backendResp.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authRole", "user");

      onClose();
      navigate("/user-profile");
    } catch (err) {
      console.error(err);
      setError("OTP verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Google Login - Works without backend or handles error gracefully
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Create user object from Firebase data
      const sessionUser = {
        _id: firebaseUser.uid,
        name: firebaseUser.displayName || "Google User",
        email: firebaseUser.email || "",
        profileImage: firebaseUser.photoURL || "",
        authProvider: "google"
      };

      // Save to localStorage immediately (so user is logged in)
      localStorage.setItem("user", JSON.stringify(sessionUser));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authRole", "user");
      localStorage.setItem("userId", firebaseUser.uid);

      // Try to sync with backend - but don't block login if it fails
      try {
        const idToken = await getIdToken(firebaseUser, true);
        const payload = {
          idToken: idToken,
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "Google User",
          profile: firebaseUser.photoURL || "",
        };

        const backendResp = await fetch(`${API_BASE_URL}/api/firebase/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (backendResp.ok) {
          const data = await backendResp.json();
          if (data.success && data.data?.user) {
            // Update with backend user data
            localStorage.setItem("user", JSON.stringify(data.data.user));
            if (data.data.token) {
              localStorage.setItem("authToken", data.data.token);
            }
          }
        }
      } catch (backendErr) {
        // Backend sync failed but user is still logged in with Firebase
        console.log("Backend sync optional - continuing with Firebase session");
      }

      onClose();
      navigate("/user-profile");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAstrologerLogin = () => {
    onClose();
    navigate("/astrologer-login");
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("auth-backdrop")) {
      onClose();
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
        {/* Cosmic Background Effect */}
        <div className="auth-cosmic-bg">
          <div className="auth-star"></div>
          <div className="auth-star"></div>
          <div className="auth-star"></div>
          <div className="auth-star"></div>
        </div>

        <button className="auth-close" onClick={onClose}>
          <IoClose />
        </button>

        {/* LEFT SIDE - Image */}
        <div className="auth-left">
          <div className="auth-left-overlay"></div>
          <img src={authImage} alt="Authentication" />
          <div className="auth-left-text">
            <MdStar className="left-star" />
            <h3>Welcome to KalpJyotish</h3>
            <p>Discover your cosmic path with expert astrologers</p>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="auth-right">
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

          <div id="recaptcha-container" className="recaptcha-box" style={{ display: step === "mobile" ? "flex" : "none" }}></div>

          {step === "mobile" && (
            <>
              <div className="auth-header">
                <div className="header-icon">
                  <MdPhone />
                </div>
                <h2>Welcome Back</h2>
                <p className="subtitle">Enter your mobile number to continue your cosmic journey</p>
              </div>

              <div className="input-group">
                <div className="input-icon-wrapper">
                  <MdPhone className="input-icon" />
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
              </div>

              <button
                disabled={mobile.length !== 10 || loading || !isVerified}
                onClick={sendOtp}
                className="primary-btn"
              >
                {loading ? (
                  <div className="btn-loader"></div>
                ) : (
                  <>
                    Continue <MdArrowForward />
                  </>
                )}
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              <button className="google-btn" onClick={handleGoogleLogin}>
                <FcGoogle size={22} />
                <span>Continue with Google</span>
              </button>

              <button className="astrologer-btn" onClick={handleAstrologerLogin}>
                <MdStar />
                <span>Login as Astrologer</span>
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="auth-header">
                <div className="header-icon">
                  <MdLock />
                </div>
                <h3>Verify OTP</h3>
                <p className="subtitle">Enter the 6-digit code sent to <strong>{mobile}</strong></p>
              </div>

              <div className="input-group">
                <div className="input-icon-wrapper">
                  <MdLock className="input-icon" />
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
              </div>

              <div className="otp-inputs">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`otp-digit ${otp[i] ? "filled" : ""}`}>
                    {otp[i] || ""}
                  </div>
                ))}
              </div>

              <button
                disabled={otp.length !== 6 || loading}
                onClick={verifyOtp}
                className="primary-btn"
              >
                {loading ? (
                  <div className="btn-loader"></div>
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
                }}>
                  ← Change Number
                </button>
                <button className="resend-btn" onClick={sendOtp}>
                  Resend OTP
                </button>
              </div>
            </>
          )}

          {step === "register" && (
            <>
              <div className="auth-header">
                <div className="header-icon">
                  <MdPerson />
                </div>
                <h3>Create Account</h3>
                <p className="subtitle">Please enter your details to register</p>
              </div>

              <div className="input-group">
                <div className="input-icon-wrapper">
                  <MdPerson className="input-icon" />
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
              </div>

              <div className="input-group">
                <div className="input-icon-wrapper">
                  <MdPhone className="input-icon" />
                  <input type="tel" value={mobile} disabled className="disabled-input" />
                </div>
              </div>

              <button
                disabled={!name.trim() || loading}
                onClick={registerUser}
                className="primary-btn"
              >
                {loading ? (
                  <div className="btn-loader"></div>
                ) : (
                  <>
                    Register & Continue <MdArrowForward />
                  </>
                )}
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