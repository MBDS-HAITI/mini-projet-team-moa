import { useEffect, useState } from 'react';
import { useUsers } from '../../hooks/useApi';
import apiClient from '../../api/apiClient';

function Users() {
  const { data: users, loading, error } = useUsers();
  const [localUsers, setLocalUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const roleLabels = {
    admin: 'Admin',
    teacher: 'Scolarité',
    student: 'Étudiant'
  };

  useEffect(() => {
    setLocalUsers(users || []);
  }, [users]);

  const normalizeUser = (user) => ({
    id: user.id || user._id,
    username: user.username,
    email: user.email,
    role: user.role
  });

  const itemsPerPage = 10;

  const filtered = localUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const visible = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const prev = () => setPage(p => Math.max(1, p - 1));
  const next = () => setPage(p => Math.min(totalPages, p + 1));

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'student'
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', role: 'student' });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (editingUser) {
        // Update user
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        const updated = await apiClient.updateUser(editingUser.id, updateData);
        setLocalUsers((prev) => prev.map((u) => (u.id === editingUser.id ? normalizeUser(updated) : u)));
      } else {
        // Create user
        if (!formData.password) {
          setFormError('Le mot de passe est requis pour un nouvel utilisateur');
          setFormLoading(false);
          return;
        }
        const created = await apiClient.createUser(formData);
        setLocalUsers((prev) => [...prev, normalizeUser(created)]);
      }
      
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Une erreur est survenue');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await apiClient.deleteUser(userId);
      setLocalUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 24, color: '#666' }}>Chargement des utilisateurs...</div>
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

  return (
    <div style={{ padding: 40 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 16 }}>👤 Utilisateurs</h1>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 16
            }}
          />
          <button
            onClick={() => handleOpenModal()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ➕ Ajouter
          </button>
        </div>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ textAlign: 'left', padding: 12 }}>Nom d'utilisateur</th>
            <th style={{ textAlign: 'left', padding: 12 }}>Email</th>
            <th style={{ textAlign: 'left', padding: 12 }}>Rôle</th>
            <th style={{ textAlign: 'center', padding: 12 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 12 }}>{user.username}</td>
              <td style={{ padding: 12 }}>{user.email}</td>
              <td style={{ padding: 12 }}>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor:
                      user.role === 'admin' ? '#ef4444' :
                      user.role === 'teacher' ? '#3b82f6' :
                      '#10b981',
                    color: 'white'
                  }}
                >
                  {roleLabels[user.role] || user.role}
                </span>
              </td>
              <td style={{ padding: 12, textAlign: 'center' }}>
                <button
                  onClick={() => handleOpenModal(user)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14,
                    cursor: 'pointer',
                    marginRight: 8
                  }}
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <footer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <button onClick={prev} disabled={page === 1} style={{ padding: '8px 16px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
            ← Précédent
          </button>
          <span>Page {page} sur {totalPages}</span>
          <button onClick={next} disabled={page === totalPages} style={{ padding: '8px 16px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
            Suivant →
          </button>
        </footer>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: 32,
              borderRadius: 12,
              width: '90%',
              maxWidth: 500,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
              {editingUser ? '✏️ Modifier l\'utilisateur' : '➕ Nouvel utilisateur'}
            </h2>

            {formError && (
              <div style={{ padding: 12, backgroundColor: '#fee', color: '#c00', borderRadius: 8, marginBottom: 16 }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Mot de passe {editingUser ? '' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? 'Laisser vide pour ne pas changer' : ''}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Rôle *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                >
                  <option value="student">Étudiant</option>
                  <option value="teacher">Scolarité</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={formLoading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    cursor: formLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: formLoading ? '#9ca3af' : '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: formLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {formLoading ? 'En cours...' : (editingUser ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
