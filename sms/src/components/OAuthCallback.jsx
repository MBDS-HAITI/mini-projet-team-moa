import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const oauthToken = searchParams.get('oauth');
    
    if (token && oauthToken) {
      handleOAuthCallback(token, oauthToken);
    } else {
      navigate('/');
    }
  }, [searchParams, handleOAuthCallback, navigate]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      gap: 2 
    }}>
      <CircularProgress size={60} />
      <Typography variant="h6">Connexion en cours...</Typography>
    </Box>
  );
}
