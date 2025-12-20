// src/pages/Reports.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  CardContent,
  Typography,
  Grid,
  Stack,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  alpha,
  Paper,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Assessment,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format, subDays, startOfWeek } from 'date-fns';
import * as XLSX from 'xlsx';
import GlassCard from '../components/GlassCard';
import GradientIcon from '../components/GradientIcon';

// const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1'];
// const GRADIENTS = [
//   'linear-gradient(135deg, #a8edea 0%, #10b981 100%)',
//   'linear-gradient(135deg, #ff9a9e 0%, #ef4444 100%)',
//   'linear-gradient(135deg, #fbc2eb 0%, #f59e0b 100%)',
//   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// ];

interface ChartData {
  name: string;
  present: number;
  absent: number;
  late: number;
  date?: string;
}

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('week');
  const [selectedClass, setSelectedClass] = useState('all');
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]);
  const [barChartData, setBarChartData] = useState<ChartData[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgRate: 0,
    trend: 0,
  });

  useEffect(() => {
    fetchReportData();
  }, [reportType, selectedClass]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      let startDate: Date;
      const endDate = new Date();

      switch (reportType) {
        case 'week':
          startDate = startOfWeek(new Date());
          break;
        case 'month':
          startDate = subDays(new Date(), 30);
          break;
        case 'year':
          startDate = subDays(new Date(), 365);
          break;
        default:
          startDate = subDays(new Date(), 7);
      }

      let q = query(
        collection(db, 'attendance'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate))
      );

      if (selectedClass !== 'all') {
        q = query(q, where('class', '==', selectedClass));
      }

      const snapshot = await getDocs(q);
      const records = snapshot.docs.map((doc) => ({
        ...doc.data(),
        date: doc.data().date?.toDate(),
      }));

      const uniqueClasses = Array.from(new Set(records.map((r: any) => r.class)));
      setClasses(uniqueClasses as string[]);

      // Line chart data
      const dateMap = new Map<string, ChartData>();
      records.forEach((record: any) => {
        const dateKey = format(record.date, 'yyyy-MM-dd');
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            name: format(record.date, 'dd/MM'),
            date: dateKey,
            present: 0,
            absent: 0,
            late: 0,
          });
        }
        const data = dateMap.get(dateKey)!;
        if (record.status === 'present') data.present++;
        else if (record.status === 'absent') data.absent++;
        else if (record.status === 'late') data.late++;
      });

      const lineData = Array.from(dateMap.values()).sort((a, b) => a.date!.localeCompare(b.date!));
      setLineChartData(lineData);

      // Bar chart data
      if (selectedClass === 'all') {
        const classMap = new Map<string, ChartData>();
        records.forEach((record: any) => {
          const className = record.class;
          if (!classMap.has(className)) {
            classMap.set(className, {
              name: className,
              present: 0,
              absent: 0,
              late: 0,
            });
          }
          const data = classMap.get(className)!;
          if (record.status === 'present') data.present++;
          else if (record.status === 'absent') data.absent++;
          else if (record.status === 'late') data.late++;
        });
        setBarChartData(Array.from(classMap.values()));
      }

      // Pie chart data
      const statusCount = { present: 0, absent: 0, late: 0, excused: 0 };
      records.forEach((record: any) => {
        if (statusCount[record.status as keyof typeof statusCount] !== undefined) {
          statusCount[record.status as keyof typeof statusCount]++;
        }
      });

      const pieData = [
        { name: 'Có mặt', value: statusCount.present, color: '#10B981' },
        { name: 'Vắng', value: statusCount.absent, color: '#EF4444' },
        { name: 'Muộn', value: statusCount.late, color: '#F59E0B' },
        { name: 'Có phép', value: statusCount.excused, color: '#6366F1' },
      ].filter((item) => item.value > 0);
      setPieChartData(pieData);

      // Calculate stats
      const totalRecords = records.length;
      const avgRate = totalRecords > 0 ? (statusCount.present / totalRecords) * 100 : 0;

      setStats({
        totalSessions: dateMap.size,
        avgRate,
        trend: Math.random() > 0.5 ? 5.2 : -2.1, // Mock trend
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    const exportData = lineChartData.map((item) => ({
      Ngày: item.name,
      'Có mặt': item.present,
      Vắng: item.absent,
      Muộn: item.late,
      Tổng: item.present + item.absent + item.late,
      'Tỷ lệ (%)': ((item.present / (item.present + item.absent + item.late)) * 100).toFixed(1),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo điểm danh');
    const filename = `BaoCao_${reportType}_${format(new Date(), 'yyyyMMdd')}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Assessment sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Báo cáo & Thống kê
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Phân tích dữ liệu điểm danh chi tiết
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <GlassCard variant="gradient">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GradientIcon
                  icon={<Assessment />}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  size={28}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Tổng buổi học
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="primary">
                    {stats.totalSessions}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <GlassCard variant="gradient">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GradientIcon
                  icon={<TrendingUp />}
                  gradient="linear-gradient(135deg, #a8edea 0%, #10b981 100%)"
                  size={28}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Tỷ lệ trung bình
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="success.main">
                    {stats.avgRate.toFixed(1)}%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <GlassCard variant="gradient">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GradientIcon
                  icon={stats.trend > 0 ? <TrendingUp /> : <TrendingDown />}
                  gradient={
                    stats.trend > 0
                      ? 'linear-gradient(135deg, #a8edea 0%, #10b981 100%)'
                      : 'linear-gradient(135deg, #ff9a9e 0%, #ef4444 100%)'
                  }
                  size={28}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Xu hướng
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    color={stats.trend > 0 ? 'success.main' : 'error.main'}
                  >
                    {stats.trend > 0 ? '+' : ''}
                    {stats.trend}%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Filters */}
      <GlassCard variant="gradient" sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
          >
            <Stack direction="row" spacing={2}>
              <TextField
                label="Khoảng thời gian"
                select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="week">Tuần này</MenuItem>
                <MenuItem value="month">Tháng này</MenuItem>
                <MenuItem value="year">Năm này</MenuItem>
              </TextField>
              <TextField
                label="Lớp"
                select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
                sx={{ fontWeight: 600 }}
              >
                In
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportExcel}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Xuất Excel
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </GlassCard>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Line Chart */}
        <Grid item xs={12}>
          <GlassCard variant="gradient">
            <CardContent>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                📈 Xu hướng điểm danh theo thời gian
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#6B7280', 0.2)} />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    style={{ fontSize: '0.875rem', fontWeight: 600 }}
                  />
                  <YAxis stroke="#6B7280" style={{ fontSize: '0.875rem', fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
                      fontWeight: 600,
                    }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 600 }} />
                  <Line
                    type="monotone"
                    dataKey="present"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Có mặt"
                    dot={{ fill: '#10B981', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    stroke="#EF4444"
                    strokeWidth={3}
                    name="Vắng"
                    dot={{ fill: '#EF4444', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="late"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    name="Muộn"
                    dot={{ fill: '#F59E0B', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Bar Chart */}
        {selectedClass === 'all' && barChartData.length > 0 && (
          <Grid item xs={12} md={7}>
            <GlassCard variant="gradient">
              <CardContent>
                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                  📊 So sánh theo lớp
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha('#6B7280', 0.2)} />
                    <XAxis
                      dataKey="name"
                      stroke="#6B7280"
                      style={{ fontSize: '0.875rem', fontWeight: 600 }}
                    />
                    <YAxis stroke="#6B7280" style={{ fontSize: '0.875rem', fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: 'none',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
                        fontWeight: 600,
                      }}
                    />
                    <Legend wrapperStyle={{ fontWeight: 600 }} />
                    <Bar dataKey="present" fill="#10B981" name="Có mặt" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="absent" fill="#EF4444" name="Vắng" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="late" fill="#F59E0B" name="Muộn" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </GlassCard>
          </Grid>
        )}

        {/* Pie Chart */}
        <Grid item xs={12} md={selectedClass === 'all' && barChartData.length > 0 ? 5 : 12}>
          <GlassCard variant="gradient">
            <CardContent>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                🥧 Phân bố trạng thái
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Summary */}
        <Grid item xs={12}>
          <GlassCard variant="gradient">
            <CardContent>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                📋 Tổng kết chi tiết
              </Typography>
              <Grid container spacing={2}>
                {pieChartData.map((item, _index) => (
                  <Grid item xs={6} sm={3} key={item.name}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: `${item.color}10`,
                        border: `2px solid ${alpha(item.color, 0.3)}`,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 24px ${alpha(item.color, 0.25)}`,
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                        gutterBottom
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="h3" fontWeight="800" sx={{ color: item.color, mb: 1 }}>
                        {item.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {(
                          (item.value / pieChartData.reduce((sum, d) => sum + d.value, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
