import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-100 dark:bg-slate-900">
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthForm />;
};

const App = () => (
  <AuthProvider>
    <Toaster position="top-right" />
    <AppContent />
  </AuthProvider>
);

export default App;
