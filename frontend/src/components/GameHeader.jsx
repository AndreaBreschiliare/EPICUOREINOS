import { AppBar, Toolbar, Box, Button, Stack, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://api.odisseiadamente.com.br/api';

export default function GameHeader({ playerLevel = 2, playerName = 'Player' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getUser();
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar role no backend
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const token = authService.getToken();
        const isAuth = authService.isAuthenticated();
        console.log('🔍 GameHeader Debug:', { isAuth, tokenExists: !!token, user });
        
        if (!token) {
          console.warn('❌ Sem token no localStorage');
          setIsAdmin(user?.role === 'admin');
          return;
        }

        console.log(`📡 Chamando GET ${API_URL}/debug/get-role`);
        const response = await fetch(`${API_URL}/debug/get-role`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📦 Response status:', response.status, response.ok);
        const data = await response.json();
        console.log('📄 Response data:', data);

        if (response.ok && data.data?.role) {
          console.log('✅ Role encontrado:', data.data.role);
          setIsAdmin(data.data.role === 'admin');
        } else {
          console.warn('⚠️ Sem role na resposta, usando fallback localStorage');
          setIsAdmin(user?.role === 'admin');
        }
      } catch (error) {
        console.error('❌ Erro ao verificar role:', error);
        // Fallback: verificar localStorage
        console.log('🔄 Fallback para localStorage, user.role =', user?.role);
        setIsAdmin(user?.role === 'admin');
      }
    };

    if (authService.isAuthenticated()) {
      checkAdminRole();
    } else {
      console.log('⚠️ Não autenticado');
    }
  }, [user]);

  const tabs = [
    { label: 'Reino', path: '/dashboard', icon: '⚔️' },
    { label: 'Leis', path: '/dashboard', icon: '📜' },
    { label: 'Construções', path: '/dashboard', icon: '🏗️' },
    { label: 'Pesquisa', path: '/research', icon: '📚' },
  ];

  const currentTab = location.pathname;
  const currentTabLabel = tabs.find(t => t.path === currentTab)?.label || 'Reino';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(to bottom, #4A4A4A, #3D2817)',
        borderBottom: '3px solid #8B6F47',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          px: 3,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            fontFamily: "'Cinzel', serif",
            fontSize: 24,
            fontWeight: 900,
            color: '#D4A574',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            cursor: 'pointer',
            minWidth: 'fit-content',
            '&:hover': { opacity: 0.8 },
          }}
          onClick={() => navigate('/dashboard')}
        >
          ⚔ EPIC UO
        </Box>

        {/* Navigation Tabs */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flex: 1,
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {tabs.map(tab => (
            <Button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              variant={currentTabLabel === tab.label ? 'contained' : 'outlined'}
              sx={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                px: 2,
                py: 1,
                bgcolor: currentTabLabel === tab.label ? '#2D5016' : 'rgba(212, 165, 116, 0.2)',
                color: currentTabLabel === tab.label ? '#E8D4B8' : '#D4A574',
                border: `2px solid ${currentTabLabel === tab.label ? '#E8D4B8' : '#D4A574'}`,
                borderRadius: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: currentTabLabel === tab.label ? '#3a6b1f' : 'rgba(212, 165, 116, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </Stack>

        {/* Player Info */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            minWidth: 'fit-content',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              fontSize: 12,
              color: '#D4A574',
            }}
          >
            <Chip
              label={`🏰 Nível ${playerLevel}`}
              size="small"
              sx={{
                bgcolor: 'rgba(212, 165, 116, 0.3)',
                color: '#D4A574',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
              }}
            />
            <Chip
              label={`👤 ${playerName}`}
              size="small"
              sx={{
                bgcolor: 'rgba(212, 165, 116, 0.3)',
                color: '#D4A574',
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
              }}
            />
            {isAdmin && (
              <Chip
          {isAdmin && (
            <Button
              onClick={() => navigate('/admin')}
              variant="contained"
              size="small"
              sx={{
                bgcolor: '#8B5A3A',
                color: '#E8D4B8',
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: 10,
                border: '2px solid #D4A574',
                '&:hover': {
                  bgcolor: '#A0734A',
                },
              }}
            >
              🛡️ Admin
            </Button>
          )}

                label="🛡️ ADMIN"
                size="small"
                sx={{
                  bgcolor: 'rgba(212, 100, 100, 0.5)',
                  color: '#FF9999',
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 900,
                  border: '2px solid #D46464',
                }}
              />
            )}
          </Box>

          <Button
            onClick={handleLogout}
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#8B3A3A',
              color: '#E8D4B8',
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: 10,
              '&:hover': {
                bgcolor: '#A0444A',
              },
            }}
          >
            Sair
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
