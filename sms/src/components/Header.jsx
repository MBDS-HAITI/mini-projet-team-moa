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
  Tooltip
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
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
    handleSettingsClose();
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

  // Obtenir les initiales de l'utilisateur
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
                {/* Bouton Toggle Thème rapide */}
                <Tooltip title={themeMode === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}>
                  <IconButton
                    onClick={toggleTheme}
                    sx={{
                      color: muiTheme.palette.text.primary,
                      border: `2px solid ${muiTheme.palette.divider}`,
                      borderRadius: '8px',
                      padding: '8px',
                      '&:hover': {
                        borderColor: muiTheme.palette.primary.main,
                        backgroundColor: muiTheme.palette.action.hover,
                      },
                    }}
                  >
                    {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>

                {/* Menu utilisateur avec Avatar */}
                <Tooltip title="Paramètres du compte">
                  <IconButton
                    onClick={handleSettingsClick}
                    sx={{
                      padding: 0,
                      border: `2px solid ${muiTheme.palette.divider}`,
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: muiTheme.palette.primary.main,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: muiTheme.palette.primary.main,
                        fontSize: '0.875rem',
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
                    elevation: 3,
                    sx: {
                      minWidth: 280,
                      mt: 1.5,
                      borderRadius: 2,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
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
                  <Box sx={{ px: 2, py: 2, borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: muiTheme.palette.primary.main,
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        {getUserInitials()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {user?.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user?.email || 'utilisateur@example.com'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box 
                      sx={{ 
                        mt: 1, 
                        px: 1, 
                        py: 0.5, 
                        bgcolor: muiTheme.palette.action.hover,
                        borderRadius: 1,
                        display: 'inline-block'
                      }}
                    >
                      <Typography variant="caption" fontWeight={500} color="primary">
                        {user?.role || 'Utilisateur'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Navigation vers Paramètres */}
                  <MenuItem onClick={handleNavigateToSettings} sx={{ py: 1.5, gap: 2 }}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Paramètres" secondary="Gérer votre compte" />
                  </MenuItem>
                  
                  {/* Toggle thème */}
                  <MenuItem onClick={handleThemeToggle} sx={{ py: 1.5, gap: 2 }}>
                    <ListItemIcon>
                      {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={themeMode === 'dark' ? 'Mode clair' : 'Mode sombre'}
                      secondary="Changer l'apparence"
                    />
                  </MenuItem>
                  
                  <Divider sx={{ my: 0.5 }} />
                  
                  {/* Déconnexion */}
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5, gap: 2, color: 'error.main' }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                  </MenuItem>
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