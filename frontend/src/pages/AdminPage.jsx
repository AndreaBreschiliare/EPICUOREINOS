import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import GameHeader from '../components/GameHeader';
import { authService } from '../services/authService';

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://api.odisseiadamente.com.br/api';

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    const token = authService.getToken();

    if (!currentUser || !token) {
      authService.logout();
      navigate('/login', { replace: true });
      return;
    }

    loadAdminData();
  }, [navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }),
        fetch(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }),
      ]);

      if (!usersRes.ok || !statsRes.ok) {
        let errorMessage = 'Erro ao carregar dados admin';
        try {
          const errorData = await usersRes.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Se não conseguir parsear JSON, usa mensagem padrão
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      setUsers(usersData.data || []);
      setStats(statsData.data || {});
    } catch (err) {
      console.error('Erro ao carregar admin data:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      console.log('🗑️ Deletando usuário:', selectedUser.email);

      const response = await fetch(`${API_URL}/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });

      console.log('📦 Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Erro ao deletar usuário';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ User deleted successfully:', data);

      // Remover usuário da lista
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setError('');
      setSuccessMessage(`✅ Usuário ${selectedUser.username} deletado com sucesso!`);
      
      // Limpar mensagem após 4 segundos
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      setError(err.message || 'Erro ao deletar usuário');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      }}
    >
      <GameHeader playerLevel={1} playerName="Admin" />

      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <Typography
          variant="h3"
          sx={{
            color: '#D4A574',
            fontWeight: 'bold',
            marginBottom: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          🛡️ Painel de Admin
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Estatísticas */}
        {stats && (
          <Grid container spacing={2} sx={{ marginBottom: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'rgba(212, 165, 116, 0.1)', border: '2px solid #D4A574' }}>
                <CardContent>
                  <Typography sx={{ color: '#D4A574', fontWeight: 'bold' }}>
                    Total de Usuários
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff' }}>
                    {stats.totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'rgba(75, 165, 116, 0.1)', border: '2px solid #4BA574' }}>
                <CardContent>
                  <Typography sx={{ color: '#4BA574', fontWeight: 'bold' }}>
                    Players
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff' }}>
                    {stats.players}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'rgba(212, 100, 100, 0.1)', border: '2px solid #D46464' }}>
                <CardContent>
                  <Typography sx={{ color: '#D46464', fontWeight: 'bold' }}>
                    Admins
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff' }}>
                    {stats.admins}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'rgba(165, 165, 165, 0.1)', border: '2px solid #A5A5A5' }}>
                <CardContent>
                  <Typography sx={{ color: '#A5A5A5', fontWeight: 'bold' }}>
                    Total de Reinos
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff' }}>
                    {stats.totalFeuds}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabela de Usuários */}
        <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(50, 50, 50, 0.8)',
            border: '2px solid #D4A574',
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(212, 165, 116, 0.2)' }}>
                <TableCell sx={{ color: '#D4A574', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: '#D4A574', fontWeight: 'bold' }}>Usuário</TableCell>
                <TableCell sx={{ color: '#D4A574', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#D4A574', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ color: '#D4A574', fontWeight: 'bold' }}>Criado em</TableCell>
                <TableCell sx={{ color: '#D4A574', fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ borderBottom: '1px solid #8B6F47' }}>
                  <TableCell sx={{ color: '#fff' }}>{user.id}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{user.username}</TableCell>
                  <TableCell sx={{ color: '#999' }}>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.toUpperCase()}
                      sx={{
                        background: user.role === 'admin' ? '#D46464' : '#4BA574',
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#999' }}>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(user)}
                      disabled={actionLoading}
                      sx={{
                        background: '#D46464',
                        '&:hover': { background: '#E67474' },
                      }}
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog de Confirmação */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              background: 'rgba(50, 50, 50, 0.95)',
              border: '2px solid #D46464',
            },
          }}
        >
          <DialogTitle sx={{ color: '#D46464', fontWeight: 'bold' }}>
            ⚠️ Confirmar Exclusão
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#fff', marginTop: 2 }}>
              Tem certeza que deseja deletar o usuário <strong>{selectedUser?.username}</strong>?
            </Typography>
            <Typography sx={{ color: '#999', marginTop: 1, fontSize: '0.9em' }}>
              Todos os seus reinos também serão deletados.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#8B6F47' }}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDeleteUser}
              variant="contained"
              color="error"
              sx={{
                background: '#D46464',
                '&:hover': { background: '#E67474' },
              }}
              disabled={actionLoading}
            >
              {actionLoading ? <CircularProgress size={20} /> : 'Deletar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
