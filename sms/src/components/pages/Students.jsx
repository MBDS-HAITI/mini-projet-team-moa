import { useState, useMemo } from 'react';
import { useStudents } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './Students.css';

export default function Students() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const { data: students = [], loading: dataLoading, error } = useStudents();

  // Rôles: seul admin peut créer et supprimer; admin ou scolarité peuvent modifier
  const isAdmin = user?.role === 'admin';
  const canEdit = isAdmin || user?.role === 'scolarite';

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(s => 
      (s.firstname || '').toLowerCase().includes(term) ||
      (s.lastname || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.id || '').toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  const total = filteredStudents.length;
  const totalPages = pageSize === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

  // Sort students by lastname, then firstname
  const sorted = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const la = (a.lastname ?? '').toLowerCase();
      const lb = (b.lastname ?? '').toLowerCase();
      if (la < lb) return -1;
      if (la > lb) return 1;
      const fa = (a.firstname ?? '').toLowerCase();
      const fb = (b.firstname ?? '').toLowerCase();
      return fa < fb ? -1 : fa > fb ? 1 : 0;
    });
  }, [filteredStudents]);

  // Paginate students
  const visible = useMemo(() => {
    if (pageSize === 0) return sorted;
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: ''
    });
    setEditingId(null);
  };

  const handleEdit = (student) => {
    setFormData({
      firstName: student.firstname || '',
      lastName: student.lastname || '',
      email: student.email || ''
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        setMessage('Le prénom, le nom et l\'email sont obligatoires');
        setMessageType('error');
        setLoading(false);
        return;
      }

      const studentData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim()
      };

      if (editingId) {
        // Update student
        await apiClient.updateStudent(editingId, studentData);
        setMessage('Étudiant mis à jour avec succès!');
      } else {
        // Create student (admin uniquement)
        if (!isAdmin) {
          setMessage('Accès refusé: seule l\'administration peut créer un étudiant');
          setMessageType('error');
          setLoading(false);
          return;
        }
        await apiClient.createStudent(studentData);
        setMessage('Étudiant créé avec succès!');
      }
      setMessageType('success');
      resetForm();
      setShowForm(false);
      // Refresh the list
      window.location.reload();
    } catch (err) {
      setMessage(err.message || 'Erreur lors de l\'opération');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    // Suppression réservée à l'admin
    if (!isAdmin) {
      setMessage('Accès refusé: seule l\'administration peut supprimer un étudiant');
      setMessageType('error');
      return;
    }
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant?')) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.deleteStudent(studentId);
      setMessage('Étudiant supprimé avec succès!');
      setMessageType('success');
      // Refresh the list
      window.location.reload();
    } catch (err) {
      setMessage(err.message || 'Erreur lors de la suppression');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <main className="Main page-content"><p>📥 Loading students...</p></main>;
  if (error) return <main className="Main page-content"><p>❌ Error: {error}</p></main>;

  const goTo = (n) => setPage(Math.min(Math.max(1, n), totalPages));
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  return (
    <main className="Main page-content">
      <header style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',marginBottom:20}}>
        <div>
          <h1>🎓 Students</h1>
          <p>{total} students total</p>
        </div>
        
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              minWidth: 250
            }}
          />
          
          <select 
            value={pageSize} 
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{padding:'8px 12px',border:'1px solid #ddd',borderRadius:4}}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={0}>Show all</option>
          </select>

          {isAdmin && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {showForm ? '✕ Annuler' : '➕ Ajouter'}
            </button>
          )}
        </div>
      </header>

      {message && (
        <div className={`alert alert-${messageType}`} style={{marginBottom: 20}}>
          {message}
        </div>
      )}

      {showForm && (editingId ? canEdit : isAdmin) && (
        <div className="form-card" style={{marginBottom: 30}}>
          <h2>{editingId ? 'Modifier un étudiant' : 'Créer un nouvel étudiant'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ex: Jean"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ex: Dupont"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: jean.dupont@example.com"
                required
              />
            </div>



            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'En cours...' : editingId ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{borderBottom:'2px solid #333'}}>
            <th style={{textAlign:'left',padding:12}}>First Name</th>
            <th style={{textAlign:'left',padding:12}}>Last Name</th>
            <th style={{textAlign:'left',padding:12}}>Email</th>
            {(canEdit || isAdmin) && <th style={{textAlign:'center',padding:12}}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {visible.map((student) => (
            <tr key={student.id} style={{borderBottom:'1px solid #eee'}}>
              <td style={{padding:12}}>{student.firstname}</td>
              <td style={{padding:12}}>{student.lastname}</td>
              <td style={{padding:12}}>{student.email || '—'}</td>
              {(canEdit || isAdmin) && (
                <td style={{padding:12, textAlign:'center'}}>
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(student)}
                      style={{
                        padding: '4px 8px',
                        marginRight: 8,
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✎ Edit
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(student.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <footer style={{display:'flex',justifyContent:'center',alignItems:'center',gap:12,marginTop:20}}>
          <button onClick={prev} disabled={page === 1} style={{padding:'8px 16px',cursor:page===1?'not-allowed':'pointer'}}>
            ← Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={next} disabled={page === totalPages} style={{padding:'8px 16px',cursor:page===totalPages?'not-allowed':'pointer'}}>
            Next →
          </button>
        </footer>
      )}
    </main>
  );
}