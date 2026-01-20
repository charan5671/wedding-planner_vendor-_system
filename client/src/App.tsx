import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { VendorSearch } from './pages/VendorSearch';
import { VendorDetail } from './pages/VendorDetail';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { NegotiationRoom } from './pages/NegotiationRoom';
import { AdminDashboard } from './pages/admin/Dashboard';
import { VendorManager } from './pages/admin/VendorManager';
import { UserManager } from './pages/admin/UserManager';
import { BookingManager } from './pages/admin/BookingManager';
import { AdminSettings } from './pages/admin/Settings';
import { VendorLayout } from './layouts/VendorLayout';
import { VendorDashboard } from './pages/vendor/Dashboard';
import { ServiceEditor } from './pages/vendor/ServiceEditor';
import { InquiryList } from './pages/vendor/InquiryList';
import { VendorBookings } from './pages/vendor/Bookings';
import { VendorProfile } from './pages/vendor/Profile';

// import { isFirebaseConfigured } from './lib/firebase';

import { PublicLayout } from './layouts/PublicLayout';

import { ReportManager } from './pages/admin/ReportManager';
import { Dashboard } from './pages/Dashboard';

// Route protection components
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!user) return <Login />;

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-bold font-serif text-slate-900">Access Denied</h1>
          <p className="text-slate-600">You do not have permission to view this page. If you believe this is an error, please contact support.</p>
          <a href="/" className="inline-block text-primary-600 hover:underline font-semibold">Return Home</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/vendors" element={<VendorSearch />} />
            <Route path="/vendors/:id" element={<VendorDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Negotiation Room (Can be public-ish but needs auth) */}
            <Route path="/negotiation/:id" element={
              <ProtectedRoute>
                <NegotiationRoom />
              </ProtectedRoute>
            } />
          </Route>

          {/* Admin Routes (Independent Layout) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="vendors" element={<VendorManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="bookings" element={<BookingManager />} />
            <Route path="reports" element={<ReportManager />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Vendor Routes (Independent Layout) */}
          <Route path="/vendor" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="services" element={<ServiceEditor />} />
            <Route path="enquiries" element={<InquiryList />} />
            <Route path="bookings" element={<VendorBookings />} />
            <Route path="profile" element={<VendorProfile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
