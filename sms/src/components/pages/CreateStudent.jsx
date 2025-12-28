import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import './CreateStudent.css';

function CreateStudent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Only admin can create students
  const isAuthorized = user?.role === 'admin';

  if (!isAuthorized) {
    return (
      <div className="create-student-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Only an administrator can create a student.</p>
          <button onClick={() => navigate('/home')} className="btn-back">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        setError('Le prénom, le nom et l\'email sont obligatoires');
        setLoading(false);
        return;
      }

      const studentData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        address: formData.address.trim() || null
      };

      await apiClient.createStudent(studentData);
      setSuccess('Étudiant créé avec succès!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/students');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'étudiant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-student-container">
      <div className="create-student-card">
        <h1>Créer un nouvel étudiant</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: +33612345678"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date de naissance</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ex: 123 Rue de la Paix, 75000 Paris"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer l\'étudiant'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/students')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStudent;
