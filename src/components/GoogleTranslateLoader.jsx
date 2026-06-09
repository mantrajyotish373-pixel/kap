// src/components/GoogleTranslateLoader.jsx
import { useEffect } from "react";

const GoogleTranslateLoader = () => {
  useEffect(() => {
    // Initialize Google Translate
    const initializeGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "hi,en,te,ta,ml,kn,bn,gu,mr,pa,or,ur",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Load Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.id = "google-translate-script";
    
    window.googleTranslateElementInit = initializeGoogleTranslate;
    document.body.appendChild(script);

    // Hide Google Translate banner
    const hideBanner = setInterval(() => {
      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner) {
        banner.style.display = "none";
        banner.style.visibility = "hidden";
      }
      document.body.style.top = "0px";
      document.body.style.position = "static";
      
      // Also hide the translate bar
      const translateBar = document.querySelector(".goog-te-gadget-simple");
      if (translateBar) {
        translateBar.style.display = "none";
      }
    }, 100);

    return () => {
      clearInterval(hideBanner);
      const scriptElement = document.getElementById("google-translate-script");
      if (scriptElement) scriptElement.remove();
    };
  }, []);

  return null;
};

export default GoogleTranslateLoader;