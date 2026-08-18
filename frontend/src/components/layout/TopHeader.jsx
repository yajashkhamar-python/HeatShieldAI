import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaSearch, FaMapMarkerAlt, FaCompass, FaFileAlt } from "react-icons/fa";
import CitySelector from "../CitySelector";
import "./AppShell.css";

export default function TopHeader({
  cities = [],
  selectedCity,
  setSelectedCity,
  setMobileOpen
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Home Overview";
      case "/dashboard":
        return "Main Dashboard";
      case "/heat-map":
        return "Geospatial Heat Map";
      case "/analytics":
        return "Analytics & Indices";
      case "/recommendations":
        return "AI Mitigation Recommendations";
      case "/reports":
        return "GIS Layers & Reports";
      case "/settings":
        return "Platform Settings";
      default:
        return "HeatShield AI";
    }
  };

  const pages = [
    { title: "Home", path: "/", desc: "Overview & landing page" },
    { title: "Dashboard", path: "/dashboard", desc: "Main urban heat analysis" },
    { title: "Heat Map", path: "/heat-map", desc: "Geospatial satellite view" },
    { title: "Analytics", path: "/analytics", desc: "Indices & city comparisons" },
    { title: "Recommendations", path: "/recommendations", desc: "AI cooling strategies" },
    { title: "Reports", path: "/reports", desc: "GeoTIFF raster layer downloads" },
    { title: "Settings", path: "/settings", desc: "Platform preferences" }
  ];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const queryClean = searchQuery.trim().toLowerCase();

  const matchedPages = queryClean
    ? pages.filter((p) => p.title.toLowerCase().includes(queryClean))
    : [];

  const matchedCities = queryClean
    ? cities.filter((c) => c.name.toLowerCase().includes(queryClean) || c.state.toLowerCase().includes(queryClean))
    : [];

  const handleSelectPage = (path) => {
    navigate(path);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleSelectCity = (cityName) => {
    setSelectedCity(cityName);
    if (location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
    setSearchQuery("");
    setSearchOpen(false);
  };

  return (
    <header className="app-top-header">
      <div className="header-left">
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open Sidebar Menu"
        >
          <FaBars />
        </button>

        <div className="page-title-container">
          <h1 className="page-title">{getPageTitle(location.pathname)}</h1>
          {selectedCity && (
            <span className="selected-city-badge">
              <FaMapMarkerAlt className="badge-icon" /> {selectedCity}
            </span>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Functional Search Bar */}
        <div className="search-bar-container" ref={searchContainerRef}>
          <div className="search-bar-visual">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search city, map, page..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
          </div>

          {searchOpen && queryClean.length > 0 && (
            <div className="search-dropdown-results">
              {matchedPages.length === 0 && matchedCities.length === 0 ? (
                <div className="search-no-results">No results found</div>
              ) : (
                <>
                  {matchedCities.length > 0 && (
                    <div className="search-category-group">
                      <span className="search-category-label">Cities</span>
                      {matchedCities.map((city) => (
                        <div
                          key={city.id || city.name}
                          className="search-result-item"
                          onClick={() => handleSelectCity(city.name)}
                        >
                          <FaMapMarkerAlt className="result-icon city" />
                          <div>
                            <strong>{city.name}</strong>
                            <small>{city.state}, India</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedPages.length > 0 && (
                    <div className="search-category-group">
                      <span className="search-category-label">Pages & Views</span>
                      {matchedPages.map((page) => (
                        <div
                          key={page.path}
                          className="search-result-item"
                          onClick={() => handleSelectPage(page.path)}
                        >
                          <FaFileAlt className="result-icon page" />
                          <div>
                            <strong>{page.title}</strong>
                            <small>{page.desc}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {cities.length > 0 && (
          <div className="city-selector-wrapper">
            <CitySelector
              cities={cities}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          </div>
        )}
      </div>
    </header>
  );
}
