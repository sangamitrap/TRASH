import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider,
  ListItemIcon,
  IconButton,
  Badge,
  Tooltip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  ExitToApp as ExitToAppIcon, 
  AccountCircle as AccountCircleIcon, 
  Notifications as NotificationsIcon,
  Recycle as RecycleIcon,
  History as HistoryIcon,
  EmojiEvents as EmojiEventsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../features/auth/authSlice';

const AuthLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem 
        onClick={() => {
          navigate('/app/profile');
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => navigate('/app/dashboard')}>
        <ListItemIcon>
          <DashboardIcon fontSize="small" />
        </ListItemIcon>
        <Typography>Dashboard</Typography>
      </MenuItem>
      <MenuItem onClick={() => navigate('/app/submit-waste')}>
        <ListItemIcon>
          <RecycleIcon fontSize="small" />
        </ListItemIcon>
        <Typography>Submit Waste</Typography>
      </MenuItem>
      <MenuItem onClick={() => navigate('/app/submissions')}>
        <ListItemIcon>
          <HistoryIcon fontSize="small" />
        </ListItemIcon>
        <Typography>My Submissions</Typography>
      </MenuItem>
      <MenuItem onClick={() => navigate('/leaderboard')}>
        <ListItemIcon>
          <EmojiEventsIcon fontSize="small" />
        </ListItemIcon>
        <Typography>Leaderboard</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <Box 
        sx={{
          width: 240,
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            WasteWise
          </Typography>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/app/dashboard')}
            sx={{ justifyContent: 'flex-start', mb: 1 }}
          >
            Dashboard
          </Button>
          <Button
            fullWidth
            startIcon={<RecycleIcon />}
            onClick={() => navigate('/app/submit-waste')}
            sx={{ justifyContent: 'flex-start', mb: 1 }}
          >
            Submit Waste
          </Button>
          <Button
            fullWidth
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/app/submissions')}
            sx={{ justifyContent: 'flex-start', mb: 1 }}
          >
            My Submissions
          </Button>
          <Button
            fullWidth
            startIcon={<EmojiEventsIcon />}
            onClick={() => navigate('/leaderboard')}
            sx={{ justifyContent: 'flex-start' }}
          >
            Leaderboard
          </Button>
        </Box>
      </Box>

      {/* Mobile AppBar */}
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={0}
        sx={{
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '240px' },
          display: { xs: 'block', md: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            WasteWise
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={isMenuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
              >
                <Avatar 
                  sx={{ width: 32, height: 32 }}
                  alt={user?.name || 'User'}
                  src={user?.avatar}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '240px' },
          mt: { xs: 8, sm: 3 },
        }}
      >
        <Outlet />
      </Box>

      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default AuthLayout;
