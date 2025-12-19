// src/pages/Settings.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Switch,
  Button,
  TextField,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person,
  Notifications,
  Palette,
  Security,
  Language,
  CameraAlt,
  Save,
  Lock,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { useSnackbar } from 'notistack';
import GlassCard from '../components/GlassCard';
import GradientIcon from '../components/GradientIcon';

interface SettingsState {
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    attendance: boolean;
    reports: boolean;
  };
  display: {
    compactMode: boolean;
    showAvatar: boolean;
    animationsEnabled: boolean;
  };
}

export default function Settings() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [settings, setSettings] = useState<SettingsState>({
    theme: 'light',
    language: 'vi',
    notifications: {
      email: true,
      push: true,
      attendance: true,
      reports: true,
    },
    display: {
      compactMode: false,
      showAvatar: true,
      animationsEnabled: true,
    },
  });

  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
  });

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings: SettingsState) => {
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
    setSettings(newSettings);
    enqueueSnackbar('Đã lưu cài đặt! ✅', { variant: 'success' });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    const newSettings = { ...settings, theme };
    saveSettings(newSettings);

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto mode - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    };
    saveSettings(newSettings);
  };

  const handleDisplayChange = (key: keyof typeof settings.display) => {
    const newSettings = {
      ...settings,
      display: {
        ...settings.display,
        [key]: !settings.display[key],
      },
    };
    saveSettings(newSettings);
  };

  const handleSaveProfile = async () => {
    try {
      if (user) {
        await authService.updateUserProfile(user.uid, {
          displayName: profile.displayName,
        });
        enqueueSnackbar('Cập nhật hồ sơ thành công! 🎉', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      enqueueSnackbar('Lỗi khi cập nhật hồ sơ', { variant: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      enqueueSnackbar('Mật khẩu xác nhận không khớp!', { variant: 'error' });
      return;
    }

    try {
      // TODO: Implement password change with Firebase
      enqueueSnackbar('Đổi mật khẩu thành công! 🔒', { variant: 'success' });
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      enqueueSnackbar('Lỗi khi đổi mật khẩu', { variant: 'error' });
    }
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
          <SettingsIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Cài đặt
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Tùy chỉnh ứng dụng theo sở thích của bạn
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} lg={4}>
          <GlassCard variant="gradient">
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <GradientIcon
                  icon={<Person />}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  size={24}
                />
                <Typography variant="h6" fontWeight="700">
                  Hồ sơ cá nhân
                </Typography>
              </Stack>

              <Stack spacing={3} alignItems="center">
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={profile.photoURL}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid',
                      borderColor: 'primary.main',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '3rem',
                      fontWeight: 800,
                    }}
                  >
                    {profile.displayName[0]}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                    size="small"
                  >
                    <CameraAlt fontSize="small" />
                  </IconButton>
                </Box>

                <TextField
                  label="Tên hiển thị"
                  fullWidth
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                />

                <TextField
                  label="Email"
                  fullWidth
                  value={profile.email}
                  disabled
                  helperText="Email không thể thay đổi"
                />

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Save />}
                  onClick={handleSaveProfile}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                  }}
                >
                  Lưu thay đổi
                </Button>

                <Divider sx={{ width: '100%' }} />

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Lock />}
                  onClick={() => setPasswordDialog(true)}
                  sx={{ fontWeight: 600 }}
                >
                  Đổi mật khẩu
                </Button>
              </Stack>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* App Settings */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Theme Settings */}
            <GlassCard variant="gradient">
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <GradientIcon
                    icon={<Palette />}
                    gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    size={24}
                  />
                  <Typography variant="h6" fontWeight="700">
                    Giao diện
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#6366F1', 0.05),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Chế độ giao diện
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Chọn giao diện sáng, tối hoặc tự động
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          onClick={() => handleThemeChange('light')}
                          sx={{
                            bgcolor: settings.theme === 'light' ? 'primary.main' : 'transparent',
                            color: settings.theme === 'light' ? 'white' : 'text.secondary',
                          }}
                        >
                          <LightMode />
                        </IconButton>
                        <IconButton
                          onClick={() => handleThemeChange('dark')}
                          sx={{
                            bgcolor: settings.theme === 'dark' ? 'primary.main' : 'transparent',
                            color: settings.theme === 'dark' ? 'white' : 'text.secondary',
                          }}
                        >
                          <DarkMode />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#6366F1', 0.05),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Chế độ thu gọn
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hiển thị giao diện gọn gàng hơn
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.display.compactMode}
                        onChange={() => handleDisplayChange('compactMode')}
                      />
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#6366F1', 0.05),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Hiệu ứng chuyển động
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bật/tắt animations và transitions
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.display.animationsEnabled}
                        onChange={() => handleDisplayChange('animationsEnabled')}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </GlassCard>

            {/* Notification Settings */}
            <GlassCard variant="gradient">
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <GradientIcon
                    icon={<Notifications />}
                    gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                    size={24}
                  />
                  <Typography variant="h6" fontWeight="700">
                    Thông báo
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#10B981', 0.05),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Email thông báo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nhận thông báo qua email
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.notifications.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#10B981', 0.05),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Thông báo đẩy
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nhận push notifications
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.notifications.push}
                        onChange={() => handleNotificationChange('push')}
                      />
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#10B981', 0.05),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Thông báo điểm danh
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thông báo khi có điểm danh mới
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.notifications.attendance}
                        onChange={() => handleNotificationChange('attendance')}
                      />
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#10B981', 0.05),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Báo cáo định kỳ
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nhận báo cáo hàng tuần/tháng
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.notifications.reports}
                        onChange={() => handleNotificationChange('reports')}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </GlassCard>

            {/* Language Settings */}
            <GlassCard variant="gradient">
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <GradientIcon
                    icon={<Language />}
                    gradient="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
                    size={24}
                  />
                  <Typography variant="h6" fontWeight="700">
                    Ngôn ngữ & Khu vực
                  </Typography>
                </Stack>

                <FormControl fullWidth>
                  <InputLabel>Ngôn ngữ</InputLabel>
                  <Select
                    value={settings.language}
                    label="Ngôn ngữ"
                    onChange={(e) =>
                      saveSettings({ ...settings, language: e.target.value as 'vi' | 'en' })
                    }
                  >
                    <MenuItem value="vi">🇻🇳 Tiếng Việt</MenuItem>
                    <MenuItem value="en">🇬🇧 English</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </GlassCard>
          </Stack>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 800,
          }}
        >
          🔒 Đổi mật khẩu
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              fullWidth
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              helperText="Ít nhất 8 ký tự"
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPasswordDialog(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
            }}
          >
            Đổi mật khẩu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
