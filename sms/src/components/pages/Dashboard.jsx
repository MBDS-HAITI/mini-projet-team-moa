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
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 24, color: '#666' }}>Chargement des statistiques...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 24, color: '#dc2626' }}>⚠️ Erreur</div>
        <div style={{ marginTop: 16, color: '#666' }}>{error}</div>
      </div>
    );
  }

  const role = (user?.role || '').toLowerCase();

  return (
    <div style={{ padding: 40 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
          📊 Tableau de bord
        </h1>
        <p style={{ color: '#666', fontSize: 16 }}>
          {role === 'admin' && 'Vision globale - Administrateur'}
          {role === 'teacher' && 'Vision scolarité'}
          {role === 'student' && 'Mon dossier étudiant'}
        </p>
      </header>

      {/* Admin & Teacher: global stats */}
      {(role === 'admin' || role === 'teacher') && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 32 }}>
            {role === 'admin' && (
              <div style={{ padding: 24, backgroundColor: '#f59e0b', color: 'white', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: 14, marginBottom: 8, opacity: 0.9 }}>Utilisateurs</div>
                <div style={{ fontSize: 36, fontWeight: 'bold' }}>{stats?.totalUsers || 0}</div>
              </div>
            )}
            <div style={{ padding: 24, backgroundColor: '#3b82f6', color: 'white', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 14, marginBottom: 8, opacity: 0.9 }}>Étudiants</div>
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>{stats?.totalStudents || 0}</div>
            </div>
            <div style={{ padding: 24, backgroundColor: '#10b981', color: 'white', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 14, marginBottom: 8, opacity: 0.9 }}>Cours</div>
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>{stats?.totalCourses || 0}</div>
            </div>
            <div style={{ padding: 24, backgroundColor: '#8b5cf6', color: 'white', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 14, marginBottom: 8, opacity: 0.9 }}>Notes</div>
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>{stats?.totalGrades || 0}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: 20, backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Moyenne générale</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#3b82f6' }}>{stats?.avgGrade || 0}</div>
            </div>
            <div style={{ padding: 20, backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Note maximale</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#10b981' }}>{stats?.maxGrade || 0}</div>
            </div>
            <div style={{ padding: 20, backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Note minimale</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ef4444' }}>{stats?.minGrade || 0}</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>📚 Statistiques par cours</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: 12 }}>Cours</th>
                  <th style={{ textAlign: 'center', padding: 12 }}>Nombre de notes</th>
                  <th style={{ textAlign: 'center', padding: 12 }}>Moyenne</th>
                </tr>
              </thead>
              <tbody>
                {stats?.gradesByCourse?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: 12 }}>{item.courseName}</td>
                    <td style={{ padding: 12, textAlign: 'center' }}>{item.count}</td>
                    <td style={{ padding: 12, textAlign: 'center', fontWeight: 'bold', color: '#3b82f6' }}>
                      {item.avgGrade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Student: personal stats */}
      {role === 'student' && (
        <>
          <div style={{ backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>👤 Mon profil</h2>
            <p style={{ color: '#666', marginBottom: 4 }}>
              <strong>Nom :</strong> {stats?.studentName || 'N/A'}
            </p>
            <p style={{ color: '#666' }}>
              <strong>Email :</strong> {stats?.studentEmail || 'N/A'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: 20, backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Nombre de notes</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#8b5cf6' }}>{stats?.totalGrades || 0}</div>
            </div>
            <div style={{ padding: 20, backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Ma moyenne</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#3b82f6' }}>{stats?.avgGrade || 0}</div>
            </div>
            <div style={{ padding: 20, backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Meilleure note</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#10b981' }}>{stats?.maxGrade || 0}</div>
            </div>
            <div style={{ padding: 20, backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12 }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Note la plus basse</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ef4444' }}>{stats?.minGrade || 0}</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '2px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>📝 Mes notes par cours</h2>
            {stats?.gradesByCourse?.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: 20 }}>Aucune note enregistrée</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: 12 }}>Cours</th>
                    <th style={{ textAlign: 'center', padding: 12 }}>Code</th>
                    <th style={{ textAlign: 'center', padding: 12 }}>Note</th>
                    <th style={{ textAlign: 'center', padding: 12 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.gradesByCourse?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: 12 }}>{item.courseName}</td>
                      <td style={{ padding: 12, textAlign: 'center', color: '#666' }}>{item.courseCode}</td>
                      <td style={{ padding: 12, textAlign: 'center', fontWeight: 'bold', color: '#3b82f6' }}>
                        {item.grade}
                      </td>
                      <td style={{ padding: 12, textAlign: 'center', color: '#666' }}>
                        {item.date ? new Date(item.date).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
