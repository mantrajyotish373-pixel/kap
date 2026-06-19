// src/components/PoojaSection.jsx

import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./PoojaSection.css";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPoojasQuery } from "../services/backendApi";

const PoojaSection = () => {
  const [poojas, setPoojas] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const { data: poojaArray = [], isLoading: loading, isError } = useGetPoojasQuery();

  // ✅ URL BASED STATE
  const [searchParams, setSearchParams] = useSearchParams();
  const showSection = searchParams.get("show") === "all";

  useEffect(() => {
    if (!Array.isArray(poojaArray)) return;
    const groupedPoojas = poojaArray.reduce((acc, pooja) => {
      const category = pooja.category || "All Poojas";
      if (!acc[category]) acc[category] = [];
      acc[category].push(pooja);
      return acc;
    }, {});

    setPoojas(groupedPoojas);
    const foundCategories = Object.keys(groupedPoojas);
    setCategories(foundCategories);
    if (!activeTab && foundCategories.length > 0) {
      setActiveTab(foundCategories[0]);
    }
  }, [poojaArray, activeTab]);

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
    exit: { opacity: 0, y: -30, scale: 0.98 },
  };

  if (isError) {
    return (
      <div className="pooja-section">
        <p className="error-message">
          Failed to load Pooja services. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ INTRO SCREEN */}
      {!showSection && (
        <div
          className="container-pooja"
          style={{
            display: "flex",
            width: "full",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            marginTop: "20px",
            backgroundColor: "#000000"
          }}
        >
          <div style={
            {
              textAlign: "center",
              height: "400px",
              width: "400px",
              padding: "15px",
            }
          }>
            <img
              src="/src/assets/navGarahPujan.webp"
              alt="NAVGRAH PUJAN"
              style={{ height: "300px", width: "300px" }}
            />

            <button
              onClick={() => setSearchParams({ show: "all" })}
              style={{
                padding: "10px 20px",
                background: "#ff9800",
                color: "#fff",
                marginTop: "20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              NAVGRAH PUJAN
            </button>
          </div>
        </div>
      )}

      {/* ✅ POOJA GRID */}
      {showSection && (
        <section className="pooja-section">
          <h2 className="pooja-main-title">Online Pooja Services</h2>
          <p className="pooja-subtitle">
            Book online Poojas with our expert Pandits and find spiritual solace.
          </p>

          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              {categories.length > 0 && (
                <div className="tabs-container">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`tab-button ${activeTab === category ? "active" : ""
                        }`}
                      onClick={() => setActiveTab(category)}
                    >
                      {category}
                      {activeTab === category && (
                        <motion.div
                          className="active-tab-underline"
                          layoutId="active-underline"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Grid */}
              <motion.div
                className="pooja-grid"
                key={activeTab}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {poojas[activeTab]?.map((pooja) => (
                    <motion.div
                      key={pooja._id}
                      className="pooja-card"
                      variants={cardVariants}
                      whileHover={{
                        y: -8,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
                      }}
                    >
                      <div className="pooja-image-container">
                        <img
                          src={pooja.image}
                          alt={pooja.name}
                          className="pooja-image"
                        />
                        <div className="pooja-image-overlay"></div>
                      </div>

                      <div className="pooja-content">
                        <h3 className="pooja-name">{pooja.name}</h3>
                        <p className="pooja-description">
                          {pooja.description?.split("\n")[0]}
                        </p>

                        <Link
                          to={`/pooja/${pooja._id}`}
                          className="pooja-details-button"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </section>
      )}
      <Footer />
    </>
  );
};

export default PoojaSection;
