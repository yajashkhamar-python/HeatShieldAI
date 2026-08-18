import { useEffect, useState } from "react";
import api from "../api/api";
import "./CompareCities.css";

export default function CompareCities() {
  const [cities, setCities] = useState([]);
  const [city1, setCity1] = useState("Ahmedabad");
  const [city2, setCity2] = useState("Delhi");
  const [analysis1, setAnalysis1] = useState(null);
  const [analysis2, setAnalysis2] = useState(null);

  useEffect(() => {
    api.get("/cities/").then((res) => {
      if (Array.isArray(res.data) && res.data.length > 1) {
        setCities(res.data);
        setCity1(res.data[0].name);
        setCity2(res.data[1].name);
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!city1) return;
    api.get(`/analysis/${encodeURIComponent(city1)}/`)
      .then((res) => setAnalysis1(res.data))
      .catch(err => console.error(err));
  }, [city1]);

  useEffect(() => {
    if (!city2) return;
    api.get(`/analysis/${encodeURIComponent(city2)}/`)
      .then((res) => setAnalysis2(res.data))
      .catch(err => console.error(err));
  }, [city2]);

  if (!analysis1 || !analysis2) return null;

  return (
    <div className="compare-cities-card">
      <div className="compare-header">
        <h3>🏙 Cross-City Thermal Comparison</h3>
        <p>Compare heat risk indicators across two Indian metropolitan regions</p>
      </div>

      <div className="compare-selectors-row">
        <div className="selector-box">
          <label>Primary City</label>
          <select value={city1} onChange={(e) => setCity1(e.target.value)}>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="compare-versus">VS</div>

        <div className="selector-box">
          <label>Benchmark City</label>
          <select value={city2} onChange={(e) => setCity2(e.target.value)}>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Environmental Indicator</th>
              <th>{analysis1.city?.name || city1}</th>
              <th>{analysis2.city?.name || city2}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Average Risk</td>
              <td><strong className="val-highlight">{analysis1.average_risk}</strong></td>
              <td><strong className="val-highlight">{analysis2.average_risk}</strong></td>
            </tr>
            <tr>
              <td>Maximum Risk</td>
              <td>{analysis1.maximum_risk}</td>
              <td>{analysis2.maximum_risk}</td>
            </tr>
            <tr>
              <td>Hotspot Percentage</td>
              <td>{analysis1.hotspot_percentage}%</td>
              <td>{analysis2.hotspot_percentage}%</td>
            </tr>
            <tr>
              <td>Hotspot Area</td>
              <td>{analysis1.hotspot_area} km²</td>
              <td>{analysis2.hotspot_area} km²</td>
            </tr>
            <tr>
              <td>NDVI (Vegetation)</td>
              <td>{analysis1.average_ndvi}</td>
              <td>{analysis2.average_ndvi}</td>
            </tr>
            <tr>
              <td>NDBI (Built-up)</td>
              <td>{analysis1.average_ndbi}</td>
              <td>{analysis2.average_ndbi}</td>
            </tr>
            <tr>
              <td>NDWI (Water)</td>
              <td>{analysis1.average_ndwi}</td>
              <td>{analysis2.average_ndwi}</td>
            </tr>
            <tr>
              <td>LST (Land Surface Temp)</td>
              <td>{analysis1.average_lst} °C</td>
              <td>{analysis2.average_lst} °C</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}