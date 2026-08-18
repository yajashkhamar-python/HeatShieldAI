import { FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";
import "./RiskStatus.css";

export default function RiskStatus({ analysis }) {
  if (!analysis) return null;

  let status = "LOW";
  let color = "var(--accent-emerald)";
  let badgeBg = "rgba(32, 201, 151, 0.15)";
  let borderBorder = "var(--accent-emerald)";

  const avgRisk = Number(analysis.average_risk) || 0;

  if (avgRisk < 0.30) {
    status = "LOW";
    color = "var(--accent-emerald)";
    badgeBg = "rgba(32, 201, 151, 0.15)";
    borderBorder = "var(--accent-emerald)";
  } else if (avgRisk < 0.60) {
    status = "MODERATE";
    color = "var(--warning-yellow)";
    badgeBg = "rgba(255, 176, 32, 0.15)";
    borderBorder = "var(--warning-yellow)";
  } else if (avgRisk < 0.80) {
    status = "HIGH";
    color = "var(--heat-orange)";
    badgeBg = "rgba(255, 107, 53, 0.15)";
    borderBorder = "var(--heat-orange)";
  } else {
    status = "VERY HIGH";
    color = "var(--heat-red)";
    badgeBg = "rgba(255, 59, 48, 0.15)";
    borderBorder = "var(--heat-red)";
  }

  return (
    <div className="risk-status-panel" style={{ borderColor: borderBorder }}>
      <div className="risk-header">
        <div className="risk-title-box">
          <FaShieldAlt className="risk-icon" style={{ color }} />
          <div>
            <h3>Current Urban Heat Risk</h3>
            <p className="risk-sub">Satellite Heat Island Classification</p>
          </div>
        </div>
        <div className="risk-level-badge" style={{ backgroundColor: badgeBg, color, borderColor: borderBorder }}>
          <FaExclamationTriangle />
          <span>{status} RISK</span>
        </div>
      </div>

      <div className="risk-metrics-grid">
        <div className="risk-metric-item">
          <span className="metric-label">Average Risk</span>
          <span className="metric-val">{analysis.average_risk ?? "N/A"}</span>
        </div>
        <div className="risk-metric-item">
          <span className="metric-label">Maximum Risk</span>
          <span className="metric-val">{analysis.maximum_risk ?? "N/A"}</span>
        </div>
        <div className="risk-metric-item">
          <span className="metric-label">Hotspot Area</span>
          <span className="metric-val">{analysis.hotspot_area ?? "N/A"} km²</span>
        </div>
        <div className="risk-metric-item">
          <span className="metric-label">Hotspot %</span>
          <span className="metric-val">{analysis.hotspot_percentage ?? "N/A"}%</span>
        </div>
      </div>
    </div>
  );
}