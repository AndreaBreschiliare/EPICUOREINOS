import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { authService } from '../services/authService';

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://api.odisseiadamente.com.br/api';

const CULTURES = [
  {
    id: 'baduran',
    name: 'Baduran',
    description: 'Anões mestres da forja e da tecnologia, temperamentais mas profundamente leais, vivem nas profundezas das montanhas cultivando tradições milenares.',
    color: '#A67C52',
    bonus: { pedra: 20, ferro: 20, minério_raro: 15 },
    malus: { comida: -25 },
  },
  {
    id: 'drow',
    name: 'Drow',
    description: 'Elfos negros que governam através do medo e da intriga política nas profundezas, uma sociedade de castas sob o culto à deusa Idrith.',
    color: '#6B5B5B',
    bonus: { cobre: 15, cristais: 10 },
    malus: { madeira: -15 },
  },
  {
    id: 'aiglanos',
    name: 'Aiglanos',
    description: 'Povo astuto que prospera através da disciplina e da união, construindo um império onde a força das legiões e o mérito determinam o destino.',
    color: '#D4AF37',
    bonus: { cobre: 20, pergaminhos: 15 },
    malus: { madeira: -10, pedra: -10 },
  },
  {
    id: 'björske',
    name: 'Björske',
    description: 'Guerreiros nórdicos tradicionais devotos ao culto do Sol e da Lua, famosos por sua incomparável cavalaria e devoção à força e fertilidade.',
    color: '#8CB5D0',
    bonus: { comida: 20, madeira: 15 },
    malus: { pergaminhos: -15 },
  },
  {
    id: 'polkinea',
    name: 'Polkinea',
    description: 'Pequilhos simples e felizes que cultivam a terra e saboreiam a paz, dotados de coragem e capacidade única de conquistar amizades.',
    color: '#B8D87F',
    bonus: { comida: 25, cobre: 10 },
    malus: { pedra: -20 },
  },
  {
    id: 'gulthrak',
    name: 'Gulthrak',
    description: 'Orcs nômades do deserto, selvagens e brutais em combate mas sábios em sua luta pela sobrevivência, devotos ao ciclo de sangue, areia e água.',
    color: '#A0522D',
    bonus: { minério_raro: 15, ferro: 15, pedra: 10 },
    malus: { cobre: -25 },
  },
  {
    id: 'p_leste',
    name: 'P. Leste',
    description: 'Milenares povos sob dinastia unificada que honram disciplina, honra e lealdade ao Imperador, com tradições de monges guerreiros e samurais lendários.',
    color: '#E08B7D',
    bonus: { pergaminhos: 20, cristais: 15 },
    malus: { comida: -20 },
  },
  {
    id: 'aluriel',
    name: 'Aluriel',
    description: 'Antigos elfos contemplativos profundamente ligados à natureza e à magia, criadores de beleza e sabedoria imortais, abençoados pela deusa Alora.',
    color: '#A989BE',
    bonus: { cristais: 25, pergaminhos: 10, madeira: 15 },
    malus: { pedra: -20 },
  },
];

