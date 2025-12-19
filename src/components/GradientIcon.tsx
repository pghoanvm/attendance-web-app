// src/components/GradientIcon.tsx
import { Box, SxProps, Theme } from '@mui/material';
import { ReactElement, cloneElement } from 'react';

interface GradientIconProps {
  icon: ReactElement;
  gradient: string;
  size?: number;
  sx?: SxProps<Theme>;
}

export default function GradientIcon({ icon, gradient, size = 32, sx }: GradientIconProps) {
  return (
    <Box
      sx={{
        width: size * 1.75,
        height: size * 1.75,
        borderRadius: 3,
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
        ...sx,
      }}
    >
      {cloneElement(icon, {
        sx: { fontSize: size, color: 'white' },
      })}
    </Box>
  );
}
