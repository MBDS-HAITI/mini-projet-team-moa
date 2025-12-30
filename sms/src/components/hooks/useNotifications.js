import { useEffect, useState } from 'react';

// Dummy API call for notifications (replace with real API logic)
function fetchNotifications(userId) {
  return Promise.resolve([
    { _id: 1, message: 'Bienvenue !' },
    { _id: 2, message: 'Nouvelle note disponible.' }
  ]);
}

export default function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetchNotifications(userId)
      .then(data => setNotifications(data))
      .catch(err => setError(err.message || 'Erreur de chargement des notifications'))
      .finally(() => setLoading(false));
  }, [userId]);

  return { notifications, loading, error };
}
