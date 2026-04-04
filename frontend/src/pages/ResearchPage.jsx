import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import GameHeader from '../components/GameHeader';
import researchTreeConfig, { branchConfig } from '../config/researchConfig';
import { gameService } from '../services/gameService';
import { socketService } from '../services/socketService';
import './ResearchPage.css';

export default function ResearchPage({ playerLevel = 2, onStartResearch }) {
  const [filteredLevel, setFilteredLevel] = useState('all');
  const [filteredBranch, setFilteredBranch] = useState('all');
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [feudId, setFeudId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeResearch, setActiveResearch] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Socket event handlers
  const handleResearchStarted = useCallback((data) => {
    const { research, researchTime } = data;
    setActiveResearch({
      techName: research.tech_name,
      level: research.level,
      endTime: new Date(research.research_end_time),
      timeRemaining: researchTime,
    });
    setSnackbar({
      open: true,
      message: `Pesquisa "${research.tech_name}" iniciada!`,
      severity: 'success',
    });
    setInfoDialogOpen(false);
  }, []);

  const handleResearchCompleted = useCallback((data) => {
    const { techName } = data;
    setActiveResearch(null);
    setSnackbar({
      open: true,
      message: `Pesquisa "${techName}" concluída!`,
      severity: 'success',
    });
  }, []);

  const handleResourcesUpdated = useCallback((data) => {
    // Resources updated (e.g., after spending on research)
    console.log('Resources updated:', data);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Load feud data on mount
  useEffect(() => {
    const loadFeudData = async () => {
      try {
        setLoading(true);
        const feudData = await gameService.getMyFeud();
        setFeudId(feudData.id);
        
        // Connect socket and subscribe to feud
        socketService.connect();
        socketService.subscribeToFeud(feudData.id);

        // Setup socket listeners
        socketService.on('research:started', handleResearchStarted);
        socketService.on('research:completed', handleResearchCompleted);
        socketService.on('resources:updated', handleResourcesUpdated);

        setError(null);
      } catch (err) {
        console.error('Error loading feud data:', err);
        setError(err.message || 'Falha ao carregar dados do feudo');
        
        // Still connect socket for later use
        try {
          socketService.connect();
          socketService.on('research:started', handleResearchStarted);
          socketService.on('research:completed', handleResearchCompleted);
          socketService.on('resources:updated', handleResourcesUpdated);
        } catch (socketErr) {
          console.error('Socket error:', socketErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadFeudData();

    // Cleanup on unmount
    return () => {
      socketService.off('research:started', handleResearchStarted);
      socketService.off('research:completed', handleResearchCompleted);
      socketService.off('resources:updated', handleResourcesUpdated);
    };
  }, [handleResearchStarted, handleResearchCompleted, handleResourcesUpdated]);
  const filteredResearches = useMemo(() => {
    return researchTreeConfig.filter(research => {
      const levelMatch = filteredLevel === 'all' || research.nivel === parseInt(filteredLevel);
      const branchMatch = filteredBranch === 'all' || research.ramo === filteredBranch;
      return levelMatch && branchMatch;
    });
  }, [filteredLevel, filteredBranch]);

  // Group by level
  const groupedByLevel = useMemo(() => {
    const groups = {};
    filteredResearches.forEach(research => {
      if (!groups[research.nivel]) {
        groups[research.nivel] = [];
      }
      groups[research.nivel].push(research);
    });
    return Object.entries(groups).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  }, [filteredResearches]);

  const getStatus = (nivel) => {
    if (nivel < playerLevel) return 'completed';
    if (nivel === playerLevel) return 'available';
    return 'locked';
  };

  const getStatusBadge = (nivel) => {
    const status = getStatus(nivel);
    switch (status) {
      case 'completed':
        return { label: '✓ Completa', color: 'success' };
      case 'available':
        return { label: '✓ Disponível', color: 'primary' };
      case 'locked':
        return { label: '🔒 Bloqueada', color: 'error' };
      default:
        return { label: '', color: 'default' };
    }
  };

  const handleStartResearch = async (research) => {
    // If feudId not loaded, try to load it
    let currentFeudId = feudId;
    if (!currentFeudId) {
      try {
        setSnackbar({
          open: true,
          message: 'Carregando dados do feudo...',
          severity: 'info',
        });
        const feudData = await gameService.getMyFeud();
        currentFeudId = feudData.id;
        setFeudId(feudData.id);
        
        // Subscribe to feud
        socketService.subscribeToFeud(feudData.id);
      } catch (err) {
        console.error('Error loading feud data:', err);
        setSnackbar({
          open: true,
          message: `Erro ao carregar feudo: ${err.message}`,
          severity: 'error',
        });
        return;
      }
    }

    if (getStatus(research.nivel) !== 'available') {
      setSnackbar({
        open: true,
        message: 'Esta pesquisa não está disponível',
        severity: 'warning',
      });
      return;
    }

    if (activeResearch) {
      setSnackbar({
        open: true,
        message: 'Já existe uma pesquisa em andamento',
        severity: 'info',
      });
      return;
    }

    try {
      console.log('Iniciando pesquisa:', research.nome, 'no feudo:', currentFeudId);
      const result = await gameService.startResearch(currentFeudId, research.nome);
      console.log('Pesquisa iniciada com sucesso:', result);
      
      if (onStartResearch) {
        onStartResearch(research);
      }
    } catch (error) {
      console.error('Erro ao iniciar pesquisa:', error);
      
      // Extrair mensagem específica do erro
      let errorMessage = error.message || 'Erro ao iniciar pesquisa';
      let severity = 'error';
      
      // Se há uma mensagem mais detalhada, usar ela
      if (error.errorCode) {
        // Mensagens customizadas por tipo de erro
        switch (error.errorCode) {
          case 'INSUFFICIENT_RESOURCES':
            errorMessage = `❌ Recursos Insuficientes!\n\n${error.message}`;
            break;
          case 'REQUIREMENTS_NOT_MET':
            errorMessage = `⚠️ Requisitos não atendidos:\n\n${error.message}`;
            severity = 'warning';
            break;
          case 'RESEARCH_ALREADY_IN_PROGRESS':
            errorMessage = `⏳ ${error.message}`;
            severity = 'info';
            break;
          case 'INVALID_RESEARCH_TECH':
            errorMessage = `❌ ${error.message}`;
            break;
          case 'MAX_RESEARCH_LEVEL_REACHED':
            errorMessage = `✓ ${error.message}`;
            severity = 'info';
            break;
          default:
            errorMessage = `❌ Erro ao Iniciar Pesquisa\n${error.message}`;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity,
      });
    }
  };

  const handleOpenInfo = (research) => {
    setSelectedResearch(research);
    setInfoDialogOpen(true);
  };

  const allBranches = ['all', ...new Set(researchTreeConfig.map(r => r.ramo))];

  return (
    <Box className="research-page" sx={{ bgcolor: '#2C1810', minHeight: '100vh' }}>
      <GameHeader playerLevel={playerLevel} playerName="Player Name" />
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#D4A574',
            mb: 3,
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontFamily: "'Cinzel', serif",
          }}
        >
          📚 Árvore Tecnológica Completa
        </Typography>

        {/* Filter Bar */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'rgba(84, 74, 58, 0.5)',
            border: '2px solid #8B6F47',
            borderRadius: 1,
          }}
        >
          <Stack spacing={2}>
            {/* Level Filter */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#D4A574',
                  textTransform: 'uppercase',
                  mb: 1,
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                }}
              >
                Nível:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['all', '1', '2', '3', '4', '5'].map(level => (
                  <Chip
                    key={level}
                    label={level === 'all' ? 'Todos' : `Nível ${level}`}
                    onClick={() => setFilteredLevel(level)}
                    variant={filteredLevel === level ? 'filled' : 'outlined'}
                    sx={{
                      bgcolor: filteredLevel === level ? '#2D5016' : 'transparent',
                      color: filteredLevel === level ? '#E8D4B8' : '#D4A574',
                      borderColor: '#D4A574',
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: filteredLevel === level ? '#2D5016' : 'rgba(212, 165, 116, 0.1)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Branch Filter */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#D4A574',
                  textTransform: 'uppercase',
                  mb: 1,
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                }}
              >
                Ramo:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {allBranches.map(branch => (
                  <Chip
                    key={branch}
                    label={branch === 'all' ? 'Todos' : branch}
                    onClick={() => setFilteredBranch(branch)}
                    variant={filteredBranch === branch ? 'filled' : 'outlined'}
                    sx={{
                      bgcolor: filteredBranch === branch ? '#2D5016' : 'transparent',
                      color: filteredBranch === branch ? '#E8D4B8' : '#D4A574',
                      borderColor: '#D4A574',
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: filteredBranch === branch ? '#2D5016' : 'rgba(212, 165, 116, 0.1)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Research by Level */}
        {groupedByLevel.map(([level, researches]) => (
          <Box key={level} sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                pb: 1,
                borderLeft: '4px solid #D4A574',
                pl: 2,
                background: 'linear-gradient(to right, rgba(212, 165, 116, 0.2), transparent)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#E8D4B8',
                  fontFamily: "'Cinzel', serif",
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                🏰 Nível {level} do Feudo
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {researches.map((research, idx) => {
                const status = getStatus(research.nivel);
                const statusBadge = getStatusBadge(research.nivel);
                const branchInfo = branchConfig[research.ramo] || { color: '#D4A574', icon: '📚' };

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`${research.nivel}-${idx}`}>
                    <Card
                      sx={{
                        bgcolor: 'rgba(90, 74, 58, 0.6)',
                        border: '2px solid #8B6F47',
                        borderRadius: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 24px rgba(212, 165, 116, 0.3)`,
                          borderColor: '#D4A574',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: `linear-gradient(to right, transparent, ${branchInfo.color}, transparent)`,
                          opacity: 0.6,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1, '&:last-child': { pb: 0 } }}>
                        {/* Header with icon and level */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography sx={{ fontSize: 32 }}>{research.icon}</Typography>
                          <Chip
                            label={`Nv. ${research.nivel}`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(212, 165, 116, 0.3)',
                              color: '#D4A574',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontWeight: 700,
                              fontSize: '10px',
                            }}
                          />
                        </Box>

                        {/* Name */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: '#D4A574',
                            mb: 0.5,
                            fontFamily: "'Cinzel', serif",
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}
                        >
                          {research.nome}
                        </Typography>

                        {/* Category */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#A0826D',
                            mb: 1,
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {branchInfo.icon} {research.ramo}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#E8D4B8',
                            mb: 1.5,
                            lineHeight: 1.5,
                            borderLeft: '2px solid #A0826D',
                            pl: 1,
                            flex: 1,
                          }}
                        >
                          {research.efeito}
                        </Typography>

                        {/* Details */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.75,
                            mb: 1.5,
                            fontSize: '12px',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 0.75,
                              bgcolor: 'rgba(212, 165, 116, 0.08)',
                              borderRadius: 0.5,
                            }}
                          >
                            <Typography sx={{ color: '#D4A574', fontWeight: 600, fontSize: '10px', fontFamily: "'Cinzel', serif" }}>
                              ⏱️ Tempo:
                            </Typography>
                            <Typography
                              sx={{
                                color: '#E8D4B8',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 600,
                                fontSize: '11px',
                              }}
                            >
                              {research.tempoBase}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              p: 0.75,
                              bgcolor: 'rgba(212, 165, 116, 0.08)',
                              borderRadius: 0.5,
                            }}
                          >
                            <Typography sx={{ color: '#D4A574', fontWeight: 600, fontSize: '10px', fontFamily: "'Cinzel', serif" }}>
                              💰 Custo:
                            </Typography>
                            <Typography
                              sx={{
                                color: '#E8D4B8',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 600,
                                fontSize: '9px',
                              }}
                            >
                              {research.custo}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Status Badge */}
                        <Chip
                          label={statusBadge.label}
                          color={statusBadge.color}
                          size="small"
                          sx={{
                            mb: 1,
                            fontFamily: "'Cinzel', serif",
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '9px',
                          }}
                        />

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={status === 'locked' || status === 'completed'}
                            onClick={() => handleStartResearch(research)}
                            sx={{
                              flex: 1,
                              bgcolor: status === 'locked' || status === 'completed' ? '#666' : '#2D5016',
                              color: '#E8D4B8',
                              fontFamily: "'Cinzel', serif",
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              fontSize: '10px',
                              '&:hover': {
                                bgcolor: status === 'locked' || status === 'completed' ? '#666' : '#3a6b1f',
                              },
                            }}
                          >
                            {status === 'completed' ? 'Completa' : status === 'locked' ? 'Bloqueada' : '▶ Começar'}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenInfo(research)}
                            sx={{
                              flex: 1,
                              color: '#D4A574',
                              borderColor: '#D4A574',
                              fontFamily: "'Cinzel', serif",
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              fontSize: '10px',
                              '&:hover': {
                                borderColor: '#D4A574',
                                bgcolor: 'rgba(212, 165, 116, 0.1)',
                              },
                            }}
                          >
                            ℹ️ Info
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}

        {/* Info Dialog */}
        <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} maxWidth="sm" fullWidth>
          {selectedResearch && (
            <>
              <DialogTitle sx={{ bgcolor: '#4A4A4A', color: '#D4A574', fontFamily: "'Cinzel', serif" }}>
                {selectedResearch.icon} {selectedResearch.nome}
              </DialogTitle>
              <DialogContent sx={{ bgcolor: '#3D2817', color: '#E8D4B8', mt: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#D4A574', fontWeight: 700 }}>
                      Ramo:
                    </Typography>
                    <Typography>{selectedResearch.ramo}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#D4A574', fontWeight: 700 }}>
                      Descrição:
                    </Typography>
                    <Typography>{selectedResearch.efeito}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#D4A574', fontWeight: 700 }}>
                      Custo:
                    </Typography>
                    <Typography>{selectedResearch.custo}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#D4A574', fontWeight: 700 }}>
                      Tempo:
                    </Typography>
                    <Typography>{selectedResearch.tempoBase}</Typography>
                  </Box>
                  {selectedResearch.desbloqueios && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#D4A574', fontWeight: 700 }}>
                        Desbloqueia:
                      </Typography>
                      <Stack spacing={0.5}>
                        {selectedResearch.desbloqueios.map((unlock, idx) => (
                          <Typography key={idx}>• {unlock}</Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </DialogContent>
              <DialogActions sx={{ bgcolor: '#3D2817', p: 2 }}>
                <Button onClick={() => setInfoDialogOpen(false)} sx={{ color: '#D4A574' }}>
                  Fechar
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Active Research Indicator */}
        {activeResearch && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              bgcolor: '#3D2817',
              border: '2px solid #D4A574',
              borderRadius: 1,
              p: 2,
              minWidth: 300,
              zIndex: 1000,
            }}
          >
            <Typography sx={{ color: '#D4A574', fontWeight: 700, mb: 1 }}>
              Pesquisa em andamento: {activeResearch.techName}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(activeResearch.timeRemaining / (activeResearch.timeRemaining + 1)) * 100}
              sx={{
                mb: 1,
                bgcolor: 'rgba(212, 165, 116, 0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#D4A574',
                },
              }}
            />
            <Typography sx={{ color: '#E8D4B8', fontSize: '0.875rem' }}>
              Tempo restante: {activeResearch.endTime}
            </Typography>
          </Box>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={snackbar.severity === 'error' ? 10000 : 6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              maxWidth: '600px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontFamily: 'Alegreya, serif',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        </Container>
      </Box>
    </Box>
  );
}
