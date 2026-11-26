import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Public pages
import LandingPage from './pages/public/LandingPage.jsx';
const FeaturesPage      = lazy(() => import('./pages/public/FeaturesPage.jsx'));
const HowItWorksPage    = lazy(() => import('./pages/public/HowItWorksPage.jsx'));
const AboutPage         = lazy(() => import('./pages/public/AboutPage.jsx'));
const ContactPage       = lazy(() => import('./pages/public/ContactPage.jsx'));
const FaqPage           = lazy(() => import('./pages/public/FaqPage.jsx'));
const PricingPage       = lazy(() => import('./pages/public/PricingPage.jsx'));

// Auth pages
const SignInPage         = lazy(() => import('./pages/auth/SignInPage.jsx'));
const SignUpPage         = lazy(() => import('./pages/auth/SignUpPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'));
const ResetPasswordPage  = lazy(() => import('./pages/auth/ResetPasswordPage.jsx'));

// Dashboard pages
const OverviewPage            = lazy(() => import('./pages/dashboard/OverviewPage.jsx'));
const ResumeUploadPage        = lazy(() => import('./pages/dashboard/ResumeUploadPage.jsx'));
const ResumeAnalysisPage      = lazy(() => import('./pages/dashboard/ResumeAnalysisPage.jsx'));
const AtsScorePage            = lazy(() => import('./pages/dashboard/AtsScorePage.jsx'));
const SkillGapPage            = lazy(() => import('./pages/dashboard/SkillGapPage.jsx'));
const JobMatcherPage          = lazy(() => import('./pages/dashboard/JobMatcherPage.jsx'));
const ResumeImproverPage      = lazy(() => import('./pages/dashboard/ResumeImproverPage.jsx'));
const CareerRecommendationsPage = lazy(() => import('./pages/dashboard/CareerRecommendationsPage.jsx'));
const InterviewPrepPage       = lazy(() => import('./pages/dashboard/InterviewPrepPage.jsx'));
const ResumeBuilderPage       = lazy(() => import('./pages/dashboard/ResumeBuilderPage.jsx'));
const AnalysisHistoryPage     = lazy(() => import('./pages/dashboard/AnalysisHistoryPage.jsx'));
const ProfilePage             = lazy(() => import('./pages/dashboard/ProfilePage.jsx'));
const SettingsPage            = lazy(() => import('./pages/dashboard/SettingsPage.jsx'));

// Admin pages
const AdminOverviewPage  = lazy(() => import('./pages/admin/AdminOverviewPage.jsx'));
const AdminUsersPage     = lazy(() => import('./pages/admin/AdminUsersPage.jsx'));
const AdminUsagePage     = lazy(() => import('./pages/admin/AdminUsagePage.jsx'));
const AdminAnalysesPage  = lazy(() => import('./pages/admin/AdminAnalysesPage.jsx'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage.jsx'));

const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner spinner-lg" />
  </div>
);

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ── Public ── */}
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="features"     element={<FeaturesPage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="about"        element={<AboutPage />} />
        <Route path="contact"      element={<ContactPage />} />
        <Route path="faq"          element={<FaqPage />} />
        <Route path="pricing"      element={<PricingPage />} />
      </Route>

      {/* ── Auth ── */}
      <Route element={<AuthLayout />}>
        <Route path="signin"           element={<SignInPage />} />
        <Route path="signup"           element={<SignUpPage />} />
        <Route path="forgot-password"  element={<ForgotPasswordPage />} />
        <Route path="reset-password"   element={<ResetPasswordPage />} />
      </Route>

      {/* ── Dashboard ── */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index                element={<OverviewPage />} />
        <Route path="upload"        element={<ResumeUploadPage />} />
        <Route path="analysis"      element={<ResumeAnalysisPage />} />
        <Route path="ats"           element={<AtsScorePage />} />
        <Route path="skill-gap"     element={<SkillGapPage />} />
        <Route path="job-matcher"   element={<JobMatcherPage />} />
        <Route path="improver"      element={<ResumeImproverPage />} />
        <Route path="career"        element={<CareerRecommendationsPage />} />
        <Route path="interview"     element={<InterviewPrepPage />} />
        <Route path="builder"       element={<ResumeBuilderPage />} />
        <Route path="history"       element={<AnalysisHistoryPage />} />
        <Route path="profile"       element={<ProfilePage />} />
        <Route path="settings"      element={<SettingsPage />} />
      </Route>

      {/* ── Admin ── */}
      <Route
        path="admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index               element={<AdminOverviewPage />} />
        <Route path="users"        element={<AdminUsersPage />} />
        <Route path="usage"        element={<AdminUsagePage />} />
        <Route path="analyses"     element={<AdminAnalysesPage />} />
        <Route path="analytics"    element={<AdminAnalyticsPage />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default App;
