import { FaLightbulb, FaCheckCircle } from "react-icons/fa";
import "./RecommendationSummary.css";

export default function RecommendationSummary({ recommendation }) {
  if (!recommendation) return null;

  const rawSummary =
    Array.isArray(recommendation.summary)
      ? recommendation.summary
      : Array.isArray(recommendation.recommendation_text)
      ? recommendation.recommendation_text
      : typeof recommendation.recommendation_text === "string"
      ? [recommendation.recommendation_text]
      : [];

  const formatItemText = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      return item.text || item.recommendation || item.description || JSON.stringify(item);
    }
    return String(item);
  };

  const summaryItems = rawSummary
    .map(formatItemText)
    .filter((text) => text.trim().length > 0);

  return (
    <section className="recommendation-summary-section">
      <div className="rec-summary-header">
        <div className="rec-summary-icon">
          <FaLightbulb />
        </div>
        <div>
          <h3>AI Intelligence Recommendation Summary</h3>
          <p>Automated urban heat mitigation strategies & action plan</p>
        </div>
      </div>

      {summaryItems.length > 0 ? (
        <ul className="rec-summary-list">
          {summaryItems.map((item, index) => (
            <li key={index} className="rec-summary-item">
              <FaCheckCircle className="check-icon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rec-summary-empty">
          <p>AI recommendations generated for selected city strategies.</p>
        </div>
      )}
    </section>
  );
}