import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents, useCourses, useGrades, useUsers } from '../../hooks/useAPI';
import { useAuth } from '../../context/AuthContext';

function StatCard({ label, value, hint, accent }) {
  return (
    <div className="home-card stat" style={{ borderColor: accent }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: accent }}>{value}</div>
      <div className="stat-hint">{hint}</div>
    </div>
  );
}

function QuickAction({ title, description, action, icon, bg }) {
  return (
    <button className="home-card action" style={{ background: bg }} onClick={action}>
      <div className="action-icon">{icon}</div>
      <div className="action-content">
        <div className="action-title">{title}</div>
        <div className="action-desc">{description}</div>
      </div>
      <span className="action-arrow">→</span>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || 'Étudiant';

  const canManageUsers = role === 'Admin';
  const canManageStudents = role === 'Admin' || role === 'Scolarité';
  const canManageCourses = role === 'Admin' || role === 'Scolarité';
  const canManageGrades = role === 'Admin' || role === 'Scolarité' || role === 'Étudiant';

  const { data: students } = useStudents();
  const { data: courses } = useCourses();
  const { data: grades } = useGrades();
  const { data: users } = useUsers(canManageUsers);

  const stats = useMemo(() => {
    const base = [
      { label: 'Étudiants', value: students?.length ?? '—', hint: 'Gestion des dossiers', accent: '#2563eb', visible: canManageStudents },
      { label: 'Cours', value: courses?.length ?? '—', hint: 'Catalogue des matières', accent: '#0ea5e9', visible: canManageCourses },
      { label: 'Notes', value: grades?.length ?? '—', hint: 'Suivi des résultats', accent: '#10b981', visible: canManageGrades }
    ];

    if (canManageUsers) {
      base.splice(2, 0, { label: 'Utilisateurs', value: users?.length ?? '—', hint: 'Accès et rôles', accent: '#f59e0b', visible: true });
    }

    return base.filter((s) => s.visible !== false);
  }, [students, courses, users, grades, canManageUsers, canManageStudents, canManageCourses, canManageGrades]);

  const quickActions = [
    canManageUsers && { title: 'Créer un utilisateur', description: 'Ajouter un compte et attribuer un rôle', to: '/users', icon: '👤', bg: 'linear-gradient(120deg, #fef3c7, #fde68a)' },
    canManageStudents && { title: 'Inscrire un étudiant', description: 'Créer un dossier étudiant complet', to: '/students', icon: '🎓', bg: 'linear-gradient(120deg, #e0f2fe, #bae6fd)' },
    canManageCourses && { title: 'Planifier un cours', description: 'Configurer les matières et sessions', to: '/courses', icon: '📚', bg: 'linear-gradient(120deg, #ecfeff, #cffafe)' },
    canManageGrades && { title: 'Saisir des notes', description: 'Enregistrer et suivre les résultats', to: '/grades', icon: '📊', bg: 'linear-gradient(120deg, #f5f3ff, #e9d5ff)' },
  ].filter(Boolean);

  const nextSteps = [
    'Vérifier les accès Admin/Scolarité/Étudiant',
    'Completer les profils utilisateurs (email, rôle)',
    'Importer ou saisir les étudiants manquants',
    'Contrôler le catalogue des cours et sessions'
  ];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-text">
          <p className="hero-kicker">Plateforme MBDS — Gestion académique</p>
          <h1>Superviser, sécuriser et piloter vos données.</h1>
          <p className="hero-sub">Accès unifié aux étudiants, cours, notes et utilisateurs avec contrôle des rôles.</p>
          <div className="hero-actions">
            {canManageUsers && (
              <button className="btn-primary" onClick={() => navigate('/users')}>Créer un utilisateur</button>
            )}
            {canManageStudents && (
              <button className="btn-ghost" onClick={() => navigate('/students')}>Voir les étudiants</button>
            )}
            {!canManageStudents && !canManageUsers && (
              <button className="btn-ghost" onClick={() => navigate('/grades')}>Voir mes notes</button>
            )}
          </div>
          <div className="hero-badges">
            <span>✓ Authentification JWT</span>
            <span>✓ Rôles Admin / Scolarité / Étudiant</span>
            <span>✓ Sécurisé par middleware</span>
          </div>
        </div>
        <div className="hero-panel">
          <h3>Vue rapide</h3>
          <div className="hero-stats">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} accent={s.accent} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="kicker">Actions rapides</p>
              <h2>Passer à l'action</h2>
              <p className="muted">Créez, éditez et contrôlez les données clés sans quitter le tableau de bord.</p>
            </div>
          </div>
          <div className="actions-grid">
            {quickActions.map((item) => (
              <QuickAction
                key={item.title}
                title={item.title}
                description={item.description}
                action={() => navigate(item.to)}
                icon={item.icon}
                bg={item.bg}
              />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="kicker">Plan de contrôle</p>
              <h2>Prochaines étapes</h2>
              <p className="muted">Checklist rapide pour fiabiliser la base de données.</p>
            </div>
          </div>
          <ul className="checklist">
            {nextSteps.map((item) => (
              <li key={item}>
                <span className="check-icon">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
