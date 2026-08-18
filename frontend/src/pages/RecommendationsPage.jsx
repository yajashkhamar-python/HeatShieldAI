import { FaTree, FaHome, FaWater, FaExclamationTriangle } from "react-icons/fa";
import RecommendationCard from "../components/RecommendationCard";
import RecommendationSummary from "../components/RecommendationSummary";
import "./RecommendationsPage.css";

export default function RecommendationsPage({ shellContext }) {
  const { analysis, recommendation, loadingAnalysis, selectedCity } = shellContext;

  if (loadingAnalysis || !recommendation || !analysis) {
    return (
      <div className="dashboard-state-container">
        <div className="spinner"></div>
        <h2>Loading AI recommendations for {selectedCity}...</h2>
      </div>
    );
  }

  const formatPriority = (val) => {
    const num = typeof val === "number" ? val : 0;
    if (num >= 30) return { text: "HIGH", cls: "priority-high" };
    if (num >= 15) return { text: "MEDIUM", cls: "priority-medium" };
    return { text: "LOW", cls: "priority-low" };
  };

  const recItems = [
    {
      title: "Urban Tree Plantation & Forestry",
      icon: <FaTree />,
      value: recommendation.tree_plantation,
      desc: "Deploy native dense canopy tree clusters in urban micro-hotspots to increase local shade factor and evapotranspiration cooling.",
      priority: formatPriority(recommendation.tree_plantation)
    },
    {
      title: "Cool Roof & Reflective Surfaces",
      icon: <FaHome />,
      value: recommendation.cool_roof,
      desc: "Apply high-albedo reflective coatings and solar reflective paints to built-up rooftops to reduce thermal solar absorption.",
      priority: formatPriority(recommendation.cool_roof)
    },
    {
      title: "Water Bodies & Blue Infrastructure",
      icon: <FaWater />,
      value: recommendation.water_body,
      desc: "Restore urban water retention basins, artificial wetlands, and mist fountains to lower localized air temperatures through evaporative cooling.",
      priority: formatPriority(recommendation.water_body)
    },
    {
      title: "Immediate Action & Heat Relief Zones",
      icon: <FaExclamationTriangle />,
      value: recommendation.immediate_action,
      desc: "Deploy emergency public cooling shelters, hydration stations, and traffic heat shields in critically exposed urban zones.",
      priority: formatPriority(recommendation.immediate_action)
    }
  ];

  return (
    <div className="recommendations-page-layout">
      <div className="rec-page-header">
        <h2>AI-Driven Urban Heat Mitigation Strategies</h2>
        <p>Prioritized cooling recommendations tailored for {analysis.city?.name}</p>
      </div>

      {/* Top Priority Cards */}
      <div className="rec-cards-row">
        <RecommendationCard
          icon={<FaTree />}
          title="Tree Plantation"
          value={recommendation.tree_plantation}
        />
        <RecommendationCard
          icon={<FaHome />}
          title="Cool Roof"
          value={recommendation.cool_roof}
        />
        <RecommendationCard
          icon={<FaWater />}
          title="Water Bodies"
          value={recommendation.water_body}
        />
        <RecommendationCard
          icon={<FaExclamationTriangle />}
          title="Immediate Action"
          value={recommendation.immediate_action}
        />
      </div>

      {/* Detailed Strategy Breakdown Table */}
      <div className="rec-table-card">
        <div className="table-card-header">
          <h3>Mitigation Action Plan — Priority Matrix</h3>
          <span className="city-pill">{analysis.city?.name}</span>
        </div>

        <div className="rec-table-responsive">
          <table className="rec-matrix-table">
            <thead>
              <tr>
                <th>Mitigation Strategy</th>
                <th>Priority Level</th>
                <th>Calculated Score</th>
                <th>Recommended Strategic Action</th>
              </tr>
            </thead>
            <tbody>
              {recItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="strategy-name-cell">
                    <span className="strategy-icon">{item.icon}</span>
                    <span>{item.title}</span>
                  </td>
                  <td>
                    <span className={`priority-badge ${item.priority.cls}`}>
                      {item.priority.text}
                    </span>
                  </td>
                  <td>
                    <strong className="score-val">
                      {typeof item.value === "number" ? `${item.value}%` : item.value}
                    </strong>
                  </td>
                  <td className="desc-cell">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendation Summary */}
      <RecommendationSummary recommendation={recommendation} />
    </div>
  );
}
