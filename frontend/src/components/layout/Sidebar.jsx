import { NavLink } from "react-router-dom";
import {
  FaShieldAlt,
  FaHome,
  FaChartBar,
  FaMapMarkedAlt,
  FaLightbulb,
  FaFileDownload,
  FaCog,
  FaTimes
} from "react-icons/fa";
import "./AppShell.css";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { path: "/heat-map", label: "Heat Map", icon: <FaMapMarkedAlt /> },
    { path: "/analytics", label: "Analytics", icon: <FaChartBar /> },
    { path: "/recommendations", label: "Recommendations", icon: <FaLightbulb /> },
    { path: "/reports", label: "Reports", icon: <FaFileDownload /> },
    { path: "/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <FaShieldAlt />
          </div>
          <div className="brand-text">
            <span className="brand-title">HeatShield <span className="highlight">AI</span></span>
            <span className="brand-subtitle">Satellite Intelligence</span>
          </div>
          <button 
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close Navigation"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileOpen(false)}
              end={item.path === "/"}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
