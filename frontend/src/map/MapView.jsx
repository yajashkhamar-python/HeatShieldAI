import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  ScaleControl,
  ImageOverlay,
  useMap
} from "react-leaflet";
import { FaGlobe, FaLayerGroup } from "react-icons/fa";
import api from "../api/api";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import Legend from "../components/Legend";
import "./MapView.css";

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 11);
  return null;
}

export default function MapView({ city, analysis, height = "480px" }) {
  const [rasterData, setRasterData] = useState(null);

  useEffect(() => {
    if (!city?.name) return;
    let cancelled = false;

    // Reset raster overlay when city changes
    setRasterData(null);

    async function loadRaster() {
      try {
        const cityName = city.name.trim();
        const res = await api.get(`/raster-preview/${encodeURIComponent(cityName)}/heat-risk/`);
        if (!cancelled && res.data && res.data.image && res.data.bounds) {
          // Verify response city matches active city
          if (res.data.city?.toLowerCase() === cityName.toLowerCase()) {
            setRasterData(res.data);
          }
        }
      } catch (err) {
        console.warn(`Heat risk raster overlay unavailable for ${city?.name}:`, err);
        if (!cancelled) {
          setRasterData(null);
        }
      }
    }

    loadRaster();
    return () => {
      cancelled = true;
    };
  }, [city?.name]);

  if (!city) return null;

  const latitude = Number(city.latitude);
  const longitude = Number(city.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const position = [latitude, longitude];

  return (
    <div className="map-view-wrapper">
      <div className="map-view-header">
        <div className="map-header-title">
          <FaGlobe className="map-title-icon" />
          <div>
            <h4>Urban Heat Map — {city.name}</h4>
            <span className="map-subtitle">Satellite Thermal Risk Layer & GIS Overlay</span>
          </div>
        </div>

        <div className="map-header-controls">
          <span className="map-layer-indicator">
            <FaLayerGroup /> Interactive Base & Overlay Layers
          </span>
        </div>
      </div>

      <div className="map-container-box" style={{ height }}>
        <MapContainer
          center={position}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={position} />

          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street Map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            </LayersControl.BaseLayer>

            {rasterData && rasterData.image && rasterData.bounds && (
              <LayersControl.Overlay checked name="🔥 Heat Risk Overlay">
                <ImageOverlay
                  key={`${city.name}-${rasterData.filename}`}
                  url={rasterData.image}
                  bounds={rasterData.bounds}
                  opacity={0.58}
                />
              </LayersControl.Overlay>
            )}
          </LayersControl>

          <Legend />

          <Marker position={position}>
            <Popup>
              <div className="map-popup-card">
                <h3>{city.name}</h3>
                <p className="popup-state">{city.state}, India</p>
                <div className="popup-divider"></div>
                <div className="popup-stat-row">
                  <span>Average Risk:</span>
                  <strong>{analysis?.average_risk ?? "N/A"}</strong>
                </div>
                <div className="popup-stat-row">
                  <span>Maximum Risk:</span>
                  <strong>{analysis?.maximum_risk ?? "N/A"}</strong>
                </div>
                <div className="popup-stat-row">
                  <span>Hotspot Area:</span>
                  <strong>{analysis?.hotspot_area ?? "N/A"} km²</strong>
                </div>
                <div className="popup-stat-row">
                  <span>Hotspot %:</span>
                  <strong>{analysis?.hotspot_percentage ?? "N/A"}%</strong>
                </div>
              </div>
            </Popup>
          </Marker>

          <ScaleControl />
        </MapContainer>
      </div>
    </div>
  );
}