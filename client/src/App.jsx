import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InspectionProvider } from './context/InspectionContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Public Authentication & Overview Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CapabilitiesPage } from './pages/CapabilitiesPage';
import { LiveDemoPage } from './pages/LiveDemoPage';

// Operations Center Pages
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { CameraManagementPage } from './pages/CameraManagementPage';
import { CameraIntegrationsPage } from './pages/CameraIntegrationsPage';
import { InspectionsListPage } from './pages/InspectionsListPage';
import { NewInspectionPage } from './pages/NewInspectionPage';
import { InspectionResultsPage } from './pages/InspectionResultsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { SafetyZonesPage } from './pages/SafetyZonesPage';
import { EvidenceVaultPage } from './pages/EvidenceVaultPage';
import { SiteMapPage } from './pages/SiteMapPage';
import { ReportsPage } from './pages/ReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SitesManagementPage } from './pages/SitesManagementPage';
import { TeamManagementPage } from './pages/TeamManagementPage';
import { InspectionEnginePage } from './pages/InspectionEnginePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <InspectionProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Interactive & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/capabilities" element={<CapabilitiesPage />} />
            <Route path="/live-demo" element={<LiveDemoPage />} />

            {/* Protected Safety Operations Shell */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Primary Navigation Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/live-cameras" element={<LiveMonitoringPage />} />
              <Route path="/live-monitoring" element={<LiveMonitoringPage />} />
              <Route path="/cameras" element={<CameraManagementPage />} />
              <Route path="/camera-install" element={<CameraIntegrationsPage />} />
              <Route path="/integrations" element={<CameraIntegrationsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/risk-events" element={<IncidentsPage />} />
              <Route path="/inspections" element={<InspectionsListPage />} />
              <Route path="/inspections/new" element={<NewInspectionPage />} />
              <Route path="/inspections/:id" element={<InspectionResultsPage />} />
              <Route path="/sites" element={<SitesManagementPage />} />
              <Route path="/safety-zones" element={<SafetyZonesPage />} />
              <Route path="/zones" element={<Navigate to="/safety-zones" replace />} />
              <Route path="/evidence" element={<EvidenceVaultPage />} />
              <Route path="/evidence-vault" element={<Navigate to="/evidence" replace />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/site-map" element={<SiteMapPage />} />
              <Route path="/map" element={<SiteMapPage />} />
              <Route path="/team" element={<TeamManagementPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Workflows & Profile */}
              <Route path="/inspection-engine" element={<InspectionEnginePage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Backward compatibility aliases */}
              <Route path="/inspect" element={<Navigate to="/inspections/new" replace />} />
              <Route path="/inspection/:id" element={<InspectionResultsPage />} />
              <Route path="/history" element={<Navigate to="/inspections" replace />} />
              <Route path="/hazards" element={<Navigate to="/incidents" replace />} />
              <Route path="/events" element={<Navigate to="/incidents" replace />} />
              <Route path="/monitoring" element={<Navigate to="/live-cameras" replace />} />
              <Route path="/compliance" element={<Navigate to="/analytics" replace />} />
            </Route>

            {/* Fallback 404 Route */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </InspectionProvider>
    </AuthProvider>
  );
}

export default App;
