import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import NewClass from './pages/NewClass';
import ClassProfile from './pages/ClassProfile';
import AddLearners from './pages/AddLearners';
import CollectiveObservation from './pages/CollectiveObservation';
import ClassMap from './pages/ClassMap';
import NeedGroups from './pages/NeedGroups';
import SessionPlan from './pages/SessionPlan';
import Reports from './pages/Reports';
import LearnerProfile from './pages/LearnerProfile';
import Settings from './pages/Settings';
import PrintableReport from './pages/PrintableReport';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/new" element={<NewClass />} />
          <Route path="/classes/:classId" element={<ClassProfile />} />
          <Route path="/classes/:classId/add-learners" element={<AddLearners />} />
          <Route path="/classes/:classId/observe" element={<CollectiveObservation />} />
          <Route path="/classes/:classId/observe/:observationId" element={<CollectiveObservation />} />
          <Route path="/classes/:classId/map" element={<ClassMap />} />
          <Route path="/classes/:classId/groups" element={<NeedGroups />} />
          <Route path="/classes/:classId/session-plan" element={<SessionPlan />} />
          <Route path="/classes/:classId/reports" element={<Reports />} />
          <Route path="/learners/:learnerId" element={<LearnerProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/classes/:classId/print" element={<PrintableReport />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App