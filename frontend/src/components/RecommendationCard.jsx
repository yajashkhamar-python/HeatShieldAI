import { FaAngleRight } from "react-icons/fa";
import "./RecommendationCard.css";

export default function RecommendationCard({
  icon,
  title,
  value,
  actionLabel
}) {
  const isNumber = typeof value === "number" && Number.isFinite(value);
  const numericValue = isNumber ? Math.max(0, Math.min(100, value)) : 0;
  const displayValue = isNumber ? `${numericValue}%` : value || "Available";

  // Derive visual priority from existing numeric value
  let priority = "MEDIUM";
  let priorityClass = "priority-medium";
  if (isNumber) {
    if (numericValue >= 30) {
      priority = "HIGH";
      priorityClass = "priority-high";
    } else if (numericValue >= 15) {
      priority = "MEDIUM";
      priorityClass = "priority-medium";
    } else {
      priority = "LOW";
      priorityClass = "priority-low";
    }
  }

  return (
    <div className="recommendation-card-container">
      <div className="rec-card-top">
        <div className="rec-icon-box">{icon}</div>
        <span className={`priority-badge ${priorityClass}`}>
          {priority} PRIORITY
        </span>
      </div>

      <div className="rec-card-content">
        <h4 className="rec-title">{title}</h4>
        <div className="rec-value-row">
          <span className="rec-value">{displayValue}</span>
          <span className="rec-subtext">Calculated Priority</span>
        </div>

        <div className="rec-progress-track">
          <div
            className={`rec-progress-fill ${priorityClass}`}
            style={{ width: `${numericValue}%` }}
          />
        </div>
      </div>
    </div>
  );
}