import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user, authToken } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8010/api";

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Mot de passe défini avec succès ! Vous pouvez maintenant vous connecter avec votre email et mot de passe.' });
        setNewPassword('');
        setConfirmPassword('');
        fetchUserInfo();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la définition du mot de passe' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        ⚙️ Paramètres du compte
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Informations du profil
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Nom d'utilisateur</Typography>
              <Typography variant="body1" fontWeight={500}>{user?.username || 'Non défini'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1" fontWeight={500}>{user?.email || 'Non défini'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Rôle</Typography>
              <Chip 
                label={user?.role || 'student'} 
                color="primary" 
                size="small" 
                sx={{ mt: 0.5, textTransform: 'capitalize' }}
              />
            </Box>
            {userInfo?.isOAuthUser && (
              <Box>
                <Typography variant="body2" color="text.secondary">Type de compte</Typography>
                <Chip 
                  label="Compte OAuth (Google)" 
                  color="info" 
                  size="small" 
                  sx={{ mt: 0.5 }}
                  icon={<span>🔐</span>}
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {userInfo?.hasPassword ? 'Modifier le mot de passe' : 'Définir un mot de passe'}
          </Typography>
          
          {userInfo?.isOAuthUser && !userInfo?.hasPassword && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Vous utilisez actuellement OAuth pour vous connecter. 
              Définissez un mot de passe pour pouvoir également vous connecter avec votre email et mot de passe.
            </Alert>
          )}

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSetPassword}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Nouveau mot de passe"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
                helperText="Au moins 6 caractères"
              />
              
              <TextField
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />

              {message.text && (
                <Alert severity={message.type} onClose={() => setMessage({ type: '', text: '' })}>
                  {message.text}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ alignSelf: 'flex-start' }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    En cours...
                  </>
                ) : (
                  userInfo?.hasPassword ? 'Modifier le mot de passe' : 'Définir le mot de passe'
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
