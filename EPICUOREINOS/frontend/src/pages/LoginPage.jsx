import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { authService } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Carregar credenciais salvas ao montar o componente
  useEffect(() => {
    const savedCredentials = localStorage.getItem('epicuo_saved_credentials');
    if (savedCredentials) {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      } catch (err) {
        console.error('Erro ao carregar credenciais salvas:', err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Email e senha são obrigatórios');
        setLoading(false);
        return;
      }

      const { user, token } = await authService.login(email, password);
      authService.saveAuth(user, token);

      // Salvar ou remover credenciais com base no checkbox
      if (rememberMe) {
        localStorage.setItem(
          'epicuo_saved_credentials',
          JSON.stringify({ email, password })
        );
      } else {
        localStorage.removeItem('epicuo_saved_credentials');
      }

      // Redireciona para dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSavedCredentials = () => {
    localStorage.removeItem('epicuo_saved_credentials');
    setEmail('');
    setPassword('');
    setRememberMe(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3 }}>
            ⚔️ EPIC UO REINOS
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={loading}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Salvar senha"
              sx={{ mt: 1, mb: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Entrar'}
            </Button>

            {rememberMe && (
              <Button
                fullWidth
                variant="text"
                size="small"
                onClick={handleClearSavedCredentials}
                sx={{ mb: 2, color: '#f44336' }}
              >
                Limpar credenciais salvas
              </Button>
            )}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Não tem conta?{' '}
                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  Registre-se aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
