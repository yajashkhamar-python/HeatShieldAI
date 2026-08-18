import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import HeatMapPage from "./pages/HeatMapPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        {(shellContext) => (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard shellContext={shellContext} />} />
            <Route path="/heat-map" element={<HeatMapPage shellContext={shellContext} />} />
            <Route path="/analytics" element={<AnalyticsPage shellContext={shellContext} />} />
            <Route path="/recommendations" element={<RecommendationsPage shellContext={shellContext} />} />
            <Route path="/reports" element={<ReportsPage shellContext={shellContext} />} />
            <Route path="/settings" element={<SettingsPage shellContext={shellContext} />} />
          </Routes>
        )}
      </AppShell>
    </BrowserRouter>
  );
}

export default App;