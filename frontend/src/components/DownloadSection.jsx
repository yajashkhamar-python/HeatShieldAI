import { FaDownload, FaLayerGroup, FaFileArchive } from "react-icons/fa";
import "./DownloadSection.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export default function DownloadSection({ city }) {
  if (!city?.name) return null;

  const cityName = city.name.trim();

  const downloads = [
    {
      name: "Heat Risk Map",
      layer: "heat-risk",
      desc: "Calculated heat risk index GeoTIFF raster",
      format: "GeoTIFF (.tif)"
    },
    {
      name: "Risk Classification",
      layer: "risk-classification",
      desc: "Categorized 4-level urban thermal risk matrix",
      format: "GeoTIFF (.tif)"
    },
    {
      name: "NDVI Index",
      layer: "ndvi",
      desc: "Normalized Difference Vegetation Index raster layer",
      format: "GeoTIFF (.tif)"
    },
    {
      name: "NDBI Index",
      layer: "ndbi",
      desc: "Normalized Difference Built-up Index raster layer",
      format: "GeoTIFF (.tif)"
    },
    {
      name: "NDWI Index",
      layer: "ndwi",
      desc: "Normalized Difference Water Index raster layer",
      format: "GeoTIFF (.tif)"
    }
  ];

  const handleDownload = async (layer, name) => {
    try {
      const url =
        `${API_BASE}/raster-image/` +
        `${encodeURIComponent(cityName)}/` +
        `${encodeURIComponent(layer)}/`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `${cityName}_${name.replace(/\s+/g, "_")}.tif`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(`Unable to download ${name} for ${cityName}:`, error);
      alert(`${name} could not be downloaded for ${cityName}.`);
    }
  };

  return (
    <section className="download-section-container">
      <div className="download-section-header">
        <div className="download-header-icon">
          <FaLayerGroup />
        </div>
        <div>
          <h3>Export GIS Satellite Layers</h3>
          <p>Download full-resolution geospatial GeoTIFF rasters for {cityName}</p>
        </div>
      </div>

      <div className="download-grid-cards">
        {downloads.map((item) => (
          <div key={item.layer} className="gis-download-card">
            <div className="gis-card-header">
              <span className="gis-title">{item.name}</span>
              <span className="gis-format-badge">
                <FaFileArchive /> {item.format}
              </span>
            </div>
            <p className="gis-desc">{item.desc}</p>

            <button
              type="button"
              className="gis-download-btn"
              onClick={() => handleDownload(item.layer, item.name)}
            >
              <FaDownload /> Download {item.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}