export default function KingdomCreationPage() {
  const navigate = useNavigate();
  const [kingdomName, setKingdomName] = useState('');
  const [selectedCulture, setSelectedCulture] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingFeudDialog, setExistingFeudDialog] = useState(false);
  const [deletingFeud, setDeletingFeud] = useState(false);

  const selectedCultureInfo = CULTURES.find((c) => c.id === selectedCulture);

  const resourceEmojis = {
    madeira: '🌳',
    pedra: '⛏️',
    ferro: '⚔️',
    comida: '🍖',
    cobre: '🪙',
    pergaminhos: '📜',
    cristais: '💎',
    minério_raro: '✨',
  };

  const handleDeleteExistingFeud = async () => {
    try {
      setDeletingFeud(true);
      console.log('🗑️ Deletando feudo existente...');

      const response = await fetch(`${API_URL}/feud/user/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar feudo existente');
      }

      console.log('✅ Feudo deletado com sucesso!');
      setExistingFeudDialog(false);
      setDeletingFeud(false);
      setError('');
      
      // Limpar os campos para um novo reino
      setKingdomName('');
      setSelectedCulture('');
    } catch (err) {
      setError(err.message || 'Erro ao deletar feudo');
      setDeletingFeud(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!kingdomName.trim()) {
        setError('Nome do reino é obrigatório');
        setLoading(false);
        return;
      }

      if (kingdomName.length < 3) {
        setError('Nome deve ter no mínimo 3 caracteres');
        setLoading(false);
        return;
      }

      if (kingdomName.length > 50) {
        setError('Nome não pode ter mais de 50 caracteres');
        setLoading(false);
        return;
      }

      if (!selectedCulture) {
        setError('Selecione uma cultura para seu reino');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/feud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          name: kingdomName,
          culture: selectedCulture,
        }),
      });

      console.log('Create feud response status:', response.status);
      const responseData = await response.json();
      console.log('Create feud response data:', responseData);

      if (!response.ok) {
        // Se foi erro 409 (já existe feudo), mostra dialog
        if (response.status === 409) {
          console.log('Feudo já existe, mostrando opções...');
          setExistingFeudDialog(true);
          setLoading(false);
          return;
        }
        throw new Error(responseData.message || 'Erro ao criar reino. Tente novamente.');
      }

      console.log('Kingdom created successfully, navigating to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao criar reino:', err);
      setError(err.message || 'Erro desconhecido ao criar reino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: { xs: 1, sm: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* ============ LINHA 1: NOME DO REINO ============ */}
      <Paper
        component="form"
        id="kingdom-form"
        onSubmit={handleSubmit}
        sx={{
          padding: { xs: 1.5, sm: 2, md: 2.5 },
          background: 'rgba(50, 50, 50, 0.9)',
          border: '2px solid #D4A574',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ marginBottom: 1.5 }}>
            {error}
          </Alert>
        )}

        <Typography
          variant="subtitle2"
          sx={{
            color: '#D4A574',
            marginBottom: 1,
            fontWeight: 'bold',
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Nome do Reino
        </Typography>

        <TextField
          fullWidth
          value={kingdomName}
          onChange={(e) => setKingdomName(e.target.value)}
          disabled={loading}
          placeholder="Ex: Reino da Esperança"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              '& fieldset': {
                borderColor: '#8B6F47',
              },
              '&:hover fieldset': {
                borderColor: '#D4A574',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#D4A574',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#888',
              opacity: 0.7,
            },
          }}
          inputProps={{ maxLength: 50 }}
        />
      </Paper>

      {/* ============ LINHA 2: CULTURAS + IMAGEM + DESCRIÇÃO ============ */}
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* Coluna 1: Sidebar de Culturas */}
        <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex' }}>
          <Paper
            sx={{
              width: '100%',
              padding: { xs: 1.5, sm: 2 },
              background: 'rgba(50, 50, 50, 0.9)',
              border: '2px solid #D4A574',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#D4A574',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                minWidth: { xs: 'auto', md: '100%' },
                flexShrink: 0,
              }}
            >
              Culturas
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                gap: 1,
                width: '100%',
                overflowX: { xs: 'auto', md: 'visible' },
                overflowY: { xs: 'visible', md: 'auto' },
                paddingBottom: { xs: 1, md: 0 },
              }}
            >
              {CULTURES.map((culture) => (
                <Paper
                  key={culture.id}
                  onClick={() => setSelectedCulture(culture.id)}
                  sx={{
                    padding: { xs: '8px 12px', sm: '10px 14px' },
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: selectedCulture === culture.id ? `${culture.color}20` : 'rgba(30, 30, 30, 0.8)',
                    border: selectedCulture === culture.id ? `2px solid ${culture.color}` : '1px solid #555',
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    '&:hover': {
                      borderColor: culture.color,
                      backgroundColor: `${culture.color}15`,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: selectedCulture === culture.id ? culture.color : '#999',
                      fontWeight: selectedCulture === culture.id ? 'bold' : 'normal',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {culture.name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Coluna 2: Imagem Grande */}
        <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex' }}>
          <Paper
            sx={{
              width: '100%',
              padding: { xs: 1.5, sm: 2 },
              background: 'rgba(50, 50, 50, 0.9)',
              border: '2px solid #D4A574',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selectedCultureInfo ? (
              <Box
                component="img"
                src={`/cultures/${selectedCultureInfo.id}.jpg`}
                alt={selectedCultureInfo.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
            ) : (
              <Typography sx={{ color: '#888', textAlign: 'center', fontSize: '0.9rem' }}>
                Selecione uma cultura
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Coluna 3: Descrição da Cultura */}
        <Grid item xs={12} sm={12} md={5} sx={{ display: 'flex' }}>
          {selectedCultureInfo ? (
            <Paper
              sx={{
                width: '100%',
                padding: { xs: 1.5, sm: 2, md: 2.5 },
                background: 'rgba(50, 50, 50, 0.9)',
                border: '2px solid #D4A574',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                maxHeight: '100%',
                minHeight: 0,
              }}
            >
              <Typography
                sx={{
                  color: '#D4A574',
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {selectedCultureInfo.name}
              </Typography>

              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  lineHeight: 1.7,
                }}
              >
                {selectedCultureInfo.description}
              </Typography>

              {/* Bônus e Malus */}
              <Box sx={{ borderTop: '1px solid #555', paddingTop: 1.5, marginTop: 1.5 }}>
                {/* Bônus */}
                {Object.keys(selectedCultureInfo.bonus).length > 0 && (
                  <Box sx={{ marginBottom: 1.5 }}>
                    <Typography sx={{ color: '#90EE90', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: 0.5 }}>
                      📈 BÔNUS PERMANENTES
                    </Typography>
                    {Object.entries(selectedCultureInfo.bonus).map(([resource, value]) => (
                      <Typography key={resource} sx={{ color: '#90EE90', fontSize: '0.8rem' }}>
                        {resourceEmojis[resource]} {resource.toUpperCase().replace('_', ' ')}: <strong>+{value}%</strong>
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Malus */}
                {Object.keys(selectedCultureInfo.malus).length > 0 && (
                  <Box>
                    <Typography sx={{ color: '#FF6B6B', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: 0.5 }}>
                      📉 PENALIDADES
                    </Typography>
                    {Object.entries(selectedCultureInfo.malus).map(([resource, value]) => (
                      <Typography key={resource} sx={{ color: '#FF6B6B', fontSize: '0.8rem' }}>
                        {resourceEmojis[resource]} {resource.toUpperCase().replace('_', ' ')}: <strong>{value}%</strong>
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                width: '100%',
                padding: { xs: 1.5, sm: 2, md: 2.5 },
                background: 'rgba(50, 50, 50, 0.9)',
                border: '2px solid #D4A574',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: '#888', textAlign: 'center', fontSize: '0.9rem' }}>
                Selecione uma cultura para ver sua descrição
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* ============ LINHA 3: BOTÃO FUNDAR REINO ============ */}
      <Button
        type="submit"
        form="kingdom-form"
        variant="contained"
        disabled={loading || !selectedCulture}
        sx={{
          padding: { xs: '12px', sm: '14px' },
          marginX: { xs: '1rem', sm: '0.5rem' },
          background: 'linear-gradient(135deg, #D4A574 0%, #8B6F47 100%)',
          color: '#000',
          fontWeight: 'bold',
          fontSize: { xs: '14px', sm: '15px' },
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          transition: 'all 0.3s ease',
          '&:hover':
            !loading && selectedCulture
              ? {
                  background: 'linear-gradient(135deg, #E8C78A 0%, #9B7F57 100%)',
                  boxShadow: '0 8px 16px rgba(212, 165, 116, 0.3)',
                  transform: 'translateY(-2px)',
                }
              : {},
          '&:disabled': {
            background: '#555',
            color: '#999',
          },
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={18} sx={{ marginRight: 1, color: 'inherit' }} />
            Fundando...
          </>
        ) : (
          '🏰 Fundar Reino'
        )}
      </Button>

      {/* Dialog: Feudo Existente */}
      <Dialog open={existingFeudDialog} onClose={() => setExistingFeudDialog(false)}>
        <DialogTitle sx={{ color: '#D4A574', fontWeight: 'bold' }}>
          ⚠️ Você já tem um Reino
        </DialogTitle>
        <DialogContent sx={{ background: 'rgba(50, 50, 50, 0.9)' }}>
          <Typography sx={{ color: '#ccc', marginY: 2 }}>
            Você já possui um reino ativo. Para criar um novo, precisa deletar o existente.
          </Typography>
          <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>
            O que você prefere fazer?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ background: 'rgba(50, 50, 50, 0.9)', padding: 2, gap: 1 }}>
          <Button
            onClick={() => setExistingFeudDialog(false)}
            sx={{
              color: '#D4A574',
              border: '1px solid #D4A574',
              borderRadius: 1,
              textTransform: 'uppercase',
              fontSize: '0.8rem',
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #D4A574 0%, #8B6F47 100%)',
              color: '#000',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              borderRadius: 1,
            }}
          >
            Ver Meu Reino
          </Button>
          <Button
            onClick={handleDeleteExistingFeud}
            disabled={deletingFeud}
            sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #CC5555 100%)',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              borderRadius: 1,
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {deletingFeud ? '🗑️ Deletando...' : '🗑️ Deletar & Criar Novo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
