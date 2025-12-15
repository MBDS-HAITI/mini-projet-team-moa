// API client to communicate with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8010/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiClient = {
  // Grades
  async getGrades() {
    const res = await fetch(`${API_BASE_URL}/grades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch grades');
    }
    return res.json();
  },

  async getStudents() {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch students');
    }
    return res.json();
  },

  async getCourses() {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch courses');
    }
    return res.json();
  },

  // Add CRUD operations for Grades
  async createGrade(data) {
    const res = await fetch(`${API_BASE_URL}/grades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) 
      throw new Error('Failed to create grade');
    return res.json();
  },

  async updateGrade(id, data) {
    const res = await fetch(`${API_BASE_URL}/grades/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) 
      throw new Error('Failed to update grade');
    return res.json();
  },

  async deleteGrade(id) {
    const res = await fetch(`${API_BASE_URL}/grades/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    if (!res.ok) 
      throw new Error('Failed to delete grade');
    return res.json();
  },

  // Users CRUD
  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch users');
    }
    return res.json();
  },

  async createUser(data) {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create user');
    }
    return res.json();
  },

  async updateUser(id, data) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update user');
    }
    return res.json();
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete user');
    }
    return res.json();
  }
};

export default apiClient;




