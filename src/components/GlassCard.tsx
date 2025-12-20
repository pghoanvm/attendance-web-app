// src/components/GlassCard.tsx - FIXED VERSION
import { Card, CardProps, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom variant type (không conflict với MUI Card variant)
type GlassVariant = 'default' | 'gradient' | 'outlined';

interface GlassCardProps extends Omit<CardProps, 'variant'> {
  variant?: GlassVariant;
  elevation?: number;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'glassVariant',
})<{ glassVariant?: GlassVariant }>(({ theme, glassVariant = 'default' }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 20,

  ...(glassVariant === 'default' && {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
  }),

  ...(glassVariant === 'gradient' && {
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 254, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.12)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    },
  }),

  ...(glassVariant === 'outlined' && {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)',
  }),

  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
  },
}));

export default function GlassCard({ children, variant = 'default', ...props }: GlassCardProps) {
  return (
    <StyledCard glassVariant={variant} {...props}>
      {children}
    </StyledCard>
  );
}
