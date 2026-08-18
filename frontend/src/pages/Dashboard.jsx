import { FaTree, FaHome, FaWater, FaExclamationTriangle } from "react-icons/fa";
import StatCard from "../components/StatCard";
import RiskStatus from "../components/RiskStatus";
import CityInfo from "../components/CityInfo";
import MapView from "../map/MapView";
import RecommendationCard from "../components/RecommendationCard";
import RecommendationSummary from "../components/RecommendationSummary";
import EnvironmentStatus from "../components/EnvironmentStatus";
import Charts from "../components/Charts";
import DownloadSection from "../components/DownloadSection";

export default function Dashboard({ shellContext }) {
  const {
    selectedCity,
    analysis,
    recommendation,
    loadingAnalysis,
    error
  } = shellContext;

  if (loadingAnalysis || !analysis || !recommendation) {
    return (
      <div className="dashboard-state-container">
        <div className="skeleton-spinner-box">
          <div className="spinner"></div>
          <h2>Loading geospatial heat analysis for {selectedCity || "city"}...</h2>
          <p>Analyzing multi-spectral satellite imagery and environmental metrics</p>
        </div>
        {error && <div className="dashboard-error-card">{error}</div>}
      </div>
    );
  }

  return (
    <div className="dashboard-page-grid">
      {/* Top KPI Cards Grid */}
      <div className="dashboard-kpi-grid">
        <StatCard
          title="Average Risk"
          value={analysis.average_risk}
          subtitle="City-wide average thermal risk"
          type="stat-orange"
        />

        <StatCard
          title="Maximum Risk"
          value={analysis.maximum_risk}
          subtitle="Peak hotspot risk severity"
          type="stat-danger"
        />

        <StatCard
          title="Hotspot Percentage"
          value={`${analysis.hotspot_percentage}%`}
          subtitle="Municipal area exposed"
          type="stat-warning"
        />

        <StatCard
          title="Hotspot Area"
          value={`${analysis.hotspot_area} km²`}
          subtitle="Total high-risk geographic zone"
          type="stat-cyan"
        />
      </div>

      {/* Heat Risk Banner & City Metadata */}
      <div className="dashboard-two-col">
        <div className="col-main">
          <RiskStatus analysis={analysis} />
        </div>
        <div className="col-side">
          <CityInfo city={analysis.city} />
        </div>
      </div>

      {/* Geospatial Map View */}
      <MapView
        key={analysis.city.name}
        city={analysis.city}
        analysis={analysis}
        height="500px"
      />

      {/* AI Mitigation Recommendations */}
      <section className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>AI Mitigation Action Priorities</h3>
          <p>Recommendation priorities computed from multi-spectral environmental indices</p>
        </div>

        <div className="recommendation-grid-cards">
          <RecommendationCard
            icon={<FaTree />}
            title="Tree Plantation"
            value={recommendation.tree_plantation}
          />

          <RecommendationCard
            icon={<FaHome />}
            title="Cool Roof Installation"
            value={recommendation.cool_roof}
          />

          <RecommendationCard
            icon={<FaWater />}
            title="Water Bodies & Hydration"
            value={recommendation.water_body}
          />

          <RecommendationCard
            icon={<FaExclamationTriangle />}
            title="Immediate Action Zone"
            value={recommendation.immediate_action}
          />
        </div>
      </section>

      {/* Recommendation Summary */}
      <RecommendationSummary recommendation={recommendation} />

      {/* Environmental Intelligence Indices */}
      <EnvironmentStatus analysis={analysis} />

      {/* Analytics Chart */}
      <Charts recommendation={recommendation} />

      {/* GIS Export Downloads */}
      <DownloadSection city={analysis.city} />
    </div>
  );
}