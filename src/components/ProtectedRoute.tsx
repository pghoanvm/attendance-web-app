// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ fontSize: 64 }}>🔒</Box>
        <Box sx={{ fontSize: 24, fontWeight: 700 }}>Không có quyền truy cập</Box>
        <Box sx={{ color: 'text.secondary' }}>Bạn không có quyền truy cập trang này</Box>
      </Box>
    );
  }

  return <>{children}</>;
}
