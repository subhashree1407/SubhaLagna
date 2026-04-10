import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateProfile from './components/CreateProfile';
import ProfileDashboard from './components/ProfileDashboard';
import MatchResults from './components/MatchResults';
import ProfileDetail from './components/ProfileDetail';
import PremiumMembership from './components/PremiumMembership';

// 1. Unauthenticated users allowed here (Home, Login, Signup)
const GuestRoute = ({ children }) => {
  const { token, user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!token) return children; // Guest

  // Logged in
  if (user && !user.hasProfile) return <Navigate to="/create-profile" replace />;
  return <Navigate to="/matches" replace />;
};

// 2. Used only for the secondary step: CreateProfile
const OnboardRoute = ({ children }) => {
  const { token, user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />; // Must be raw-registered
  if (user && user.hasProfile) return <Navigate to="/matches" replace />; // Already onboarded!
  return children;
};

// 3. Fully Logged In & Profile Configured (Dashboards)
const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center p-8 text-gray-500 font-medium">Authenticating...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (user && !user.hasProfile) return <Navigate to="/create-profile" replace />; // Force configuration stop
  return children;
};

// 4. Shared layout for internal dashboard/auth screens
const AppLayout = () => (
  <>
    {/* Decorative background blobs to enhance the gradient */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

    <Header />

    <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10">
      <Outlet />
    </main>

    {/* <footer className="w-full py-4 text-center text-gray-400 text-sm font-medium z-10 glass-panel border-t border-gray-200/50 mt-auto relative">
      &copy; {new Date().getFullYear()} SubhaLagna | Private Matrimonial Platform
    </footer> */}
  </>
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative flex flex-col font-sans">
          <Routes>
            {/* Marketing Landing */}
            <Route path="/" element={<Home />} />

            {/* Standard Dashboard/Auth Layout Wrapper */}
            <Route element={<AppLayout />}>
              {/* Step 1 Account Credentials */}
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

              {/* Step 2 Profile Config Lock */}
              <Route path="/create-profile" element={<OnboardRoute><CreateProfile /></OnboardRoute>} />

              {/* Full Access */}
              <Route path="/profile" element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />
              <Route path="/premium" element={<ProtectedRoute><PremiumMembership /></ProtectedRoute>} />
            </Route>

            {/* Standalone Route without AppLayout Padding */}
            <Route path="/matches" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><ProfileDetail /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
