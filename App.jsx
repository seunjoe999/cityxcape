import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/auth/AuthScreen';
import SetupScreen from './components/auth/SetupScreen';
import RoleBanner from './components/shared/RoleBanner';
import { FullSplash } from './components/shared/UI';
import AdminPortal from './components/admin/AdminPortal';
import ModeratorPortal from './components/moderator/ModeratorPortal';
import GuestPortal from './components/guest/GuestPortal';

function AppContent() {
  const { isAuthenticated, profile, role, loading, isSupabaseConfigured } = useAuth();

  if (!isSupabaseConfigured) return <SetupScreen />;
  if (loading) return <FullSplash label="Connecting…" />;
  if (!isAuthenticated) return <AuthScreen />;
  // Authenticated but profile still hydrating
  if (!profile) return <FullSplash label="Loading your account…" />;

  return (
    <div className="relative min-h-screen bg-[#f5f7fb]">
      <RoleBanner role={role} />
      <div className="pt-9">
        {role === 'superadmin' && <AdminPortal />}
        {role === 'moderator' && <ModeratorPortal />}
        {role === 'guest' && <GuestPortal />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
