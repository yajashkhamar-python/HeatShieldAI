import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import api from "../../api/api";
import "./AppShell.css";

function getRecommendationPriority(value, fallback = 0) {
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
  return fallback;
}

function normalizeRecommendation(recommendation, analysis) {
  if (!recommendation) return null;

  const ndvi = Number(analysis?.average_ndvi);
  const ndbi = Number(analysis?.average_ndbi);
  const ndwi = Number(analysis?.average_ndwi);
  const lst = Number(analysis?.average_lst);

  let tree = getRecommendationPriority(recommendation.tree_plantation, 0);
  let cool = getRecommendationPriority(recommendation.cool_roof, 0);
  let water = getRecommendationPriority(recommendation.water_body, 0);
  let emergency = getRecommendationPriority(recommendation.immediate_action, 0);

  if (typeof recommendation.tree_plantation !== "number") {
    if (Number.isFinite(ndvi)) {
      if (ndvi < 0.30) tree = 40;
      else if (ndvi < 0.45) tree = 25;
      else tree = 10;
    }
  }

  if (typeof recommendation.cool_roof !== "number") {
    if (Number.isFinite(ndbi)) {
      if (ndbi > 0.20) cool = 35;
      else if (ndbi > 0) cool = 20;
      else cool = 5;
    }
  }

  if (typeof recommendation.water_body !== "number") {
    if (Number.isFinite(ndwi)) {
      if (ndwi < -0.20) water = 25;
      else if (ndwi < 0) water = 15;
      else water = 5;
    }
  }

  if (typeof recommendation.immediate_action !== "number") {
    if (Number.isFinite(lst)) {
      if (lst > 35) emergency = 20;
      else if (lst > 30) emergency = 10;
      else emergency = 5;
    }
  }

  return {
    ...recommendation,
    tree_plantation: tree,
    cool_roof: cool,
    water_body: water,
    immediate_action: emergency,
    recommendation_text: Array.isArray(recommendation.recommendation_text)
      ? recommendation.recommendation_text
      : Array.isArray(recommendation.summary)
      ? recommendation.summary
      : []
  };
}

export default function AppShell({ children, pageProps }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState("");

  // Load cities once on mount
  useEffect(() => {
    let cancelled = false;
    async function loadCities() {
      try {
        const response = await api.get("/cities/");
        if (cancelled) return;
        const cityData = Array.isArray(response.data) ? response.data : [];
        setCities(cityData);
        if (cityData.length > 0) {
          setSelectedCity(cityData[0].name);
        }
      } catch (err) {
        console.error("City loading error:", err);
        if (!cancelled) {
          setError("Unable to load cities.");
        }
      } finally {
        if (!cancelled) {
          setLoadingCities(false);
        }
      }
    }

    loadCities();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load analysis and recommendation on selectedCity change
  useEffect(() => {
    if (!selectedCity) return;

    let cancelled = false;
    async function loadCityData() {
      setLoadingAnalysis(true);
      setError("");

      const cityName = selectedCity.trim();
      const encodedCity = encodeURIComponent(cityName);

      try {
        const [analysisResponse, recommendationResponse] = await Promise.all([
          api.get(`/analysis/${encodedCity}/`),
          api.get(`/ai-recommendation/${encodedCity}/`)
        ]);

        if (cancelled) return;

        const analysisData = analysisResponse.data;
        const recommendationData = recommendationResponse.data;

        setAnalysis(analysisData);
        setRecommendation(normalizeRecommendation(recommendationData, analysisData));
      } catch (err) {
        console.error("City dashboard loading error:", err);
        if (!cancelled) {
          setAnalysis(null);
          setRecommendation(null);
          setError(`Unable to load data for ${selectedCity}.`);
        }
      } finally {
        if (!cancelled) {
          setLoadingAnalysis(false);
        }
      }
    }

    loadCityData();
    return () => {
      cancelled = true;
    };
  }, [selectedCity]);

  // Combined context object to pass down
  const shellContext = {
    cities,
    selectedCity,
    setSelectedCity,
    analysis,
    recommendation,
    loadingCities,
    loadingAnalysis,
    error
  };

  return (
    <div className="app-shell-container">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="app-main-layout">
        <TopHeader
          cities={cities}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          setMobileOpen={setMobileOpen}
        />

        <main className="app-content-body">
          {typeof children === "function" ? children(shellContext) : children}
        </main>
      </div>
    </div>
  );
}
