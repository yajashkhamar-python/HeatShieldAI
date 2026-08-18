import { FaTemperatureHigh, FaExclamationTriangle, FaTree, FaUsers, FaChartPie, FaGlobeAmericas } from "react-icons/fa";
import "./StatCard.css";

export default function StatCard({ title, value, icon, subtitle, trend, type }) {
  const getIcon = () => {
    if (icon) return icon;
    if (title.toLowerCase().includes("average")) return <FaTemperatureHigh />;
    if (title.toLowerCase().includes("maximum")) return <FaExclamationTriangle />;
    if (title.toLowerCase().includes("%")) return <FaChartPie />;
    if (title.toLowerCase().includes("area")) return <FaGlobeAmericas />;
    return <FaTree />;
  };

  const getTypeClass = () => {
    if (type) return type;
    if (title.toLowerCase().includes("maximum")) return "stat-danger";
    if (title.toLowerCase().includes("average")) return "stat-orange";
    if (title.toLowerCase().includes("%")) return "stat-warning";
    return "stat-cyan";
  };

  return (
    <div className={`stat-card-container ${getTypeClass()}`}>
      <div className="stat-card-header">
        <span className="stat-title-text">{title}</span>
        <div className="stat-icon-badge">{getIcon()}</div>
      </div>
      <div className="stat-card-body">
        <h2 className="stat-value-text">{value ?? "N/A"}</h2>
        {subtitle && <p className="stat-subtitle-text">{subtitle}</p>}
        {trend && (
          <span className={`stat-trend-badge ${trend.isPositive ? "positive" : "negative"}`}>
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );
}