import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { menuItems } from '../config/menuConfig';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="Header">
      <div className="header-container">
        <div className="brand">
          <img src="/logoMBDS.png" alt="Logo MBDS" className="logo" />
          <div className="brand-text">
            <h1 className="title">Gestion Académique</h1>
            <p className="subtitle">Plateforme de Gestion des Données</p>
          </div>
        </div>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    '--color': item.color
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
          
          {isAuthenticated && (
            <div className="user-section">
              <span className="user-info">
                {user?.username} {user?.role && `(${user.role})`}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Déconnexion
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}