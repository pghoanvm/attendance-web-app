// src/theme/theme.ts
import { createTheme, alpha } from '@mui/material/styles';

// Brand Colors
const brandColors = {
  primary: {
    main: '#6366F1', // Indigo
    light: '#818CF8',
    dark: '#4F46E5',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  secondary: {
    main: '#EC4899', // Pink
    light: '#F472B6',
    dark: '#DB2777',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  success: {
    main: '#10B981', // Green
    light: '#34D399',
    dark: '#059669',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  warning: {
    main: '#F59E0B', // Orange
    light: '#FBBF24',
    dark: '#D97706',
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  },
  error: {
    main: '#EF4444', // Red
    light: '#F87171',
    dark: '#DC2626',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
  info: {
    main: '#3B82F6', // Blue
    light: '#60A5FA',
    dark: '#2563EB',
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  },
};

// Create theme
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primary.main,
      light: brandColors.primary.light,
      dark: brandColors.primary.dark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brandColors.secondary.main,
      light: brandColors.secondary.light,
      dark: brandColors.secondary.dark,
      contrastText: '#FFFFFF',
    },
    success: {
      main: brandColors.success.main,
      light: brandColors.success.light,
      dark: brandColors.success.dark,
      contrastText: '#FFFFFF',
    },
    warning: {
      main: brandColors.warning.main,
      light: brandColors.warning.light,
      dark: brandColors.warning.dark,
      contrastText: '#FFFFFF',
    },
    error: {
      main: brandColors.error.main,
      light: brandColors.error.light,
      dark: brandColors.error.dark,
      contrastText: '#FFFFFF',
    },
    info: {
      main: brandColors.info.main,
      light: brandColors.info.light,
      dark: brandColors.info.dark,
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    divider: alpha('#6B7280', 0.12),
  },
  typography: {
    fontFamily:
      '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.9375rem',
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(99, 102, 241, 0.05)',
    '0px 4px 8px rgba(99, 102, 241, 0.08)',
    '0px 8px 16px rgba(99, 102, 241, 0.1)',
    '0px 12px 24px rgba(99, 102, 241, 0.12)',
    '0px 16px 32px rgba(99, 102, 241, 0.14)',
    '0px 20px 40px rgba(99, 102, 241, 0.16)',
    '0px 24px 48px rgba(99, 102, 241, 0.18)',
    '0px 28px 56px rgba(99, 102, 241, 0.2)',
    '0px 32px 64px rgba(99, 102, 241, 0.22)',
    '0px 36px 72px rgba(99, 102, 241, 0.24)',
    '0px 40px 80px rgba(99, 102, 241, 0.26)',
    '0px 44px 88px rgba(99, 102, 241, 0.28)',
    '0px 48px 96px rgba(99, 102, 241, 0.3)',
    '0px 52px 104px rgba(99, 102, 241, 0.32)',
    '0px 56px 112px rgba(99, 102, 241, 0.34)',
    '0px 60px 120px rgba(99, 102, 241, 0.36)',
    '0px 64px 128px rgba(99, 102, 241, 0.38)',
    '0px 68px 136px rgba(99, 102, 241, 0.4)',
    '0px 72px 144px rgba(99, 102, 241, 0.42)',
    '0px 76px 152px rgba(99, 102, 241, 0.44)',
    '0px 80px 160px rgba(99, 102, 241, 0.46)',
    '0px 84px 168px rgba(99, 102, 241, 0.48)',
    '0px 88px 176px rgba(99, 102, 241, 0.5)',
    '0px 92px 184px rgba(99, 102, 241, 0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 24px rgba(99, 102, 241, 0.25)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: brandColors.primary.gradient,
          '&:hover': {
            background: brandColors.primary.gradient,
            boxShadow: '0px 12px 32px rgba(99, 102, 241, 0.35)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: brandColors.primary.main,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: alpha(brandColors.primary.main, 0.08),
          },
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 4px 20px rgba(99, 102, 241, 0.08)',
          border: `1px solid ${alpha('#6366F1', 0.08)}`,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.9)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 32px rgba(99, 102, 241, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(99, 102, 241, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 4px 16px rgba(99, 102, 241, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 8px 24px rgba(99, 102, 241, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: alpha('#FFFFFF', 0.8),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: brandColors.primary.light,
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              boxShadow: `0 0 0 4px ${alpha(brandColors.primary.main, 0.1)}`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.8125rem',
        },
        filled: {
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#6B7280', 0.08)}`,
        },
        head: {
          fontWeight: 600,
          backgroundColor: alpha(brandColors.primary.main, 0.04),
          color: brandColors.primary.dark,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${alpha('#6B7280', 0.08)}`,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 12px rgba(99, 102, 241, 0.08)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            background: brandColors.primary.gradient,
            color: '#FFFFFF',
            '&:hover': {
              background: brandColors.primary.gradient,
            },
            '& .MuiListItemIcon-root': {
              color: '#FFFFFF',
            },
          },
          '&:hover': {
            backgroundColor: alpha(brandColors.primary.main, 0.08),
          },
        },
      },
    },
  },
});

// Export brand colors for use in components
export { brandColors };
