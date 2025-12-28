import { useMemo, useState } from 'react';
import { useCourses, useGrades, useStudents } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';

export default function Grades() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ studentId: '', courseId: '', grade: '', date: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const { data: grades = [], loading, error, createGrade, updateGrade, deleteGrade } = useGrades();
  const { data: courses = [] } = useCourses();
  const { data: students = [] } = useStudents();

  const role = (user?.role || '').toLowerCase();
  const canEdit = role === 'admin' || role === 'scolarite';
  const isStudent = role === 'student';

  // Filter grades: students see only their own
  const roleFilteredGrades = useMemo(() => {
    if (!isStudent) return grades;
    // Backend already filters, but ensure client-side filter for students
    return grades.filter(g => 
      g.studentId === user?.id || 
      (user?.email && g.studentEmail === user.email)
    );
  }, [grades, isStudent, user?.id, user?.email]);

  // Filter grades based on search
  const filteredGrades = useMemo(() => {
    if (!searchTerm) return roleFilteredGrades;
    const term = searchTerm.toLowerCase();
    return roleFilteredGrades.filter(g => 
      (g.courseName || '').toLowerCase().includes(term) ||
      (`${g.studentFirstName || ''} ${g.studentLastName || ''}`).toLowerCase().includes(term) ||
      (g.id || '').toLowerCase().includes(term) ||
      (g.grade?.toString() || '').includes(term)
    );
  }, [roleFilteredGrades, searchTerm]);

  // Sort grades
  const sortedGrades = useMemo(() => {
    if (!sortConfig.key) return filteredGrades;
    
    return [...filteredGrades].sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'student') {
        aValue = `${a.studentLastName || ''} ${a.studentFirstName || ''}`.toLowerCase();
        bValue = `${b.studentLastName || ''} ${b.studentFirstName || ''}`.toLowerCase();
      } else if (sortConfig.key === 'grade') {
        aValue = a.grade || 0;
        bValue = b.grade || 0;
      } else if (sortConfig.key === 'date') {
        aValue = a.date ? new Date(a.date).getTime() : 0;
        bValue = b.date ? new Date(b.date).getTime() : 0;
      } else {
        aValue = (a[sortConfig.key] || '').toString().toLowerCase();
        bValue = (b[sortConfig.key] || '').toString().toLowerCase();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredGrades, sortConfig]);

  const total = sortedGrades.length;
  const totalPages = pageSize === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

  // Paginate grades
  const visible = useMemo(() => {
    if (pageSize === 0) return sortedGrades;
    const start = (page - 1) * pageSize;
    return sortedGrades.slice(start, start + pageSize);
  }, [sortedGrades, page, pageSize]);

  if (loading) return <main className="Main page-content"><p>📥 Loading grades...</p></main>;
  if (error) return <main className="Main page-content"><p>❌ Error: {error}</p></main>;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const goTo = (n) => setPage(Math.min(Math.max(1, n), totalPages));
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  const resetForm = () => {
    setFormData({ studentId: '', courseId: '', grade: '', date: '' });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (grade) => {
    setEditingId(grade.id);
    setFormData({
      studentId: grade.studentId || '',
      courseId: grade.courseId || '',
      grade: grade.grade ?? '',
      date: grade.date ? grade.date.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setSubmitting(true);
    setMessage('');

    try {
      const payload = {
        student: formData.studentId,
        course: formData.courseId,
        grade: Number(formData.grade),
        date: formData.date || undefined
      };

      if (!payload.student || !payload.course || Number.isNaN(payload.grade)) {
        setMessage('Student, course and grade are required');
        setMessageType('error');
        setSubmitting(false);
        return;
      }

      if (editingId) {
        await updateGrade(editingId, payload);
        setMessage('Grade updated');
      } else {
        await createGrade(payload);
        setMessage('Grade created');
      }
      setMessageType('success');
      resetForm();
      setShowForm(false);
    } catch (err) {
      setMessage(err.message || 'Operation failed');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm('Delete this grade?')) return;
    try {
      await deleteGrade(id);
      setMessage('Grade deleted');
      setMessageType('success');
    } catch (err) {
      setMessage(err.message || 'Delete failed');
      setMessageType('error');
    }
  };

  return (
    <main className="Main page-shell">
      <section className="page-card">
        <header className="page-header">
          <div>
            <h1>📊 Grades</h1>
            <p style={{margin:0,color:'#475569'}}>{total} grades total</p>
          </div>
          <div className="toolbar">
            <input
              className="input"
              type="text"
              placeholder="Search by student, course, or grade..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            
            <select 
              className="select"
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={0}>Show all</option>
            </select>

            {canEdit && (
              <button
                className="btn-primary-solid"
                onClick={() => {
                  resetForm();
                  setShowForm((v) => !v);
                }}
              >
                {showForm ? '✕ Close' : '➕ Add'}
              </button>
            )}
          </div>
        </header>

        {message && (
          <div className={`banner ${messageType === 'error' ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {isStudent && (
          <div className="banner" style={{backgroundColor: '#dbeafe', color: '#1e40af', marginBottom: 16}}>
            ℹ️ Affichage de vos notes uniquement
          </div>
        )}

        {showForm && canEdit && (
          <div className="page-card" style={{marginBottom: 16}}>
            <h2 style={{margin: 0, marginBottom: 10}}>{editingId ? 'Edit grade' : 'Create grade'}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                <span>Student *</span>
                <select
                  className="select"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstname} {s.lastname}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Course *</span>
                <select
                  className="select"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Grade *</span>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 15"
                />
              </label>

              <label>
                <span>Date</span>
                <input
                  className="input"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </label>

              <div className="actions" style={{marginTop: 6}}>
                <button
                  type="submit"
                  className="btn-primary-solid"
                  disabled={submitting}
                  style={{opacity: submitting ? 0.7 : 1}}
                >
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => { resetForm(); setShowForm(false); }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="table-card page-card" style={{paddingTop:0}}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('student')}>
                    Student {sortConfig.key === 'student' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('courseName')}>
                    Course {sortConfig.key === 'courseName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('grade')}>
                    Grade {sortConfig.key === 'grade' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('date')}>
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  {canEdit && <th style={{textAlign:'center'}}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {visible.map((grade) => (
                  <tr key={grade.id}>
                    <td>{grade.id}</td>
                    <td>
                      <span className="chip">{grade.studentFirstName} {grade.studentLastName}</span>
                    </td>
                    <td>{grade.courseName}</td>
                    <td style={{fontWeight:'700'}}>{grade.grade}</td>
                    <td>{grade.date ? new Date(grade.date).toLocaleDateString('fr-FR') : '—'}</td>
                    {canEdit && (
                      <td>
                        <div className="actions" style={{justifyContent:'center'}}>
                          <button className="btn-ghost" onClick={() => handleEdit(grade)}>✏️ Edit</button>
                          <button className="btn-ghost danger" onClick={() => handleDelete(grade.id)}>🗑 Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <footer className="toolbar" style={{justifyContent:'center'}}>
            <button onClick={prev} className="btn-ghost" disabled={page === 1}>
              ← Previous
            </button>
            <span style={{fontWeight:600}}>Page {page} of {totalPages}</span>
            <button onClick={next} className="btn-ghost" disabled={page === totalPages}>
              Next →
            </button>
          </footer>
        )}
      </section>
    </main>
  );
}