import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage }     from './pages/auth/LoginPage';
import { RegisterPage }  from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { LeadsPage }     from './pages/leads/LeadsPage';
import { NotFoundPage }  from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/leads"     element={<LeadsPage />} />
              </Route>
            </Route>

            {/* Redirects */}
            <Route path="/"   element={<Navigate to="/dashboard" replace />} />
            <Route path="*"   element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg, #fff)',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 24px -4px rgba(0,0,0,0.12)',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
