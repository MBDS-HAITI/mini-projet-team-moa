import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  useTheme as useMuiTheme,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { menuItems } from '../config/menuConfig';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, logout, user } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleNavigateToSettings = () => {
    handleSettingsClose();
    navigate('/settings');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    handleSettingsClose();
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.username) return 'U';
    const names = user.username.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="Header" style={{ backgroundColor: muiTheme.palette.background.paper, borderColor: muiTheme.palette.divider }}>
      <div className="header-container">
        {/* Logo et Titre */}
        <div className="brand">
          <img src="/logoMBDS.png" alt="Logo MBDS" className="logo" />
          <div className="brand-text">
            <h1 className="title" style={{ color: muiTheme.palette.text.primary }}>Gestion Académique</h1>
            <p className="subtitle" style={{ color: muiTheme.palette.text.secondary }}>Plateforme de Gestion des Données</p>
          </div>
        </div>

        {/* Actions rapides (desktop uniquement) */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 1.5, 
            alignItems: 'center',
            ml: 'auto',
            mr: 2
          }}
        >
          {isAuthenticated && (
            <>
              {/* Bouton Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  sx={{
                    color: muiTheme.palette.text.primary,
                    border: `2px solid ${muiTheme.palette.divider}`,
                    borderRadius: '12px',
                    padding: '10px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: muiTheme.palette.primary.main,
                      backgroundColor: muiTheme.palette.action.hover,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Bouton Toggle Thème */}
              <Tooltip title={themeMode === 'dark' ? 'Mode clair' : 'Mode sombre'}>
                <IconButton
                  onClick={handleThemeToggle}
                  sx={{
                    color: muiTheme.palette.text.primary,
                    border: `2px solid ${muiTheme.palette.divider}`,
                    borderRadius: '12px',
                    padding: '10px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: muiTheme.palette.primary.main,
                      backgroundColor: muiTheme.palette.action.hover,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {themeMode === 'dark' ? (
                    <LightModeIcon fontSize="small" />
                  ) : (
                    <DarkModeIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              {/* Séparateur vertical */}
              <Divider 
                orientation="vertical" 
                flexItem 
                sx={{ 
                  mx: 0.5, 
                  borderColor: muiTheme.palette.divider,
                  opacity: 0.6 
                }} 
              />
            </>
          )}
        </Box>

        {/* Toggle Menu Mobile */}
        <Tooltip title={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
          <IconButton 
            className="menu-toggle-icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: muiTheme.palette.text.primary,
            }}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>

        {/* Navigation */}
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`} style={{ backgroundColor: muiTheme.palette.background.paper }}>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    '--color': item.color,
                    color: muiTheme.palette.text.primary,
                    borderColor: muiTheme.palette.divider,
                    backgroundColor: muiTheme.palette.background.paper,
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </span>
                  <span className="nav-arrow">→</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Barre d'authentification */}
          <div className="auth-bar">
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* Menu utilisateur avec Avatar */}
                <Tooltip title={user?.username || 'Profil'}>
                  <IconButton
                    onClick={handleSettingsClick}
                    sx={{
                      padding: 0,
                      border: `2px solid ${muiTheme.palette.divider}`,
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: muiTheme.palette.primary.main,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${muiTheme.palette.primary.main}30`,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: muiTheme.palette.primary.main,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleSettingsClose}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      minWidth: 300,
                      mt: 1.5,
                      borderRadius: 3,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 20,
                        width: 12,
                        height: 12,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* En-tête du profil amélioré */}
                  <Box 
                    sx={{ 
                      px: 2.5, 
                      py: 2.5, 
                      borderBottom: `1px solid ${muiTheme.palette.divider}`,
                      background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}10 0%, ${muiTheme.palette.primary.main}05 100%)`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: muiTheme.palette.primary.main,
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          boxShadow: `0 4px 12px ${muiTheme.palette.primary.main}40`,
                        }}
                      >
                        {getUserInitials()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                          {user?.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {user?.email || 'utilisateur@example.com'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box 
                      sx={{ 
                        mt: 1.5, 
                        px: 1.5, 
                        py: 0.75, 
                        bgcolor: muiTheme.palette.primary.main,
                        color: 'white',
                        borderRadius: 2,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Typography variant="caption" fontWeight={600}>
                        {user?.role || 'Utilisateur'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Options du menu */}
                  <Box sx={{ py: 1 }}>
                    <MenuItem 
                      onClick={handleNavigateToSettings} 
                      sx={{ 
                        py: 1.5, 
                        px: 2.5,
                        mx: 1,
                        borderRadius: 2,
                        gap: 2,
                        '&:hover': {
                          backgroundColor: muiTheme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Paramètres" 
                        secondary="Gérer votre compte"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </MenuItem>
                    
                    <MenuItem 
                      onClick={handleThemeToggle} 
                      sx={{ 
                        py: 1.5, 
                        px: 2.5,
                        mx: 1,
                        borderRadius: 2,
                        gap: 2,
                        '&:hover': {
                          backgroundColor: muiTheme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemIcon>
                        {themeMode === 'dark' ? (
                          <LightModeIcon fontSize="small" color="warning" />
                        ) : (
                          <DarkModeIcon fontSize="small" color="primary" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={themeMode === 'dark' ? 'Mode clair' : 'Mode sombre'}
                        secondary="Changer l'apparence"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </MenuItem>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  {/* Déconnexion */}
                  <Box sx={{ px: 1, pb: 1 }}>
                    <MenuItem 
                      onClick={handleLogout} 
                      sx={{ 
                        py: 1.5, 
                        px: 2.5,
                        borderRadius: 2,
                        gap: 2,
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.lighter',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Déconnexion" 
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </MenuItem>
                  </Box>
                </Menu>
              </Box>
            ) : (
              <button
                className="login-btn"
                onClick={() => navigate('/login')}
                style={{
                  background: muiTheme.palette.primary.main,
                  color: muiTheme.palette.primary.contrastText,
                }}
              >
                Se connecter
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}