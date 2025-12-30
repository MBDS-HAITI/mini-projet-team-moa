import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Badge,
  Tooltip,
  Divider,
  useTheme as useMuiTheme,
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { menuItems } from '../config/menuConfig';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import useNotifications from '../hooks/useNotifications';

import './Header.css';

export default function Header() {
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const { notifications } = useNotifications(user?._id);

  const [userAnchor, setUserAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const getInitials = () => {
    if (!user?.username) return '';
    const p = user.username.split(' ');
    return p.length === 1
      ? p[0][0].toUpperCase()
      : p[0][0].toUpperCase() + p.at(-1)[0].toUpperCase();
  };

  return (
    <header className="Header">
      <div className="header-wrapper">

        {/* ===== LIGNE 1 : ACTIONS AU-DESSUS ===== */}
        {isAuthenticated && (
          <div className="header-actions">

            <Tooltip title="Changer le thème">
              <IconButton onClick={toggleTheme}>
                {themeMode === 'dark'
                  ? <LightModeIcon />
                  : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
                <Badge badgeContent={notifications?.length || 0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notifAnchor}
              open={Boolean(notifAnchor)}
              onClose={() => setNotifAnchor(null)}
            >
              <MenuItem disabled>Notifications</MenuItem>
              {notifications?.length === 0 && (
                <MenuItem disabled>Aucune notification</MenuItem>
              )}
              {notifications?.map((n, i) => (
                <MenuItem key={i}>{n.message}</MenuItem>
              ))}
            </Menu>

            <Divider orientation="vertical" flexItem />

            <Tooltip title="Compte utilisateur">
              <IconButton onClick={(e) => setUserAnchor(e.currentTarget)}>
                <Avatar>{getInitials()}</Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={userAnchor}
              open={Boolean(userAnchor)}
              onClose={() => setUserAnchor(null)}
            >
              <MenuItem onClick={() => navigate('/settings')}>
                <SettingsIcon fontSize="small" />
                &nbsp; Paramètres
              </MenuItem>
              <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
                &nbsp; Déconnexion
              </MenuItem>
            </Menu>

          </div>
        )}

        {/* ===== LIGNE 2 : LOGO + MENU (DESCENDU) ===== */}
        <div className="header-main">
          <div className="brand">
            <img src="/logoMBDS.png" alt="Logo" className="logo" />
            <div className="brand-text">
              <h1 className="title">Gestion Académique</h1>
              <p className="subtitle">Plateforme de Gestion des Données</p>
            </div>
          </div>

          <nav className="nav">
            <ul className="nav-list">
              {menuItems
                .filter(i => i.id !== 'users' || user?.role === 'admin')
                .map(item => (
                  <li key={item.id} className="nav-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? 'active' : ''}`
                      }
                      style={{ color: muiTheme.palette.text.primary }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
            </ul>
          </nav>
        </div>

      </div>
    </header>
  );
}
