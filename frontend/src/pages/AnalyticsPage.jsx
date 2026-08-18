import Charts from "../components/Charts";
import EnvironmentStatus from "../components/EnvironmentStatus";
import RiskStatus from "../components/RiskStatus";
import CompareCities from "../components/CompareCities";
import StatCard from "../components/StatCard";
import "./AnalyticsPage.css";

export default function AnalyticsPage({ shellContext }) {
  const { analysis, recommendation, loadingAnalysis, selectedCity } = shellContext;

  if (loadingAnalysis || !analysis || !recommendation) {
    return (
      <div className="dashboard-state-container">
        <div className="spinner"></div>
        <h2>Loading analytics for {selectedCity}...</h2>
      </div>
    );
  }

  return (
    <div className="analytics-page-layout">
      {/* Top Stat Summary Grid */}
      <div className="analytics-kpi-grid">
        <StatCard
          title="Average Risk Index"
          value={analysis.average_risk}
          subtitle="Aggregated risk metric"
          type="stat-orange"
        />

        <StatCard
          title="Hotspot Extent"
          value={`${analysis.hotspot_area} km²`}
          subtitle="High thermal stress surface"
          type="stat-danger"
        />

        <StatCard
          title="NDVI Vegetation"
          value={analysis.average_ndvi}
          subtitle="Canopy density index"
          type="stat-emerald"
        />

        <StatCard
          title="Land Surface Temp"
          value={`${analysis.average_lst} °C`}
          subtitle="Mean thermal radiometric temp"
          type="stat-cyan"
        />
      </div>

      {/* Analytics Main Two-Column View */}
      <div className="analytics-two-col">
        <div className="analytics-col">
          <RiskStatus analysis={analysis} />
          <Charts recommendation={recommendation} />
        </div>

        <div className="analytics-col">
          <CompareCities />
        </div>
      </div>

      {/* Environmental Multi-Spectral Indices */}
      <EnvironmentStatus analysis={analysis} />
    </div>
  );
}
