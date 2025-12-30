import { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

const CONTACT = {
  email: 'moasolutiontech@gmail.com',
  phone: '+509-4600-2055',
  programmeur: 'Ing. Orelus Josselet, Ing. Michel Jasmin, Ing. Aimé Huguens',
};

export default function About() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.getStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Texte statique
  const title = 'Master MBDS';
  const description = "Gestion des Etudiants, Cours, Notes et Utilisateurs pour la Faculté des Sciences de l'Université d'Haïti.";
  const { email, phone, programmeur } = CONTACT;

  // Affichage loading/erreur
  if (loading) return <main className="Main about-shell"><div style={{ padding: 32, textAlign: 'center' }}>Chargement des statistiques...</div></main>;
  if (error) return <main className="Main about-shell"><div style={{ padding: 32, color: '#dc2626', textAlign: 'center' }}>Erreur : {error}</div></main>;
  if (!stats) return null;

  // Extraction des stats dynamiques
  const totalEtudiants = stats.totalStudents || stats.totalEtudiants || 0;
  const totalMatieres = stats.totalCourses || stats.totalMatieres || 0;
  const totalNotes = stats.totalGrades || stats.totalNotes || 0;
  const moyenne = stats.avgGrade || stats.global?.moyenne || stats.global || 0;

  return (
    <main className="Main about-shell">
      <section className="about-hero">
        <p className="hero-kicker">MBDS — Gestion académique</p>
        <h1>ℹ️ À propos du projet</h1>
        <p>{description}</p>
        <div className="pill-row" style={{ marginTop: 12 }}>
          <span className="pill">JWT + Rôles</span>
          <span className="pill">React · Node · MongoDB</span>
          <span className="pill">Sécurisé par middleware</span>
        </div>
      </section>

      <section className="about-grid">
        <article className="about-card" style={{ borderLeft: '5px solid #2563eb' }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>🎓 {title}</h2>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
            La Faculté des Sciences de l'Université d'État d'Haïti propose depuis 1999 un Master MBDS en partenariat
            avec l'Université de Nice Sophia Antipolis. Cette plateforme centralise étudiants, cours et notes avec
            contrôle d'accès (Admin, Scolarité, Étudiant).
          </p>
        </article>

        <article className="about-card" style={{ borderLeft: '5px solid #7c3aed' }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>🚀 Technologies</h2>
          <div className="chip-row">
            <span className="chip-soft">⚛️ React + Vite</span>
            <span className="chip-soft">🟢 Node + Express</span>
            <span className="chip-soft">🍃 MongoDB</span>
            <span className="chip-soft">🔐 JWT</span>
          </div>
        </article>
      </section>

      <section className="stat-stack">
        <div className="about-card">
          <div className="metric-label">Étudiants</div>
          <div className="metric-value" style={{ color: '#2563eb' }}>{totalEtudiants}</div>
        </div>
        <div className="about-card">
          <div className="metric-label">Cours</div>
          <div className="metric-value" style={{ color: '#0ea5e9' }}>{totalMatieres}</div>
        </div>
        <div className="about-card">
          <div className="metric-label">Notes</div>
          <div className="metric-value" style={{ color: '#8b5cf6' }}>{totalNotes}</div>
        </div>
        <div className="about-card">
          <div className="metric-label">Moyenne générale</div>
          <div className="metric-value" style={{ color: '#10b981' }}>{moyenne}/100</div>
        </div>
      </section>


      <section className="about-grid">
        <article className="about-card">
          <h2 style={{ margin: 0, marginBottom: 8 }}>📈 Statistiques détaillées</h2>
          <div className="stat-stack" style={{ gap: 10 }}>
            <div className="metric-card"><div className="metric-label">Moyenne</div><div className="metric-value">{stats.avgGrade ?? '-'}</div></div>
            <div className="metric-card"><div className="metric-label">Maximum</div><div className="metric-value">{stats.maxGrade ?? '-'}</div></div>
            <div className="metric-card"><div className="metric-label">Minimum</div><div className="metric-value">{stats.minGrade ?? '-'}</div></div>
            {/* Optionnel : médiane et écart-type si présents dans l'API */}
            {stats.median !== undefined && <div className="metric-card"><div className="metric-label">Médiane</div><div className="metric-value">{stats.median}</div></div>}
            {stats.standardDeviation !== undefined && <div className="metric-card"><div className="metric-label">Écart-type</div><div className="metric-value">{stats.standardDeviation}</div></div>}
          </div>
        </article>

        <article className="about-card">
          <h2 style={{ margin: 0, marginBottom: 8 }}>📚 Performance par cours</h2>
          <table className="table-soft">
            <thead>
              <tr>
                <th>Cours</th>
                <th style={{ textAlign: 'right' }}>Records</th>
                <th style={{ textAlign: 'right' }}>Average</th>
                <th style={{ textAlign: 'right' }}>Max</th>
                <th style={{ textAlign: 'right' }}>Min</th>
                {/* <th style={{ textAlign: 'right' }}>Median</th> */}
              </tr>
            </thead>
            <tbody>
              {(stats.gradesByCourse || []).map((item, idx) => (
                <tr key={item.courseName || idx}>
                  <td>{item.courseName}</td>
                  <td style={{ textAlign: 'right' }}>{item.count ?? '-'}</td>
                  <td style={{ textAlign: 'right' }}>{item.avgGrade ?? '-'}</td>
                  <td style={{ textAlign: 'right' }}>{item.maxGrade ?? '-'}</td>
                  <td style={{ textAlign: 'right' }}>{item.minGrade ?? '-'}</td>
                  {/* <td style={{ textAlign: 'right' }}>{item.median ?? '-'}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>

      <section className="about-card">
        <h2 style={{ margin: 0, marginBottom: 10 }}>📞 Contact</h2>
        <div className="contact-grid">
          <div><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></div>
          <div><strong>Téléphone:</strong> <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></div>
          <div><strong>Développeur:</strong> {programmeur}</div>
        </div>
        <div style={{ marginTop: 16 }}>
          <a href="/contact">
            <button style={{ padding: '8px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
              Envoyer un message
            </button>
          </a>
        </div>
      </section>
    </main>
  );
}