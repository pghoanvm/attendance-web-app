// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Divider,
  Container,
  alpha,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setLocalError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLocalError('');

    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setLocalError(err.message || 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50%',
          left: '-10%',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Card
          sx={{
            maxWidth: 480,
            mx: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15)',
          }}
        >
          <CardContent sx={{ p: 5 }}>
            {/* Logo & Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }}
              >
                <LockIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                variant="h4"
                fontWeight="800"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                VM School System
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Hệ thống điểm danh thông minh
              </Typography>
            </Box>

            {/* Error Alert */}
            {(error || localError) && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: 24,
                  },
                }}
                onClose={() => setLocalError('')}
              >
                {localError || error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleEmailLogin}>
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  placeholder="teacher@school.edu.vn"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.75,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.35)',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(102, 126, 234, 0.45)',
                    },
                  }}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </Stack>
            </form>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Hoặc
              </Typography>
            </Divider>

            {/* Google Login */}
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                py: 1.75,
                fontSize: '1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: alpha('#6366F1', 0.08),
                },
              }}
            >
              Đăng nhập với Google
            </Button>

            {/* Demo Account */}
            <Box
              sx={{
                mt: 3,
                p: 2.5,
                bgcolor: alpha('#6366F1', 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha('#6366F1', 0.15)}`,
              }}
            >
              <Typography
                variant="caption"
                color="primary"
                display="block"
                fontWeight={700}
                gutterBottom
                sx={{ fontSize: '0.8125rem' }}
              >
                🎯 Tài khoản demo:
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  📧 Email: demo@attendance.vn
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  🔑 Password: demo123456
                </Typography>
              </Stack>
            </Box>

            {/* Footer */}
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              mt={3}
              fontWeight={500}
            >
              © 2024 Attendance App - All rights reserved
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
