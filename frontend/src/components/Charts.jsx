import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

function getNumericValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const match = value.match(/(\d+(?:\.\d+)?)\s*%?/);
    if (match) {
      const number = Number(match[1]);
      if (Number.isFinite(number)) {
        return number;
      }
    }
  }
  return 0;
}

export default function Charts({ recommendation }) {
  if (!recommendation) return null;

  const data = [
    {
      name: "Tree Cover",
      value: getNumericValue(recommendation.tree_plantation),
      color: "#20C997"
    },
    {
      name: "Cool Roof",
      value: getNumericValue(recommendation.cool_roof),
      color: "#FFB020"
    },
    {
      name: "Water Bodies",
      value: getNumericValue(recommendation.water_body),
      color: "#00B8D9"
    },
    {
      name: "Immediate Action",
      value: getNumericValue(recommendation.immediate_action),
      color: "#FF3B30"
    }
  ];

  const hasValues = data.some((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: "#0D1B2A",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "8px",
          padding: "8px 12px",
          color: "#F5F7FA",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)"
        }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem" }}>{payload[0].payload.name}</p>
          <p style={{ margin: "4px 0 0 0", color: payload[0].payload.color, fontWeight: 700, fontSize: "0.95rem" }}>
            Priority Score: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-panel)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <div>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Mitigation Action Priority Comparison
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
          Quantitative priorities evaluated by HeatShield AI Engine
        </p>
      </div>

      {hasValues ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis
              dataKey="name"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            fontSize: "0.9rem"
          }}
        >
          Recommendation priority data is currently processing...
        </div>
      )}
    </div>
  );
}