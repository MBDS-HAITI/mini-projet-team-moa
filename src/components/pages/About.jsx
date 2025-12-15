import { aproposInfo } from '../../data/index.js';

export default function About() {
  const { title, description, contact, stats } = aproposInfo;
  const { email, phone, programmeur } = contact;
  const { totalEtudiants, totalMatieres, totalNotes, global, parMatiere } = stats;

  return (
    <main className="Main page-content apropos-page">
      <div className="apropos-header">
        <h1>ℹ️ About</h1>
        <p className="apropos-description">{description}</p>
      </div>

      <div className="apropos-container">
        
        {/* Title Section */}
        <section className="apropos-section">
          <h2>{title}</h2>
          <p>
          The Faculty of Sciences of the State University of Haiti has been offering since 1999 a Master's program
          (MBDS - Databases and Systems Integration) in partnership with the University of Nice,
          Sophia Antipolis.
          </p>
        </section>

        {/* Global Statistics Section */}
        <section className="apropos-section">
          <h2>📊 Global Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <p className="stat-label">Students</p>
                <p className="stat-value">{totalEtudiants}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <p className="stat-label">Courses</p>
                <p className="stat-value">{totalMatieres}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <p className="stat-label">Records</p>
                <p className="stat-value">{totalNotes}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <p className="stat-label">Global Average</p>
                <p className="stat-value">{global.moyenne}/100</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Statistics Section */}
        <section className="apropos-section">
          <h2>📈 Detailed Statistics</h2>
          <div className="stats-detailed">
            <div className="stat-item">
              <span className="stat-icon-text">📊</span>
              <span className="stat-label">Average</span>
              <span className="stat-value">{global.moyenne}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon-text">⬆️</span>
              <span className="stat-label">Maximum</span>
              <span className="stat-value">{global.max}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon-text">⬇️</span>
              <span className="stat-label">Minimum</span>
              <span className="stat-value">{global.min}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon-text">📍</span>
              <span className="stat-label">Median</span>
              <span className="stat-value">{global.median}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon-text">📉</span>
              <span className="stat-label">Std Deviation</span>
              <span className="stat-value">{global.standardDeviation}</span>
            </div>
          </div>
        </section>

        {/* Performance by Course Section */}
        <section className="apropos-section">
          <h2>📚 Performance by Course</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e6eef8' }}>Course</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e6eef8' }}>Records</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e6eef8' }}>Average</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e6eef8' }}>Max</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e6eef8' }}>Min</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e6eef8' }}>Median</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(parMatiere).map(([course, { count, moyenne, max, min, median }]) => (
                <tr key={course}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{course}</td>
                  <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{count}</td>
                  <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{moyenne}</td>
                  <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{max}</td>
                  <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{min}</td>
                  <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{median}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Contact Section */}
        <section className="apropos-section contact-section">
          <h2>📞 Contact</h2>
          <div className="contact-info">
            <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
            <p><strong>Phone:</strong> <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></p>
            <p><strong>Developer:</strong> <a href={`prog:${programmeur}`}>{programmeur}</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}