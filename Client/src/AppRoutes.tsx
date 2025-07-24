import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import Dashboard from './pages/Dashboard';
import LeaseUpload from './pages/LeaseUpload';
import AuthForm from './components/AuthForm';
import NotFoundPage from './pages/NotFoundPage';
import LeaseReview from './pages/LeaseReview';
import { useAuthStore } from './store/useAuthStore';

function AppRoutes() {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={!user ? <AuthForm /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <AuthForm /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/lease-review" element={user ? <LeaseReview /> : <Navigate to="/login" replace />} />
      <Route path="/upload" element={user ? <LeaseUpload /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
