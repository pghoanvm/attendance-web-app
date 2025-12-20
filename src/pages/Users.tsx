// src/pages/Users.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  alpha,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Person,
  Email as EmailIcon,
  Lock as LockIcon,
  AdminPanelSettings,
  School as SchoolIcon,
  Refresh,
} from '@mui/icons-material';
import { authService } from '../services/auth.service';
import { User, UserRole } from '../types';
import { useSnackbar } from 'notistack';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/GlassCard';
import GradientIcon from '../components/GradientIcon';

const roleConfig = {
  [UserRole.ADMIN]: {
    label: 'Admin',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: <AdminPanelSettings />,
  },
  [UserRole.TEACHER]: {
    label: 'Giáo viên',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #10b981 100%)',
    icon: <SchoolIcon />,
  },
  [UserRole.PARENT]: {
    label: 'Phụ huynh',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #f59e0b 100%)',
    icon: <Person />,
  },
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [_loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: UserRole.TEACHER,
    schoolId: '',
  });
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      enqueueSnackbar('Lỗi khi tải danh sách người dùng', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleOpenDialog = () => {
    setFormData({
      email: '',
      password: '',
      displayName: '',
      role: UserRole.TEACHER,
      schoolId: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      await authService.createUser(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role,
        formData.schoolId || undefined
      );

      enqueueSnackbar('Tạo tài khoản thành công! 🎉', { variant: 'success' });
      handleCloseDialog();
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      enqueueSnackbar(error.message || 'Lỗi khi tạo tài khoản', { variant: 'error' });
    }
  };

  const handleChangeRole = async (uid: string, newRole: UserRole) => {
    try {
      await authService.changeUserRole(uid, newRole);
      enqueueSnackbar('Cập nhật quyền thành công!', { variant: 'success' });
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      enqueueSnackbar('Lỗi khi cập nhật quyền', { variant: 'error' });
    }
  };

  const handleCreateFromStudents = async () => {
    try {
      setLoading(true);
      await authService.createAccountsFromStudents();
      enqueueSnackbar('Tạo tài khoản từ học sinh thành công!', { variant: 'success' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating accounts:', error);
      enqueueSnackbar('Lỗi khi tạo tài khoản tự động', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Stats
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === UserRole.ADMIN).length,
    teachers: users.filter((u) => u.role === UserRole.TEACHER).length,
    parents: users.filter((u) => u.role === UserRole.PARENT).length,
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <AdminPanelSettings sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Quản lý người dùng
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Tổng số: <strong>{stats.total}</strong> người dùng
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
                    Tổng số
                  </Typography>
                  <Typography variant="h4" fontWeight="800" color="primary">
                    {stats.total}
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
                  icon={<AdminPanelSettings />}
                  gradient={roleConfig[UserRole.ADMIN].gradient}
                  size={24}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Admin
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{ color: roleConfig[UserRole.ADMIN].color }}
                  >
                    {stats.admins}
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
                  icon={<SchoolIcon />}
                  gradient={roleConfig[UserRole.TEACHER].gradient}
                  size={24}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Giáo viên
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{ color: roleConfig[UserRole.TEACHER].color }}
                  >
                    {stats.teachers}
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
                  icon={<Person />}
                  gradient={roleConfig[UserRole.PARENT].gradient}
                  size={24}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Phụ huynh
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{ color: roleConfig[UserRole.PARENT].color }}
                  >
                    {stats.parents}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Actions */}
      <GlassCard variant="gradient" sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
          >
            <TextField
              placeholder="Tìm kiếm theo email, tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleCreateFromStudents}
                sx={{ fontWeight: 600 }}
              >
                Tạo từ học sinh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Thêm người dùng
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
                <TableCell sx={{ fontWeight: 700 }}>Avatar</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trường/Lớp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đăng nhập cuối</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.uid} hover>
                    <TableCell>
                      <Avatar
                        src={user.photoURL}
                        sx={{
                          width: 48,
                          height: 48,
                          background: roleConfig[user.role].gradient,
                          fontWeight: 700,
                        }}
                      >
                        {user.displayName[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.displayName}</Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.uid, e.target.value as UserRole)}
                        disabled={user.uid === currentUser?.uid}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                        <MenuItem value={UserRole.TEACHER}>Giáo viên</MenuItem>
                        <MenuItem value={UserRole.PARENT}>Phụ huynh</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.schoolId || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: alpha('#6366F1', 0.1),
                            '&:hover': { bgcolor: alpha('#6366F1', 0.2) },
                          }}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
        />
      </GlassCard>

      {/* Add Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 800,
          }}
        >
          ➕ Thêm người dùng mới
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
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
              label="Mật khẩu"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Tên hiển thị"
              fullWidth
              required
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Vai trò"
              select
              fullWidth
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            >
              <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
              <MenuItem value={UserRole.TEACHER}>Giáo viên</MenuItem>
              <MenuItem value={UserRole.PARENT}>Phụ huynh</MenuItem>
            </TextField>
            <TextField
              label="Trường/Lớp (tùy chọn)"
              fullWidth
              value={formData.schoolId}
              onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ fontWeight: 600 }}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Tạo tài khoản
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
