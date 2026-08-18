import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import "./CitySelector.css";

export default function CitySelector({
  cities = [],
  selectedCity,
  setSelectedCity
}) {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="city-selector-container">
      <div className="selector-icon">
        <FaMapMarkerAlt />
      </div>
      <select
        id="city-select"
        className="city-select-dropdown"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {cities.map((city) => (
          <option key={city.id || city.name} value={city.name}>
            {city.name}, {city.state}
          </option>
        ))}
      </select>
      <div className="selector-arrow">
        <FaChevronDown />
      </div>
    </div>
  );
}