import { FaLeaf, FaCity, FaTint, FaTemperatureHigh } from "react-icons/fa";
import "./EnvironmentStatus.css";

export default function EnvironmentStatus({ analysis }) {
  if (!analysis) return null;

  const ndviVal = Number(analysis.average_ndvi);
  const ndbiVal = Number(analysis.average_ndbi);
  const ndwiVal = Number(analysis.average_ndwi);
  const lstVal = Number(analysis.average_lst);

  const getNDVIStatus = (val) => {
    if (val < 0.30) return { label: "Poor Vegetation Cover", status: "danger" };
    if (val < 0.50) return { label: "Moderate Vegetation", status: "warning" };
    return { label: "Healthy Dense Canopy", status: "success" };
  };

  const getNDBIStatus = (val) => {
    if (val > 0.20) return { label: "Dense Built-up Infrastructure", status: "danger" };
    if (val > 0) return { label: "Moderate Urban Built-up", status: "warning" };
    return { label: "Low Built-up Density", status: "success" };
  };

  const getNDWIStatus = (val) => {
    if (val < -0.20) return { label: "Critically Low Water Bodies", status: "danger" };
    if (val < 0) return { label: "Moderate Surface Water", status: "warning" };
    return { label: "Sufficient Water Bodies", status: "success" };
  };

  const getLSTStatus = (val) => {
    if (val > 35) return { label: "Extreme Surface Thermal Heat", status: "danger" };
    if (val > 30) return { label: "Warm Urban Surface Temp", status: "warning" };
    return { label: "Normal Surface Temperature", status: "success" };
  };

  const envItems = [
    {
      title: "NDVI",
      name: "Normalized Difference Vegetation Index",
      value: Number.isFinite(ndviVal) ? ndviVal.toFixed(3) : analysis.average_ndvi ?? "N/A",
      icon: <FaLeaf />,
      sub: "Vegetation Health",
      info: getNDVIStatus(ndviVal),
      theme: "theme-emerald"
    },
    {
      title: "NDBI",
      name: "Normalized Difference Built-Up Index",
      value: Number.isFinite(ndbiVal) ? ndbiVal.toFixed(3) : analysis.average_ndbi ?? "N/A",
      icon: <FaCity />,
      sub: "Built-up Intensity",
      info: getNDBIStatus(ndbiVal),
      theme: "theme-cyan"
    },
    {
      title: "NDWI",
      name: "Normalized Difference Water Index",
      value: Number.isFinite(ndwiVal) ? ndwiVal.toFixed(3) : analysis.average_ndwi ?? "N/A",
      icon: <FaTint />,
      sub: "Water Presence",
      info: getNDWIStatus(ndwiVal),
      theme: "theme-blue"
    },
    {
      title: "LST",
      name: "Land Surface Temperature",
      value: Number.isFinite(lstVal) ? `${lstVal.toFixed(2)} °C` : `${analysis.average_lst ?? "N/A"} °C`,
      icon: <FaTemperatureHigh />,
      sub: "Surface Heat Level",
      info: getLSTStatus(lstVal),
      theme: "theme-red"
    }
  ];

  return (
    <section className="environment-status-section">
      <div className="env-section-header">
        <h3>🌍 Environmental Intelligence Indices</h3>
        <p>Satellite derived multi-spectral environmental metrics</p>
      </div>

      <div className="environment-cards-grid">
        {envItems.map((item, idx) => (
          <div key={idx} className={`env-intelligence-card ${item.theme}`}>
            <div className="env-card-header">
              <div className="env-icon-badge">{item.icon}</div>
              <div className="env-title-box">
                <h4>{item.title}</h4>
                <span className="env-subtitle">{item.sub}</span>
              </div>
            </div>

            <div className="env-card-body">
              <h2 className="env-value">{item.value}</h2>
              <p className="env-desc">{item.name}</p>
            </div>

            <div className={`env-status-pill ${item.info.status}`}>
              <span>{item.info.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}