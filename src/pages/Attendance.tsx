// src/pages/Attendance.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Avatar,
  CircularProgress,
  alpha,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  HowToReg,
  CalendarToday,
  TrendingUp,
  EventNote,
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AttendanceRecord, AttendanceStatus } from '../types';
import { format, startOfDay, endOfDay } from 'date-fns';
import GlassCard from '../components/GlassCard';
import GradientIcon from '../components/GradientIcon';

const statusConfig = {
  present: {
    label: 'Có mặt',
    color: 'success',
    icon: <CheckCircle />,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #10b981 100%)',
  },
  absent: {
    label: 'Vắng',
    color: 'error',
    icon: <Cancel />,
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #ef4444 100%)',
  },
  late: {
    label: 'Muộn',
    color: 'warning',
    icon: <AccessTime />,
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #f59e0b 100%)',
  },
  excused: {
    label: 'Có phép',
    color: 'info',
    icon: <HowToReg />,
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  },
};

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | 'all'>('all');

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  useEffect(() => {
    filterRecords();
  }, [records, selectedClass, selectedStatus]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const date = new Date(selectedDate);
      const startDate = startOfDay(date);
      const endDate = endOfDay(date);

      const q = query(
        collection(db, 'attendance'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as AttendanceRecord[];

      setRecords(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];

    if (selectedClass !== 'all') {
      filtered = filtered.filter((r) => r.class === selectedClass);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    setFilteredRecords(filtered);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get unique classes
  const classes = Array.from(new Set(records.map((r) => r.class)));

  // Calculate stats
  const stats = {
    total: filteredRecords.length,
    present: filteredRecords.filter((r) => r.status === 'present').length,
    absent: filteredRecords.filter((r) => r.status === 'absent').length,
    late: filteredRecords.filter((r) => r.status === 'late').length,
    excused: filteredRecords.filter((r) => r.status === 'excused').length,
  };

  const attendanceRate = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;

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
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <EventNote sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Lịch sử điểm danh
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Xem và quản lý lịch sử điểm danh
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Filters */}
      <GlassCard variant="gradient" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ngày"
                type="date"
                fullWidth
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Lớp"
                select
                fullWidth
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {classes.map((cls: string) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Trạng thái"
                select
                fullWidth
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as AttendanceStatus | 'all')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="present">Có mặt</MenuItem>
                <MenuItem value="absent">Vắng</MenuItem>
                <MenuItem value="late">Muộn</MenuItem>
                <MenuItem value="excused">Có phép</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </GlassCard>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <GlassCard variant="gradient">
            <CardContent sx={{ textAlign: 'center' }}>
              <GradientIcon
                icon={<CalendarToday />}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                size={24}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                Tổng số
              </Typography>
              <Typography variant="h4" fontWeight="800" color="primary">
                {stats.total}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <GlassCard variant="gradient">
            <CardContent sx={{ textAlign: 'center' }}>
              <GradientIcon
                icon={<CheckCircle />}
                gradient={statusConfig.present.gradient}
                size={24}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                Có mặt
              </Typography>
              <Typography variant="h4" fontWeight="800" color="success.main">
                {stats.present}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <GlassCard variant="gradient">
            <CardContent sx={{ textAlign: 'center' }}>
              <GradientIcon
                icon={<Cancel />}
                gradient={statusConfig.absent.gradient}
                size={24}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                Vắng
              </Typography>
              <Typography variant="h4" fontWeight="800" color="error.main">
                {stats.absent}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <GlassCard variant="gradient">
            <CardContent sx={{ textAlign: 'center' }}>
              <GradientIcon
                icon={<AccessTime />}
                gradient={statusConfig.late.gradient}
                size={24}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                Muộn
              </Typography>
              <Typography variant="h4" fontWeight="800" color="warning.main">
                {stats.late}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <GlassCard variant="gradient">
            <CardContent sx={{ textAlign: 'center' }}>
              <GradientIcon
                icon={<TrendingUp />}
                gradient="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
                size={24}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                Tỷ lệ
              </Typography>
              <Typography variant="h4" fontWeight="800" color="info.main">
                {attendanceRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <GlassCard variant="gradient" sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="700">
              Tỷ lệ điểm danh hôm nay
            </Typography>
            <Typography variant="h5" fontWeight="800" color="primary">
              {attendanceRate.toFixed(1)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={attendanceRate}
            sx={{
              height: 12,
              borderRadius: 10,
              bgcolor: alpha('#6366F1', 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 10,
                background: 'linear-gradient(90deg, #a8edea 0%, #10b981 100%)',
              },
            }}
          />
          <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: statusConfig.present.gradient,
                }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Có mặt: {stats.present}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: statusConfig.absent.gradient,
                }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Vắng: {stats.absent}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: statusConfig.late.gradient,
                }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Muộn: {stats.late}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </GlassCard>

      {/* Table */}
      <GlassCard variant="gradient">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Mã HS</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Họ và tên</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Lớp</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Độ tin cậy</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record, index) => (
                  <TableRow
                    key={record.id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: alpha('#6366F1', 0.04),
                      },
                      animation: `fadeIn 0.3s ease ${index * 0.05}s both`,
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="primary">
                        {record.studentCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 700,
                          }}
                        >
                          {record.studentName[0]}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {record.studentName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.class}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[record.status].label}
                        size="small"
                        icon={statusConfig[record.status].icon}
                        sx={{
                          fontWeight: 700,
                          background: statusConfig[record.status].gradient,
                          color: 'white',
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {format(record.timestamp, 'HH:mm:ss')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {record.confidence ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinearProgress
                            variant="determinate"
                            value={record.confidence * 100}
                            sx={{
                              width: 60,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: alpha('#6366F1', 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                              },
                            }}
                          />
                          <Typography variant="caption" fontWeight={700} color="primary">
                            {(record.confidence * 100).toFixed(0)}%
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {record.note || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          sx={{
            borderTop: `1px solid ${alpha('#6B7280', 0.08)}`,
            '& .MuiTablePagination-toolbar': {
              fontWeight: 600,
            },
          }}
        />
      </GlassCard>
    </Box>
  );
}
