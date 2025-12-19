// src/App.tsx - UPDATED WITH NEW ROUTES
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

// Import theme
import { theme } from './theme/theme';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { UserRole } from './types';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={3000}
          sx={{
            '& .SnackbarItem-variantSuccess': {
              background: 'linear-gradient(135deg, #a8edea 0%, #10b981 100%)',
              fontWeight: 600,
            },
            '& .SnackbarItem-variantError': {
              background: 'linear-gradient(135deg, #ff9a9e 0%, #ef4444 100%)',
              fontWeight: 600,
            },
            '& .SnackbarItem-variantInfo': {
              background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
              fontWeight: 600,
            },
            '& .SnackbarItem-variantWarning': {
              background: 'linear-gradient(135deg, #fbc2eb 0%, #f59e0b 100%)',
              fontWeight: 600,
            },
          }}
        >
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />

                {/* Admin only routes */}
                <Route
                  path="users"
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Redirect all other routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
