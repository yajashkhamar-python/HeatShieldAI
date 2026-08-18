import { FaMoon, FaMap, FaServer, FaShieldAlt } from "react-icons/fa";
import "./SettingsPage.css";

export default function SettingsPage({ shellContext }) {
  const { cities, error } = shellContext;

  const isConnected = !error && cities && cities.length > 0;

  return (
    <div className="settings-page-layout">
      <div className="settings-header">
        <h2>Platform Configuration & Preferences</h2>
        <p>Appearance settings, geospatial tile preferences, and system diagnostic status</p>
      </div>

      <div className="settings-sections-grid">
        {/* Appearance Settings */}
        <div className="settings-panel-card">
          <div className="settings-card-title">
            <FaMoon className="settings-icon emerald" />
            <div>
              <h3>Appearance & Theme</h3>
              <p>Visual theme and interface settings</p>
            </div>
          </div>
          <div className="settings-options-list">
            <div className="setting-row">
              <div>
                <strong>Theme Mode</strong>
                <p>Commercial Geospatial Dark Navy Theme</p>
              </div>
              <span className="setting-active-tag">Active Dark</span>
            </div>
          </div>
        </div>

        {/* Map Preferences */}
        <div className="settings-panel-card">
          <div className="settings-card-title">
            <FaMap className="settings-icon cyan" />
            <div>
              <h3>Map & Geospatial Controls</h3>
              <p>Tile server layer preferences and map rendering</p>
            </div>
          </div>
          <div className="settings-options-list">
            <div className="setting-row">
              <div>
                <strong>Default Map Layer</strong>
                <p>OpenStreetMap vector tile layer</p>
              </div>
              <span className="setting-tag">OpenStreetMap</span>
            </div>

            <div className="setting-row">
              <div>
                <strong>Satellite Base Tile</strong>
                <p>Esri World Imagery satellite provider</p>
              </div>
              <span className="setting-tag">Esri Aerial</span>
            </div>

            <div className="setting-row">
              <div>
                <strong>Default Initial Zoom Level</strong>
                <p>City metropolitan level (Zoom 11)</p>
              </div>
              <span className="setting-tag">Level 11</span>
            </div>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div className="settings-panel-card">
          <div className="settings-card-title">
            <FaServer className="settings-icon orange" />
            <div>
              <h3>Backend API Status</h3>
              <p>Real-time connection status to Django REST services</p>
            </div>
          </div>
          <div className="settings-options-list">
            <div className="setting-row">
              <div>
                <strong>API Endpoint Base</strong>
                <p>{import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/"}</p>
              </div>
              <span className={isConnected ? "setting-active-tag" : "setting-error-tag"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="setting-row">
              <div>
                <strong>Available Metropolitan Cities</strong>
                <p>Ahmedabad, Bengaluru, Delhi, Hyderabad, Mumbai</p>
              </div>
              <span className="setting-tag">{cities ? cities.length : 0} Cities Loaded</span>
            </div>
          </div>
        </div>

        {/* About HeatShield AI */}
        <div className="settings-panel-card">
          <div className="settings-card-title">
            <FaShieldAlt className="settings-icon emerald" />
            <div>
              <h3>About HeatShield AI</h3>
              <p>Urban Heat Island Monitoring & AI Recommendation Platform</p>
            </div>
          </div>
          <div className="about-content-box">
            <p>
              HeatShield AI integrates satellite Earth observation data, land surface temperature algorithms, multi-spectral vegetation indices, and artificial intelligence models to predict urban thermal hotspots and deliver actionable cooling strategies for metropolitan regions.
            </p>
            <div className="about-tech-badges">
              <span>Django REST Framework</span>
              <span>React 19</span>
              <span>Leaflet GIS</span>
              <span>Recharts</span>
              <span>Vite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
