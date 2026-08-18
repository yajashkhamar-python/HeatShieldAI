import { useNavigate } from "react-router-dom";
import {
  FaSatellite,
  FaBrain,
  FaLightbulb,
  FaMapMarkedAlt,
  FaFileDownload,
  FaArrowRight,
  FaShieldAlt,
  FaGlobeAmericas
} from "react-icons/fa";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaSatellite />,
      title: "Satellite Intelligence",
      desc: "High-resolution multi-spectral satellite imagery and land surface indicators (NDVI, NDBI, NDWI, LST).",
      theme: "cyan"
    },
    {
      icon: <FaBrain />,
      title: "AI Heat Prediction",
      desc: "Machine learning algorithms classifying urban heat risk levels across municipal ward zones.",
      theme: "orange"
    },
    {
      icon: <FaLightbulb />,
      title: "Smart Recommendations",
      desc: "Actionable priority guidance for urban tree canopy expansion, cool roofs, and surface water bodies.",
      theme: "emerald"
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Interactive Maps",
      desc: "Geospatial vector markers and satellite base layer maps for real-time risk inspection.",
      theme: "blue"
    },
    {
      icon: <FaFileDownload />,
      title: "Actionable Reports",
      desc: "Direct export of full-resolution GeoTIFF satellite layers for GIS integration and urban planning.",
      theme: "yellow"
    }
  ];

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-glow-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <FaShieldAlt className="hero-badge-icon" /> AI-Powered • Satellite-Based • Actionable Insights
          </div>

          <h1 className="hero-title">
            Building Cooler Cities with <span className="title-gradient">Satellite Intelligence</span>
          </h1>

          <p className="hero-subtitle">
            HeatShield AI uses satellite-derived environmental indicators and artificial intelligence to detect urban heat island hotspots, evaluate multi-spectral indices, and deliver tailored cooling strategies for modern cities.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary-glow"
              onClick={() => navigate("/dashboard")}
            >
              Start Analysis <FaArrowRight />
            </button>

            <button
              className="btn-secondary-dark"
              onClick={() => navigate("/heat-map")}
            >
              <FaGlobeAmericas /> Explore Heat Map
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="landing-features-section">
        <div className="section-title-box">
          <h2>Core Geospatial Platform Capabilities</h2>
          <p>Designed for urban planners, municipal authorities, and environmental researchers</p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className={`feature-card feature-${feature.theme}`}>
              <div className="feature-icon-badge">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
