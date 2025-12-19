// src/components/Layout.tsx - UPDATED WITH NEW MENU ITEMS
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Stack,
  Chip,
  alpha,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  AccountCircle,
  Notifications,
  Settings as SettingsIcon,
  AdminPanelSettings,
  FiberManualRecord,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT],
  },
  {
    text: 'Học sinh',
    icon: <PeopleIcon />,
    path: '/students',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    roles: [UserRole.ADMIN, UserRole.TEACHER],
  },
  {
    text: 'Điểm danh',
    icon: <EventNoteIcon />,
    path: '/attendance',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT],
    isLive: true,
  },
  {
    text: 'Báo cáo',
    icon: <AssessmentIcon />,
    path: '/reports',
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT],
  },
  {
    text: 'Người dùng',
    icon: <AdminPanelSettings />,
    path: '/users',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    roles: [UserRole.ADMIN],
  },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  const handleNavigateSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || UserRole.TEACHER)
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <DashboardIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="800">
              Attendance
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Smart System
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ px: 2, py: 3, flex: 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  ...(isActive && {
                    background: item.gradient,
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: item.gradient,
                      transform: 'translateX(4px)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  }),
                  ...(!isActive && {
                    '&:hover': {
                      bgcolor: alpha('#6366F1', 0.08),
                      transform: 'translateX(4px)',
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'white' : 'primary.main',
                  }}
                >
                  {item.isLive ? (
                    <Badge
                      badgeContent={<FiberManualRecord sx={{ fontSize: 8 }} />}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          animation: 'pulse 2s infinite',
                        },
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.9375rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Info */}
      <Box
        sx={{
          p: 2,
          m: 2,
          borderRadius: 3,
          bgcolor: alpha('#6366F1', 0.08),
          border: `1px solid ${alpha('#6366F1', 0.15)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
            }}
          >
            {user?.displayName?.[0].toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {user?.displayName || 'User'}
            </Typography>
            <Chip
              label={user?.role || 'Teacher'}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 700,
                mt: 0.5,
                bgcolor: alpha('#6366F1', 0.1),
                color: 'primary.main',
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#6B7280', 0.08)}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {filteredMenuItems.find((item) => item.path === location.pathname)?.text ||
              'Attendance'}
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              sx={{
                color: 'text.primary',
                '&:hover': { bgcolor: alpha('#6366F1', 0.08) },
              }}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                ml: 1,
                '&:hover': { bgcolor: alpha('#6366F1', 0.08) },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 700,
                }}
              >
                {user?.displayName?.[0].toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha('#6B7280', 0.08)}` }}>
              <Typography variant="body2" fontWeight={700}>
                {user?.displayName || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
              <Chip
                label={user?.role || 'Teacher'}
                size="small"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  height: 20,
                  bgcolor: alpha('#6366F1', 0.1),
                  color: 'primary.main',
                }}
              />
            </Box>
            <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
              <AccountCircle sx={{ mr: 1.5, fontSize: 20 }} />
              Hồ sơ
            </MenuItem>
            <MenuItem onClick={handleNavigateSettings} sx={{ py: 1.5 }}>
              <SettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
              Cài đặt
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
