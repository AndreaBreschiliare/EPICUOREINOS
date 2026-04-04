import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Alert,
  Chip,
  LinearProgress,
  Snackbar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import GameHeader from '../components/GameHeader';
import { authService } from '../services/authService';
import { gameService } from '../services/gameService';
import { socketService } from '../services/socketService';

const RESOURCE_LABELS = {
  madeira: 'Madeira',
  pedra: 'Pedra',
  ferro: 'Ferro',
  comida: 'Comida',
  cobre: 'Cobre',
  pergaminhos: 'Pergaminhos',
  cristais: 'Cristais',
  minério_raro: 'Minério Raro',
};

const PRODUCTION_BUILDING_TYPES = ['fazenda', 'lenhador', 'minerador'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Guard: Verificar autenticação imediatamente
  useEffect(() => {
    const token = authService.getToken();
    const currentUser = authService.getUser();
    
    if (!token || !currentUser) {
      authService.logout();
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate]);

  const [feudInfo, setFeudInfo] = useState(null);
  const [resources, setResources] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [researchProgress, setResearchProgress] = useState({
    summary: { total: 0, completed: 0, inProgress: 0 },
    active: [],
    completed: [],
  });
  const [levelStatus, setLevelStatus] = useState(null);

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    severity: 'info',
    message: '',
  });
  const [buildDialogOpen, setBuildDialogOpen] = useState(false);
  const [researchDialogOpen, setResearchDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [demolishDialogOpen, setDemolishDialogOpen] = useState(false);
  const [availableBuildings, setAvailableBuildings] = useState([]);
  const [availableResearch, setAvailableResearch] = useState([]);
  const [upgradableBuildings, setUpgradableBuildings] = useState([]);
  const [demolishableBuildings, setDemolishableBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedResearch, setSelectedResearch] = useState('');
  const [selectedUpgradeBuildingId, setSelectedUpgradeBuildingId] = useState('');
  const [selectedDemolishBuildingId, setSelectedDemolishBuildingId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const activeConstruction = useMemo(() => {
    return buildings.find(item => item.status === 'construction') || null;
  }, [buildings]);

  const constructionProgress = useMemo(() => {
    if (!activeConstruction?.construction_start_time || !activeConstruction?.construction_end_time) {
      return 0;
    }

    const start = new Date(activeConstruction.construction_start_time).getTime();
    const end = new Date(activeConstruction.construction_end_time).getTime();
    const now = nowMs;

    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return 0;
    }

    const ratio = ((now - start) / (end - start)) * 100;
    return Math.max(0, Math.min(100, ratio));
  }, [activeConstruction, nowMs]);

  const remainingConstructionSeconds = useMemo(() => {
    if (!activeConstruction?.construction_end_time) {
      return 0;
    }

    return Math.max(
      0,
      Math.floor((new Date(activeConstruction.construction_end_time).getTime() - nowMs) / 1000)
    );
  }, [activeConstruction, nowMs]);

  const remainingResearchSeconds = useMemo(() => {
    if (!researchProgress.active?.length) return 0;

    const firstActive = researchProgress.active[0];

    // Prefer end_time-based countdown so it always updates without refresh.
    if (firstActive.research_end_time) {
      return Math.max(
        0,
        Math.floor((new Date(firstActive.research_end_time).getTime() - nowMs) / 1000)
      );
    }

    // Fallback for legacy payloads that only provide a static remaining value.
    return Math.max(0, Number(firstActive.remainingSeconds || 0));
  }, [researchProgress, nowMs]);

  const loadDashboardData = async (feudIdOverride = null) => {
    const myFeud = await gameService.getMyFeud();
    const currentFeudId = feudIdOverride || myFeud.feud.id;

    const [buildingData, researchData, levelData] = await Promise.all([
      gameService.getBuildings(currentFeudId),
      gameService.getResearchProgress(currentFeudId),
      gameService.getLevelStatus(currentFeudId),
    ]);

    setFeudInfo(myFeud.feud);
    setResources(myFeud.resources || {});
    setBuildings(buildingData.buildings || []);
    setResearchProgress(researchData);
    setLevelStatus(levelData);

    return currentFeudId;
  };

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, severity, message });
  };

  const handleOpenBuildDialog = async () => {
    if (!feudInfo?.id) return;
    try {
      setActionLoading(true);
      const data = await gameService.getAvailableBuildings(feudInfo.id);
      const options = (data.available || []).filter(item => item.canBuild);
      setAvailableBuildings(options);
      setSelectedBuilding(options[0]?.type || '');
      setBuildDialogOpen(true);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar construções disponíveis', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartBuilding = async () => {
    if (!feudInfo?.id || !selectedBuilding) return;
    try {
      setActionLoading(true);
      await gameService.startBuilding(feudInfo.id, selectedBuilding, 1);
      const [buildingData, myFeud] = await Promise.all([
        gameService.getBuildings(feudInfo.id),
        gameService.getMyFeud(),
      ]);
      setBuildings(buildingData.buildings || []);
      setResources(myFeud.resources || {});
      showToast('Construção iniciada com sucesso', 'success');
      setBuildDialogOpen(false);
    } catch (err) {
      showToast(err.message || 'Erro ao iniciar construção', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenResearchDialog = async () => {
    if (!feudInfo?.id) return;
    try {
      setActionLoading(true);
      const data = await gameService.getAvailableResearch(feudInfo.id);
      const options = (data.available || []).filter(item => item.canStart);
      setAvailableResearch(options);
      setSelectedResearch(options[0]?.techName || '');
      setResearchDialogOpen(true);
    } catch (err) {
      showToast(err.message || 'Erro ao carregar pesquisas disponíveis', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartResearch = async () => {
    if (!feudInfo?.id || !selectedResearch) return;
    try {
      setActionLoading(true);
      await gameService.startResearch(feudInfo.id, selectedResearch);
      const [researchData, myFeud] = await Promise.all([
        gameService.getResearchProgress(feudInfo.id),
        gameService.getMyFeud(),
      ]);
      setResearchProgress(researchData);
      setResources(myFeud.resources || {});
      showToast('Pesquisa iniciada com sucesso', 'success');
      setResearchDialogOpen(false);
    } catch (err) {
      showToast(err.message || 'Erro ao iniciar pesquisa', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLevelUp = async () => {
    if (!feudInfo?.id) return;
    try {
      setActionLoading(true);
      await gameService.levelUp(feudInfo.id);
      const [myFeud, levelData] = await Promise.all([
        gameService.getMyFeud(),
        gameService.getLevelStatus(feudInfo.id),
      ]);
      setFeudInfo(myFeud.feud);
      setResources(myFeud.resources || {});
      setLevelStatus(levelData);
      showToast('Ascensão concluída com sucesso', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao ascender de nível', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCollectResources = async () => {
    if (!feudInfo?.id) return;

    try {
      setActionLoading(true);
      await gameService.collectResources(feudInfo.id);
      const myFeud = await gameService.getMyFeud();
      setResources(myFeud.resources || {});
      showToast('Recursos coletados com sucesso', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao coletar recursos', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenUpgradeDialog = () => {
    const options = buildings.filter(item => item.status === 'complete');
    setUpgradableBuildings(options);
    setSelectedUpgradeBuildingId(options[0]?.id ? String(options[0].id) : '');
    setUpgradeDialogOpen(true);
  };

  const handleUpgradeBuilding = async () => {
    if (!feudInfo?.id || !selectedUpgradeBuildingId) return;

    try {
      setActionLoading(true);
      await gameService.upgradeBuilding(feudInfo.id, selectedUpgradeBuildingId);
      const [buildingData, myFeud] = await Promise.all([
        gameService.getBuildings(feudInfo.id),
        gameService.getMyFeud(),
      ]);
      setBuildings(buildingData.buildings || []);
      setResources(myFeud.resources || {});
      showToast('Upgrade iniciado com sucesso', 'success');
      setUpgradeDialogOpen(false);
    } catch (err) {
      showToast(err.message || 'Erro ao iniciar upgrade', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDemolishDialog = () => {
    const options = buildings.filter(item => item.status === 'complete');
    setDemolishableBuildings(options);
    setSelectedDemolishBuildingId(options[0]?.id ? String(options[0].id) : '');
    setDemolishDialogOpen(true);
  };

  const handleDemolishBuilding = async () => {
    if (!feudInfo?.id || !selectedDemolishBuildingId) return;

    try {
      setActionLoading(true);
      await gameService.demolishBuilding(feudInfo.id, selectedDemolishBuildingId);
      const [buildingData, myFeud] = await Promise.all([
        gameService.getBuildings(feudInfo.id),
        gameService.getMyFeud(),
      ]);
      setBuildings(buildingData.buildings || []);
      setResources(myFeud.resources || {});
      showToast('Edifício demolido com sucesso', 'success');
      setDemolishDialogOpen(false);
    } catch (err) {
      showToast(err.message || 'Erro ao demolir edifício', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = authService.getUser();
    const token = authService.getToken();
    
    // Se não está autenticado, redirecionar imediatamente
    if (!currentUser || !token) {
      authService.logout();
      navigate('/login', { replace: true });
      return;
    }
    
    setUser(currentUser);

    let isMounted = true;
    let feudId = null;

    const initialize = async () => {
      try {
        setLoading(true);
        feudId = await loadDashboardData();

        if (!isMounted || !feudId) return;

        const socket = socketService.connect();

        const onConnected = () => {
          setIsSocketConnected(true);
          socketService.subscribeToFeud(feudId);
        };

        const onDisconnected = () => {
          setIsSocketConnected(false);
        };

        const onSubscribed = () => {
          showToast('Atualizações em tempo real ativadas', 'success');
        };

        const onResourcesUpdated = payload => {
          if (payload?.resources) {
            setResources(payload.resources);
          }

          if (payload?.source === 'level_up') {
            showToast('Recursos ajustados após ascensão de nível', 'info');
          }
        };

        const onBuildingStarted = async payload => {
          showToast(`Construção iniciada: ${payload?.building?.type || 'edifício'}`, 'info');
          const data = await gameService.getBuildings(feudId);
          setBuildings(data.buildings || []);
        };

        const onBuildingCompleted = async () => {
          showToast('Construção concluída', 'success');
          const data = await gameService.getBuildings(feudId);
          setBuildings(data.buildings || []);
        };

        const onBuildingUpgraded = async payload => {
          const level = payload?.newLevel || payload?.building?.level;
          showToast(`Upgrade concluído para nível ${level || '?'}`, 'success');
          const data = await gameService.getBuildings(feudId);
          setBuildings(data.buildings || []);
        };

        const onBuildingDemolished = async payload => {
          showToast(`Edifício demolido: ${payload?.type || 'desconhecido'}`, 'warning');
          const data = await gameService.getBuildings(feudId);
          setBuildings(data.buildings || []);
        };

        const onResearchStarted = async payload => {
          const techName = payload?.research?.tech_name || payload?.research?.techName || 'pesquisa';
          showToast(`Pesquisa iniciada: ${techName}`, 'info');
          const data = await gameService.getResearchProgress(feudId);
          setResearchProgress(data);
        };

        const onResearchCompleted = async payload => {
          showToast(`Pesquisa concluída: ${payload?.techName || 'tecnologia'}`, 'success');
          const data = await gameService.getResearchProgress(feudId);
          setResearchProgress(data);
        };

        const onFeudLevelUp = async payload => {
          showToast(`Ascensão concluída: nível ${payload?.newLevel || '?'}`, 'success');
          const [myFeud, levelData] = await Promise.all([
            gameService.getMyFeud(),
            gameService.getLevelStatus(feudId),
          ]);
          setFeudInfo(myFeud.feud);
          setResources(myFeud.resources || {});
          setLevelStatus(levelData);
        };

        const onFeudError = payload => {
          showToast(payload?.error || 'Erro no canal em tempo real', 'error');
        };

        socketService.on('socket:connected', onConnected);
        socketService.on('disconnect', onDisconnected);
        socketService.on('feud:subscribed', onSubscribed);
        socketService.on('resources:updated', onResourcesUpdated);
        socketService.on('building:started', onBuildingStarted);
        socketService.on('building:completed', onBuildingCompleted);
        socketService.on('building:upgraded', onBuildingUpgraded);
        socketService.on('building:demolished', onBuildingDemolished);
        socketService.on('research:started', onResearchStarted);
        socketService.on('research:completed', onResearchCompleted);
        socketService.on('feud:level_up', onFeudLevelUp);
        socketService.on('feud:error', onFeudError);

        if (socket.connected) {
          onConnected();
        }

        return () => {
          socketService.off('socket:connected', onConnected);
          socketService.off('disconnect', onDisconnected);
          socketService.off('feud:subscribed', onSubscribed);
          socketService.off('resources:updated', onResourcesUpdated);
          socketService.off('building:started', onBuildingStarted);
          socketService.off('building:completed', onBuildingCompleted);
          socketService.off('building:upgraded', onBuildingUpgraded);
          socketService.off('building:demolished', onBuildingDemolished);
          socketService.off('research:started', onResearchStarted);
          socketService.off('research:completed', onResearchCompleted);
          socketService.off('feud:level_up', onFeudLevelUp);
          socketService.off('feud:error', onFeudError);

          if (feudId) {
            socketService.unsubscribeFromFeud(feudId);
          }
          socketService.disconnect();
        };
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Erro ao carregar dashboard');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    let cleanup = null;
    initialize().then(unsub => {
      cleanup = unsub;
    });

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [navigate]);

  const handleLogout = () => {
    socketService.disconnect();
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          color: '#0f172a',
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ color: '#334155' }}>
          Carregando dashboard...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const constructionCount = buildings.filter(item => item.status === 'construction').length;
  const completedCount = buildings.filter(item => item.status === 'complete').length;
  const productionCount = buildings.filter(item => PRODUCTION_BUILDING_TYPES.includes(item.type)).length;

  return (
    <Box sx={{ bgcolor: '#2C1810', minHeight: '100vh' }}>
      {/* Header with Navigation */}
      <GameHeader playerLevel={feudInfo?.level || 1} playerName={user?.username || 'Player'} />

      {/* Main Content */}
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Bem-vindo, {user.username}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Email: {user.email}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  ID do Feudo
                </Typography>
                <Typography variant="h5">{feudInfo?.id || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Nível
                </Typography>
                <Typography variant="h5">{feudInfo?.level || 1}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Cultura
                </Typography>
                <Typography variant="h5">{feudInfo?.culture || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Moral
                </Typography>
                <Typography variant="h5">{feudInfo?.moral || 0}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

          {/* Resources */}
          <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recursos em Tempo Real
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(RESOURCE_LABELS).map(([key, label]) => (
              <Grid item xs={6} sm={3} key={key}>
                <Typography variant="body2" color="textSecondary">
                  {label}
                </Typography>
                <Typography variant="h6">
                  {Number(resources[key] || 0).toLocaleString('pt-BR')}
                </Typography>
              </Grid>
            ))}
          </Grid>
          </Paper>

          {/* Realtime Progress */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Construções
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Em construção: {constructionCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Concluídas: {completedCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Estruturas de produção: {productionCount}
                </Typography>
              </Stack>

              {activeConstruction ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Progresso: {activeConstruction.type} (nível {activeConstruction.level})
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={constructionProgress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {Math.round(constructionProgress)}% concluído
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    Tempo restante aproximado: {remainingConstructionSeconds}s
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Nenhuma construção em andamento.
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Pesquisas
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Total: {researchProgress.summary?.total || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Concluídas: {researchProgress.summary?.completed || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Em andamento: {researchProgress.summary?.inProgress || 0}
                </Typography>
              </Stack>

              {researchProgress.active?.length ? (
                <Box>
                  <Typography variant="body2">
                    Pesquisa ativa: {researchProgress.active[0].tech_name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Tempo restante aproximado: {remainingResearchSeconds}s
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Nenhuma pesquisa ativa no momento.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Level Up */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Ascensão de Nível
          </Typography>
          {levelStatus ? (
            <Stack spacing={1}>
              <Typography variant="body2" color="textSecondary">
                Nível atual: {levelStatus.currentLevel}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Próximo nível: {levelStatus.targetLevel}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Elegível agora: {levelStatus.canLevelUp ? 'Sim' : 'Não'}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Carregando status de ascensão...
            </Typography>
          )}
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ações Rápidas
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={handleCollectResources} disabled={actionLoading}>
              Coletar
            </Button>
            <Button variant="contained" onClick={handleOpenBuildDialog} disabled={actionLoading}>
              Construir
            </Button>
            <Button variant="contained" onClick={handleOpenUpgradeDialog} disabled={actionLoading || !buildings.length}>
              Upgrade
            </Button>
            <Button variant="contained" color="warning" onClick={handleOpenDemolishDialog} disabled={actionLoading || !buildings.length}>
              Demolir
            </Button>
            <Button variant="contained" onClick={handleOpenResearchDialog} disabled={actionLoading}>
              Pesquisar
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleLevelUp}
              disabled={actionLoading || !levelStatus?.canLevelUp}
            >
              Ascender
            </Button>
            <Button variant="outlined">Configurações</Button>
          </Box>
          </Paper>

          {/* Info Message */}
          <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              O dashboard agora reflete eventos em tempo real de recursos, construções, pesquisas e ascensão de nível.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Dialogs and Snackbars outside of the main content */}
      <Dialog open={buildDialogOpen} onClose={() => setBuildDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Iniciar Construção</DialogTitle>
        <DialogContent>
          {availableBuildings.length ? (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="building-select-label">Edifício</InputLabel>
              <Select
                labelId="building-select-label"
                value={selectedBuilding}
                label="Edifício"
                onChange={(event) => setSelectedBuilding(event.target.value)}
              >
                {availableBuildings.map(item => (
                  <MenuItem key={item.type} value={item.type}>
                    {item.name} ({item.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Alert severity="info" sx={{ mt: 1 }}>
              Nenhum edifício disponível para construção agora.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuildDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleStartBuilding}
            variant="contained"
            disabled={!selectedBuilding || actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Construir'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={researchDialogOpen} onClose={() => setResearchDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Iniciar Pesquisa</DialogTitle>
        <DialogContent>
          {availableResearch.length ? (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="research-select-label">Pesquisa</InputLabel>
              <Select
                labelId="research-select-label"
                value={selectedResearch}
                label="Pesquisa"
                onChange={(event) => setSelectedResearch(event.target.value)}
              >
                {availableResearch.map(item => (
                  <MenuItem key={item.techName} value={item.techName}>
                    {item.name} ({item.techName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Alert severity="info" sx={{ mt: 1 }}>
              Nenhuma pesquisa disponível para iniciar agora.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResearchDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleStartResearch}
            variant="contained"
            disabled={!selectedResearch || actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Pesquisar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Iniciar Upgrade de Construção</DialogTitle>
        <DialogContent>
          {upgradableBuildings.length ? (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="upgrade-building-select-label">Edifício</InputLabel>
              <Select
                labelId="upgrade-building-select-label"
                value={selectedUpgradeBuildingId}
                label="Edifício"
                onChange={(event) => setSelectedUpgradeBuildingId(event.target.value)}
              >
                {upgradableBuildings.map(item => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.type} (ID {item.id}, nível {item.level})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Alert severity="info" sx={{ mt: 1 }}>
              Nenhum edifício concluído disponível para upgrade.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleUpgradeBuilding}
            variant="contained"
            disabled={!selectedUpgradeBuildingId || actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Iniciar Upgrade'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={demolishDialogOpen} onClose={() => setDemolishDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Demolir Construção</DialogTitle>
        <DialogContent>
          {demolishableBuildings.length ? (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="demolish-building-select-label">Edifício</InputLabel>
              <Select
                labelId="demolish-building-select-label"
                value={selectedDemolishBuildingId}
                label="Edifício"
                onChange={(event) => setSelectedDemolishBuildingId(event.target.value)}
              >
                {demolishableBuildings.map(item => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.type} (ID {item.id}, nível {item.level})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Alert severity="info" sx={{ mt: 1 }}>
              Nenhum edifício concluído disponível para demolição.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDemolishDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDemolishBuilding}
            variant="contained"
            color="warning"
            disabled={!selectedDemolishBuildingId || actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Demolir'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
