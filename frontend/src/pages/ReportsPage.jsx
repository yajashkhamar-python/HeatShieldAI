import DownloadSection from "../components/DownloadSection";
import CityInfo from "../components/CityInfo";
import { FaFileArchive, FaFileDownload, FaCheck } from "react-icons/fa";
import "./ReportsPage.css";

export default function ReportsPage({ shellContext }) {
  const { analysis, loadingAnalysis, selectedCity } = shellContext;

  if (loadingAnalysis || !analysis) {
    return (
      <div className="dashboard-state-container">
        <div className="spinner"></div>
        <h2>Loading reports for {selectedCity}...</h2>
      </div>
    );
  }

  return (
    <div className="reports-page-layout">
      <div className="reports-page-header">
        <div>
          <h2>Geospatial Satellite Layer Exports & Reports</h2>
          <p>Export GeoTIFF rasters and urban heat intelligence summaries for {analysis.city?.name}</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="reports-col-main">
          {/* Real Backend GIS Download Section */}
          <DownloadSection city={analysis.city} />
        </div>

        <div className="reports-col-side">
          <CityInfo city={analysis.city} />

          <div className="reports-summary-card">
            <div className="reports-card-header">
              <FaFileArchive className="reports-header-icon" />
              <h4>City Analysis Metadata Summary</h4>
            </div>

            <ul className="reports-summary-list">
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Selected City:</strong> {analysis.city?.name}, {analysis.city?.state}</span>
              </li>
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Analysis Date:</strong> {analysis.analysis_date}</span>
              </li>
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Average Heat Risk:</strong> {analysis.average_risk}</span>
              </li>
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Maximum Heat Risk:</strong> {analysis.maximum_risk}</span>
              </li>
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Hotspot Area:</strong> {analysis.hotspot_area} km² ({analysis.hotspot_percentage}%)</span>
              </li>
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Vegetation Cover (NDVI):</strong> {analysis.average_ndvi}</span>
              </li>
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Built-up Index (NDBI):</strong> {analysis.average_ndbi}</span>
              </li>
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Surface Water (NDWI):</strong> {analysis.average_ndwi}</span>
              </li>
              <li>
                <FaCheck className="reports-check" />
                <span><strong>Surface Temperature (LST):</strong> {analysis.average_lst} °C</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
