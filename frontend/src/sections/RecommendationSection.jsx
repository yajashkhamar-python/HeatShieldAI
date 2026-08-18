import RecommendationCard from "../components/RecommendationCard";
import RecommendationSummary from "../components/RecommendationSummary";

import {
    FaTree,
    FaHome,
    FaWater,
    FaExclamationTriangle
} from "react-icons/fa";

export default function RecommendationSection({ recommendation }) {

    return (

        <>

            <h2 className="section-title">

                AI Recommendations

            </h2>

            <div className="recommendation-grid">

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

            <RecommendationSummary
                recommendation={recommendation}
            />

        </>

    );

}