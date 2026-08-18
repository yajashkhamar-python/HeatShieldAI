import "./Legend.css";

export default function Legend() {
  return (
    <div className="map-heat-legend">
      <h5 className="legend-title">HEAT RISK INDEX</h5>
      <div className="legend-items">
        <div className="legend-step">
          <span className="step-color low"></span>
          <span className="step-label">🟢 Low</span>
        </div>
        <div className="legend-step">
          <span className="step-color moderate"></span>
          <span className="step-label">🟡 Moderate</span>
        </div>
        <div className="legend-step">
          <span className="step-color high"></span>
          <span className="step-label">🟠 High</span>
        </div>
        <div className="legend-step">
          <span className="step-color veryhigh"></span>
          <span className="step-label">🔴 Very High</span>
        </div>
      </div>
    </div>
  );
}