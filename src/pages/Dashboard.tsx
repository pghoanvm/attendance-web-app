// src/pages/DashboardDemo.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  alpha,
  Badge,
} from '@mui/material';
import {
  People,
  CheckCircle,
  Cancel,
  TrendingUp,
  School,
  FiberManualRecord,
  AccessTime,
} from '@mui/icons-material';
import { format } from 'date-fns';
import MockDataService from '../services/mockData.service';
import type { AttendanceRecord, AttendanceStats } from '../types';

// Styled components (inline để demo dễ)
const GlassCard = ({ children, ...props }: any) => (
  <Card
    {...props}
    sx={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 4,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${alpha('#6366F1', 0.1)}`,
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      },
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)',
      },
      ...props.sx,
    }}
  >
    {children}
  </Card>
);

const GradientIcon = ({ icon, gradient, size = 32 }: any) => (
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
      flexShrink: 0,
    }}
  >
    {icon}
  </Box>
);

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: { value: string; isPositive: boolean };
  isLive?: boolean;
}

function StatCard({ title, value, subtitle, icon, gradient, trend, isLive }: StatCardProps) {
  return (
    <GlassCard sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}
              >
                {title}
              </Typography>
              {isLive && (
                <Chip
                  icon={<FiberManualRecord sx={{ fontSize: 8, animation: 'pulse 2s infinite' }} />}
                  label="NEW"
                  size="small"
                  sx={{
                    height: 20,
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />
              )}
            </Stack>
            <Typography
              variant="h3"
              fontWeight="800"
              sx={{
                mb: 0.5,
                background: gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                {trend.isPositive ? (
                  <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                ) : (
                  <TrendingUp
                    sx={{ fontSize: 18, color: 'error.main', transform: 'rotate(180deg)' }}
                  />
                )}
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                >
                  {trend.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  so với tuần trước
                </Typography>
              </Stack>
            )}
          </Box>
          <GradientIcon icon={icon} gradient={gradient} size={28} />
        </Stack>
      </CardContent>
    </GlassCard>
  );
}

export default function DashboardDemo() {
  const [_records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Load mock data
    const mockRecords = MockDataService.generateMockAttendance();
    setRecords(mockRecords);

    const mockStats = MockDataService.calculateStats(mockRecords);
    setStats(mockStats);

    const mockActivities = MockDataService.getRecentActivities(mockRecords, 5);
    setActivities(mockActivities);

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      const newRecord = MockDataService.addRealtimeRecord();
      setRecords((prev) => [newRecord, ...prev]);

      const updatedStats = MockDataService.calculateStats([newRecord, ...mockRecords]);
      setStats(updatedStats);

      const updatedActivities = MockDataService.getRecentActivities([newRecord, ...mockRecords], 5);
      setActivities(updatedActivities);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 5,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Badge
            badgeContent="NEW"
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                animation: 'pulse 2s infinite',
                fontWeight: 700,
              },
            }}
          >
            <School sx={{ fontSize: 48 }} />
          </Badge>
          <Box>
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Chào mừng! Hôm nay là {format(new Date(), 'dd/MM/yyyy')}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng học sinh"
            value={stats.totalStudents}
            icon={<People sx={{ color: 'white', fontSize: 28 }} />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            isLive
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Có mặt hôm nay"
            value={stats.todayPresent}
            subtitle={`${stats.todayRate.toFixed(1)}% tỷ lệ`}
            icon={<CheckCircle sx={{ color: 'white', fontSize: 28 }} />}
            gradient="linear-gradient(135deg, #a8edea 0%, #10b981 100%)"
            trend={{ value: '+5.2%', isPositive: true }}
            isLive
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vắng hôm nay"
            value={stats.todayAbsent}
            subtitle={`${(100 - stats.todayRate).toFixed(1)}% tỷ lệ`}
            icon={<Cancel sx={{ color: 'white', fontSize: 28 }} />}
            gradient="linear-gradient(135deg, #ff9a9e 0%, #ef4444 100%)"
            trend={{ value: '-2.1%', isPositive: true }}
            isLive
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tuần này"
            value={`${stats.weekRate.toFixed(1)}%`}
            subtitle={`${stats.weekPresent} lượt có mặt`}
            icon={<TrendingUp sx={{ color: 'white', fontSize: 28 }} />}
            gradient="linear-gradient(135deg, #fbc2eb 0%, #f59e0b 100%)"
            trend={{ value: '+3.5%', isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Recent Activity & Quick Stats */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <GradientIcon
                  icon={<AccessTime sx={{ color: 'white', fontSize: 24 }} />}
                  gradient="linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
                  size={24}
                />
                <Typography variant="h6" fontWeight="700">
                  Hoạt động gần đây
                </Typography>
                <Chip
                  icon={<FiberManualRecord sx={{ fontSize: 8 }} />}
                  label="Cloud"
                  size="small"
                  sx={{
                    ml: 'auto',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    animation: 'pulse 2s ease-in-out infinite',
                    '& .MuiChip-icon': { color: 'white' },
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                    },
                  }}
                />
              </Stack>

              {activities.length > 0 ? (
                <Stack spacing={2}>
                  {activities.map((activity, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: activity.isNew ? alpha('#f5576c', 0.3) : alpha('#6366F1', 0.1),
                        background: activity.isNew
                          ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.05) 0%, rgba(240, 147, 251, 0.05) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,254,0.9) 100%)',
                        transition: 'all 0.3s ease',
                        animation: activity.isNew ? 'fadeInScale 0.5s ease' : 'none',
                        '&:hover': {
                          borderColor: alpha('#6366F1', 0.3),
                          transform: 'translateX(8px)',
                          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
                        },
                        '@keyframes fadeInScale': {
                          '0%': { opacity: 0, transform: 'scale(0.95)' },
                          '100%': { opacity: 1, transform: 'scale(1)' },
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Badge
                            badgeContent={activity.isNew ? 'NEW' : null}
                            color="error"
                            sx={{
                              '& .MuiBadge-badge': {
                                fontWeight: 700,
                                fontSize: '0.65rem',
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: activity.isNew
                                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                              }}
                            >
                              {activity.class}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                              Lớp {activity.class}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip
                                label={activity.date}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  bgcolor: alpha('#6366F1', 0.1),
                                  color: 'primary.main',
                                }}
                              />
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                • {activity.time}
                              </Typography>
                              {activity.teacher && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  fontWeight={600}
                                >
                                  • {activity.teacher}
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                        </Stack>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="h5"
                            fontWeight="800"
                            sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {activity.present}/{activity.total}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {((activity.present / activity.total) * 100).toFixed(1)}% có mặt
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                  <School sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Chưa có hoạt động nào
                  </Typography>
                  <Typography variant="body2">Dữ liệu</Typography>
                </Box>
              )}
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Monthly Stats */}
        <Grid item xs={12} md={4}>
          <GlassCard>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <GradientIcon
                  icon={<School sx={{ color: 'white', fontSize: 24 }} />}
                  gradient="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
                  size={24}
                />
                <Typography variant="h6" fontWeight="700">
                  Tháng này
                </Typography>
              </Stack>

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Tỷ lệ điểm danh
                  </Typography>
                  <Typography variant="h6" fontWeight="800" color="primary">
                    {stats.monthRate.toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={stats.monthRate}
                  sx={{
                    height: 10,
                    borderRadius: 10,
                    bgcolor: alpha('#6366F1', 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 10,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    },
                  }}
                />
              </Box>

              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#10B981', 0.08),
                    border: `1px solid ${alpha('#10B981', 0.2)}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Có mặt
                    </Typography>
                    <Typography variant="h6" fontWeight="800" color="success.main">
                      {stats.monthPresent}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#EF4444', 0.08),
                    border: `1px solid ${alpha('#EF4444', 0.2)}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Vắng
                    </Typography>
                    <Typography variant="h6" fontWeight="800" color="error.main">
                      {stats.totalStudents * 30 - stats.monthPresent}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#6366F1', 0.08),
                    border: `1px solid ${alpha('#6366F1', 0.2)}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Tổng buổi
                    </Typography>
                    <Typography variant="h6" fontWeight="800" color="primary">
                      22
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
