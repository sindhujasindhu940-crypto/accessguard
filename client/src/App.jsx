import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VisitorForm from './pages/VisitorForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';
import FacultyDashboard from './pages/FacultyDashboard';
import DigitalPass from './pages/DigitalPass';
import VisitorDashboard from './pages/VisitorDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/visitor-request" element={<VisitorForm />} />
        </Route>
        
        {/* Pass Render Route (Can be standalone without MainLayout headers) */}
        <Route path="/pass/:passId" element={<DigitalPass />} />

        {/* Protected Routes */}
        <Route element={<MainLayout requireAuth={true} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/faculty/requests" element={<FacultyDashboard />} />
          <Route path="/visitor/dashboard" element={<VisitorDashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
