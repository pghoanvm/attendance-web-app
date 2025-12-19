// src/pages/Students.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  alpha,
  InputAdornment,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Person,
  School,
  Email as EmailIcon,
  Phone as PhoneIcon,
  FilterList,
} from '@mui/icons-material';
import { studentService } from '../services/student.service';
import { Student, CreateStudentData } from '../types';
import { useSnackbar } from 'notistack';
import GlassCard from '../components/GlassCard';
import GradientIcon from '../components/GradientIcon';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<CreateStudentData>({
    studentCode: '',
    name: '',
    class: '',
    major: '',
    email: '',
    phone: '',
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      enqueueSnackbar('Lỗi khi tải danh sách học sinh', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        studentCode: student.studentCode,
        name: student.name,
        class: student.class,
        major: student.major,
        email: student.email,
        phone: student.phone,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        studentCode: '',
        name: '',
        class: '',
        major: '',
        email: '',
        phone: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, formData);
        enqueueSnackbar('Cập nhật học sinh thành công! 🎉', { variant: 'success' });
      } else {
        await studentService.create(formData);
        enqueueSnackbar('Thêm học sinh thành công! 🎉', { variant: 'success' });
      }
      handleCloseDialog();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      enqueueSnackbar('Lỗi khi lưu học sinh', { variant: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa học sinh này?')) {
      try {
        await studentService.delete(id);
        enqueueSnackbar('Xóa học sinh thành công', { variant: 'success' });
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        enqueueSnackbar('Lỗi khi xóa học sinh', { variant: 'error' });
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get unique classes for stats
  const classes = Array.from(new Set(students.map((s) => s.class)));

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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <School sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Quản lý học sinh
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Tổng số: <strong>{students.length}</strong> học sinh •{' '}
              <strong>{classes.length}</strong> lớp
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard variant="gradient">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GradientIcon
                  icon={<Person />}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  size={24}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Tổng học sinh
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="primary">
                    {students.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard variant="gradient">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GradientIcon
                  icon={<School />}
                  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  size={24}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Số lớp
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="secondary">
                    {classes.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard variant="gradient">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GradientIcon
                  icon={<FilterList />}
                  gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                  size={24}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Đã lọc
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="info.main">
                    {filteredStudents.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard variant="gradient">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GradientIcon
                  icon={<UploadIcon />}
                  gradient="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
                  size={24}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Đã đồng bộ
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="success.main">
                    {students.filter((s) => s.isSynced).length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Actions Bar */}
      <GlassCard variant="gradient" sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
          >
            <TextField
              placeholder="Tìm kiếm theo tên, mã HS, lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                maxWidth: { sm: 400 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ fontWeight: 600 }}>
                Export
              </Button>
              <Button variant="outlined" startIcon={<UploadIcon />} sx={{ fontWeight: 600 }}>
                Import
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  },
                }}
              >
                Thêm học sinh
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </GlassCard>

      {/* Table */}
      <GlassCard variant="gradient">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Avatar</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Mã HS</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Họ và tên</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Lớp</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Môn</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student, index) => (
                  <TableRow
                    key={student.id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: alpha('#6366F1', 0.04),
                      },
                      animation: `fadeIn 0.3s ease ${index * 0.05}s both`,
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    <TableCell>
                      <Avatar
                        src={student.photoURL}
                        alt={student.name}
                        sx={{
                          width: 48,
                          height: 48,
                          border: '3px solid',
                          borderColor: 'primary.light',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                        }}
                      >
                        {student.name[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="primary">
                        {student.studentCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {student.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.class}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {student.major || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {student.email || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.isSynced ? 'Đã đồng bộ' : 'Chưa đồng bộ'}
                        size="small"
                        color={student.isSynced ? 'success' : 'warning'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(student)}
                            sx={{
                              bgcolor: alpha('#6366F1', 0.1),
                              '&:hover': { bgcolor: alpha('#6366F1', 0.2) },
                            }}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(student.id)}
                            sx={{
                              bgcolor: alpha('#EF4444', 0.1),
                              '&:hover': { bgcolor: alpha('#EF4444', 0.2) },
                            }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredStudents.length}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,254,0.95) 100%)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.5rem',
          }}
        >
          {editingStudent ? '✏️ Chỉnh sửa học sinh' : '➕ Thêm học sinh mới'}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="ID"
              fullWidth
              required
              value={formData.studentCode}
              onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Họ và tên"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Lớp"
              fullWidth
              required
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <School color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Môn"
              fullWidth
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ fontWeight: 600, borderWidth: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
            }}
          >
            {editingStudent ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
