import { FaMapMarkerAlt, FaGlobe, FaCompass } from "react-icons/fa";
import "./CityInfo.css";

export default function CityInfo({ city }) {
  if (!city) return null;

  return (
    <div className="city-info-card">
      <div className="city-info-header">
        <div className="city-icon-wrapper">
          <FaMapMarkerAlt />
        </div>
        <div>
          <h3>{city.name}</h3>
          <p>{city.state}, India</p>
        </div>
      </div>

      <div className="city-coordinates-grid">
        <div className="coord-item">
          <FaGlobe className="coord-icon" />
          <div>
            <span className="coord-label">Latitude</span>
            <span className="coord-val">{city.latitude}° N</span>
          </div>
        </div>

        <div className="coord-item">
          <FaCompass className="coord-icon" />
          <div>
            <span className="coord-label">Longitude</span>
            <span className="coord-val">{city.longitude}° E</span>
          </div>
        </div>
      </div>
    </div>
  );
}