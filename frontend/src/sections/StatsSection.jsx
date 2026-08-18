import StatCard from "../components/StatCard";

export default function StatsSection({ analysis }) {

    return (

        <div className="stats-grid">

            <StatCard
                title="Average Risk"
                value={analysis.average_risk}
            />

            <StatCard
                title="Maximum Risk"
                value={analysis.maximum_risk}
            />

            <StatCard
                title="Hotspot %"
                value={analysis.hotspot_percentage}
            />

            <StatCard
                title="Hotspot Area"
                value={`${analysis.hotspot_area} km²`}
            />

        </div>

    );

}