import MapView from "../map/MapView";
import CityInfo from "../components/CityInfo";
import StatCard from "../components/StatCard";

export default function HeatMapPage({ shellContext }) {
  const { analysis, loadingAnalysis, selectedCity } = shellContext;

  if (loadingAnalysis || !analysis) {
    return (
      <div className="dashboard-state-container">
        <div className="spinner"></div>
        <h2>Loading map view for {selectedCity}...</h2>
      </div>
    );
  }

  return (
    <div className="heatmap-page-layout">
      {/* Top Map Statistics Summary */}
      <div className="heatmap-stats-grid">
        <StatCard
          title="Average Heat Risk"
          value={analysis.average_risk}
          subtitle="Mean city-wide thermal risk index"
          type="stat-orange"
        />

        <StatCard
          title="Peak Risk Level"
          value={analysis.maximum_risk}
          subtitle="Highest thermal hotspot index"
          type="stat-danger"
        />

        <StatCard
          title="Hotspot Area"
          value={`${analysis.hotspot_area} km²`}
          subtitle="Areal extent of thermal anomaly"
          type="stat-cyan"
        />

        <StatCard
          title="Hotspot Density"
          value={`${analysis.hotspot_percentage}%`}
          subtitle="Percentage of municipal territory"
          type="stat-warning"
        />
      </div>

      {/* Main Geospatial Map & City Context */}
      <div className="heatmap-main-grid">
        <div className="heatmap-map-col">
          <MapView
            key={analysis.city.name}
            city={analysis.city}
            analysis={analysis}
            height="620px"
          />
        </div>

        <div className="heatmap-side-col">
          <CityInfo city={analysis.city} />

          <div className="map-guidance-card">
            <h4>🗺 GIS Layer Controls</h4>
            <p>
              Use the top-right layer toggle on the map to switch between standard <strong>Street Map</strong> and high-resolution <strong>Satellite Aerial Imagery</strong>.
            </p>
            <hr />
            <p>
              Click on the city marker pin to inspect localized risk calculations and hotspot statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
