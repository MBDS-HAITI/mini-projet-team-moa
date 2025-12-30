import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="Main page-content" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 22, color: '#64748b' }}>Chargement des statistiques...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="Main page-content" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 22, color: '#dc2626', fontWeight: 700 }}>⚠️ Erreur</div>
        <div style={{ marginTop: 12, color: '#64748b' }}>{error}</div>
      </main>
    );
  }

  const role = (user?.role || '').toLowerCase();
  const gradesByCourse = stats?.gradesByCourse || [];
  const maxCount = Math.max(...gradesByCourse.map((g) => g.count || 0), 1);
  const maxAvg = Math.max(...gradesByCourse.map((g) => g.avgGrade || 0), 20);



  return (
    <main className="dashboard-shell">
      {/* Menu Title Section */}
      <div className="dash-hero">
        <div className="dash-hero-card">
          <p className="hero-kicker">Tableau de bord</p>
          <h1>📊 Pilotage des données</h1>
          <p>
            {role === 'admin' && 'Vision globale - Administrateur'}
            {role === 'scolarite' && 'Vision scolarité'}
            {role === 'student' && 'Mon dossier étudiant'}
            {!['admin', 'scolarite', 'student'].includes(role) && 'Rôle inconnu'}
          </p>
          <div className="pill-row">
            <span className="pill">Rôle : {role || 'inconnu'}</span>
            <span className="pill">JWT & ACL</span>
            <span className="pill">Données live</span>
          </div>
        </div>
      </div>

      {/* Submenu/Statistics Section - visually below the title */}
      <div className="dash-summary" style={{ marginTop: 24 }}>
        <div className="metric-grid">
          {role === 'admin' && (
            <div className="metric-card" style={{ borderLeft: '5px solid #f59e0b' }}>
              <div className="metric-label">Utilisateurs</div>
              <div className="metric-value" style={{ color: '#f59e0b' }}>{stats?.totalUsers || 0}</div>
              <div className="stat-hint">Accès et rôles</div>
            </div>
          )}
          <div className="metric-card" style={{ borderLeft: '5px solid #2563eb' }}>
            <div className="metric-label">Étudiants</div>
            <div className="metric-value" style={{ color: '#2563eb' }}>{stats?.totalStudents || 0}</div>
            <div className="stat-hint">Dossiers actifs</div>
          </div>
          <div className="metric-card" style={{ borderLeft: '5px solid #10b981' }}>
            <div className="metric-label">Cours</div>
            <div className="metric-value" style={{ color: '#10b981' }}>{stats?.totalCourses || 0}</div>
            <div className="stat-hint">Catalogue</div>
          </div>
          <div className="metric-card" style={{ borderLeft: '5px solid #8b5cf6' }}>
            <div className="metric-label">Notes</div>
            <div className="metric-value" style={{ color: '#8b5cf6' }}>{stats?.totalGrades || 0}</div>
            <div className="stat-hint">Évaluations</div>
          </div>
        </div>
      </div>

      {(role === 'admin' || role === 'scolarite') && (
        <>
          <section className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Moyenne générale</div>
              <div className="metric-value" style={{ color: '#2563eb' }}>{stats?.avgGrade || 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Note maximale</div>
              <div className="metric-value" style={{ color: '#10b981' }}>{stats?.maxGrade || 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Note minimale</div>
              <div className="metric-value" style={{ color: '#ef4444' }}>{stats?.minGrade || 0}</div>
            </div>
          </section>

          <section className="chart-card">
            <h2 style={{ margin: 0, marginBottom: 10 }}>📚 Statistiques par cours</h2>
            {gradesByCourse.length === 0 ? (
              <p style={{ color: '#6b7280' }}>Aucune note encore enregistrée.</p>
            ) : (
              <>
                <div className="chart-row">
                  {gradesByCourse.map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>{item.courseName}</h3>
                        <span style={{ color: '#6b7280' }}>{item.count} notes · moy {item.avgGrade}</span>
                      </div>
                      <div className="chart-bar-track">
                        <div className="chart-bar-fill" style={{ '--w': `${Math.max(8, (item.count / maxCount) * 100)}%` }} />
                        <div
                          className="chart-bar-marker"
                          style={{ left: `${Math.max(0, (item.avgGrade / maxAvg) * 100)}%` }}
                          title={`Moyenne ${item.avgGrade}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <span><span style={{display:'inline-block',width:18,height:12,background:'linear-gradient(90deg,#2563eb,#8b5cf6)',borderRadius:6,marginRight:6,verticalAlign:'middle'}}></span>Nombre de notes</span>
                  <span><span style={{display:'inline-block',width:10,height:18,background:'#f59e0b',borderRadius:3,marginRight:6,verticalAlign:'middle'}}></span>Moyenne</span>
                </div>
              </>
            )}
          </section>
        </>
      )}

      {role === 'student' && (
        <>
          <section className="about-card" style={{ borderLeft: '5px solid #2563eb' }}>
            <h2 style={{ margin: 0, marginBottom: 6 }}>👤 Mon profil</h2>
            <p style={{ margin: 0, color: '#475569' }}><strong>Nom :</strong> {stats?.studentName || 'N/A'}</p>
            <p style={{ margin: 0, color: '#475569' }}><strong>Email :</strong> {stats?.studentEmail || 'N/A'}</p>
          </section>

          <section className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Nombre de notes</div>
              <div className="metric-value" style={{ color: '#8b5cf6' }}>{stats?.totalGrades || 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Ma moyenne</div>
              <div className="metric-value" style={{ color: '#2563eb' }}>{stats?.avgGrade || 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Meilleure note</div>
              <div className="metric-value" style={{ color: '#10b981' }}>{stats?.maxGrade || 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Note la plus basse</div>
              <div className="metric-value" style={{ color: '#ef4444' }}>{stats?.minGrade || 0}</div>
            </div>
          </section>

          <section className="chart-card">
            <h2 style={{ margin: 0, marginBottom: 12 }}>📝 Mes notes par cours</h2>
            {stats?.gradesByCourse?.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: 12 }}>Aucune note enregistrée</p>
            ) : (
              <table className="data-table-soft">
                <thead>
                  <tr>
                    <th>Cours</th>
                    <th>Code</th>
                    <th>Note</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.gradesByCourse?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.courseName}</td>
                      <td style={{ textAlign: 'center', color: '#6b7280' }}>{item.courseCode}</td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: '#2563eb' }}>{item.grade}</td>
                      <td style={{ textAlign: 'center', color: '#6b7280' }}>
                        {item.date ? new Date(item.date).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Dashboard;
