import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { menuItems } from '../config/menuConfig';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useState, React } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import useNotifications from '../hooks/useNotifications';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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
import NotificationsIcon from '@mui/icons-material/Notifications';
export default function Header() {
            const navigate = useNavigate();
            // Handler pour aller à la page des paramètres utilisateur
            function handleNavigateToSettings() {
              navigate('/settings'); // adapte le chemin si besoin
              if (typeof handleSettingsClose === 'function') {
                handleSettingsClose();
              }
            }
          // Utilitaire pour afficher les initiales de l'utilisateur
          function getUserInitials() {
            if (!user || !user.username) return '';
            const names = user.username.trim().split(' ');
            if (names.length === 1) return names[0][0].toUpperCase();
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
          }
        // Pour le menu utilisateur (admin)
        const [anchorEl, setAnchorEl] = useState(null);
        const handleSettingsClick = (event) => setAnchorEl(event.currentTarget);
        const handleSettingsClose = () => setAnchorEl(null);
      // ...existing code...
      // Handler pour la déconnexion
      const handleLogout = () => {
        if (typeof logout === 'function') {
          logout();
        }
        if (typeof handleSettingsClose === 'function') {
          handleSettingsClose();
        }
      };
    // State for mobile menu toggle
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const { isAuthenticated, user, logout } = useAuth();
  // Notifications hook
  const { notifications, loading: notifLoading, error: notifError } = useNotifications(user?._id);
  // Theme context
  const { themeMode, toggleTheme } = useTheme();
  const handleThemeToggle = toggleTheme;

  // Ajout de la fonction handleNotifClick pour ouvrir le menu de notifications
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const notifOpen = Boolean(notifAnchorEl);
  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  return (
    <header className="Header" style={{ backgroundColor: muiTheme.palette.background.paper, borderColor: muiTheme.palette.divider }}>
      <div className="header-container">
        {/* Logo, Titre et Menu fusionnés */}
        <div className="brand">
          <img src="/logoMBDS.png" alt="Logo MBDS" className="logo" />
          <div className="brand-text">
            <h1 className="title" style={{ color: muiTheme.palette.text.primary }}>Gestion Académique</h1>
            <p className="subtitle" style={{ color: muiTheme.palette.text.secondary }}>Plateforme de Gestion des Données</p>
          </div>
        </div>
        {/* Menu sur la même ligne que le logo et le titre */}
        <nav className="nav" style={{ backgroundColor: muiTheme.palette.background.paper, marginLeft: 24, marginRight: 0, flex: 1, justifyContent: 'flex-start' }}>
          <ul className="nav-list">
            {menuItems
              .filter(item => item.id !== 'users' || (user && user.role === 'admin'))
              .map((item) => (
                <li key={item.id} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
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
        </nav>
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
                  onClick={handleNotifClick}
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
                  <Badge badgeContent={notifications?.length || 0} color="error">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={notifAnchorEl}
                open={notifOpen}
                onClose={handleNotifClose}
                PaperProps={{ sx: { minWidth: 320, maxWidth: 400 } }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled divider>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Notifications
                  </Typography>
                </MenuItem>
                {notifLoading && (
                  <MenuItem disabled>Chargement...</MenuItem>
                )}
                {notifError && (
                  <MenuItem disabled>Erreur: {notifError}</MenuItem>
                )}
                {(!notifLoading && notifications?.length === 0) && (
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      Aucune notification à afficher.
                    </Typography>
                  </MenuItem>
                )}
                {notifications?.map((notif, idx) => (
                  <MenuItem key={notif._id || idx} divider={idx < notifications.length - 1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>{notif.message || notif.text || JSON.stringify(notif)}</Typography>
                    <IconButton size="small" color="error" onClick={() => handleDeleteNotif(notif._id)} aria-label="Supprimer" sx={{ ml: 1 }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </MenuItem>
                ))}
              </Menu>

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

              {/* Menu utilisateur (avatar, paramètres, déconnexion) pour tout utilisateur connecté */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                        width: 32,
                        height: 32,
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
                      minWidth: 220,
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
                  {/* En-tête du profil */}
                  <Box 
                    sx={{ 
                      px: 2, 
                      py: 2, 
                      borderBottom: `1px solid ${muiTheme.palette.divider}`,
                      background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}10 0%, ${muiTheme.palette.primary.main}05 100%)`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: muiTheme.palette.primary.main,
                          fontSize: '1.1rem',
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
                        mt: 1, 
                        px: 1, 
                        py: 0.5, 
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
                        py: 1.2, 
                        px: 2,
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
                        py: 1.2, 
                        px: 2,
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
                        py: 1.2, 
                        px: 2,
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
            </>
          )}
        </Box>
      </div>
    </header>
  );
}

