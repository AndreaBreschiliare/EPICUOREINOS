import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { authService } from '../services/authService';

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://api.odisseiadamente.com.br/api';

const CULTURES = [
  { id: 'baduran', name: 'Baduran', description: 'Anões mestres da forja e da tecnologia, temperamentais mas profundamente leais, vivem nas profundezas das montanhas cultivando tradições milenares.' },
  { id: 'drow', name: 'Drow', description: 'Elfos negros que governam través do medo e da intriga política nas profundezas, uma sociedade de castas sob o culto à deusa Idrith.' },
  { id: 'aiglanos', name: 'Aiglanos', description: 'Povo astuto que prospera através da disciplina e da união, construindo um império onde a força das legiões e o mérito determinam o destino.' },
  { id: 'björske', name: 'Björske', description: 'Guerreiros nórdicos tradicionais devotos ao culto do Sol e da Lua, famosos por sua incomparável cavalaria e devoção à força e fertilidade.' },
  { id: 'polkinea', name: 'Polkinea', description: 'Pequilhos simples e felizes que cultivam a terra e saboreiam a paz, dotados de coragem e capacidade única de conquistar amizades.' },
  { id: 'gulthrak', name: 'Gulthrak', description: 'Orcs nômades do deserto, selvagens e brutais em combate mas sábios em sua luta pela sobrevivência, devotos ao ciclo de sangue, areia e água.' },
  { id: 'p_leste', name: 'P. Leste', description: 'Milenares povos sob dinastia unificada que honram disciplina, honra e lealdade ao Imperador, com tradições de monges guerreiros e samurais lendários.' },
  { id: 'aluriel', name: 'Aluriel', description: 'Antigos elfos contemplativos profundamente ligados à natureza e à magia, criadores de beleza e sabedoria imortais, abençoados pela deusa Alora.' },
];

export default function KingdomCreationPage() {
  const navigate = useNavigate();
  const [kingdomName, setKingdomName] = useState('');
  const [selectedCulture, setSelectedCulture] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações
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

      // Chamar API para criar feudo
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

      if (!response.ok) {
        let errorMessage = 'Erro ao criar reino. Tente novamente.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      // Sucesso! Redirecionar para dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao criar reino:', err);
      setError(err.message || 'Erro desconhecido ao criar reino');
    } finally {
      setLoading(false);
    }
  };

  const selectedCultureInfo = CULTURES.find((c) => c.id === selectedCulture);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Grid container spacing={3} maxWidth="1400px" sx={{ height: '90vh' }}>
        {/* SIDEBAR ESQUERDA - Lista de Culturas */}
        <Grid item xs={12} sm={3} md={2.5}>
          <Paper
            sx={{
              padding: 2,
              background: 'rgba(50, 50, 50, 0.9)',
              border: '2px solid #D4A574',
              borderRadius: 2,
              height: '100%',
              overflowY: 'auto',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#D4A574',
                marginBottom: 2,
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '0.9rem',
              }}
            >
              CULTURAS
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {CULTURES.map((culture) => (
                <Paper
                  key={culture.id}
                  onClick={() => setSelectedCulture(culture.id)}
                  sx={{
                    padding: '10px 12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor:
                      selectedCulture === culture.id
                        ? 'rgba(212, 165, 116, 0.2)'
                        : 'rgba(30, 30, 30, 0.8)',
                    border:
                      selectedCulture === culture.id
                        ? '2px solid #D4A574'
                        : '1px solid #555',
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#D4A574',
                      backgroundColor: 'rgba(212, 165, 116, 0.15)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        selectedCulture === culture.id ? '#D4A574' : '#999',
                      fontWeight: selectedCulture === culture.id ? 'bold' : 'normal',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                    }}
                  >
                    {culture.name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* CENTRO - Imagem Grande */}
        <Grid item xs={12} sm={6} md={5}>
          <Paper
            sx={{
              padding: 2,
              background: 'rgba(50, 50, 50, 0.9)',
              border: '2px solid #D4A574',
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
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
              <Typography sx={{ color: '#888', textAlign: 'center' }}>
                Selecione uma cultura
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* DIREITA - Informações + Formulário */}
        <Grid item xs={12} sm={3} md={4.5}>
          <Paper
            sx={{
              padding: 3,
              background: 'rgba(50, 50, 50, 0.9)',
              border: '2px solid #D4A574',
              borderRadius: 2,
              height: '100%',
              overflowY: 'auto',
              backdropFilter: 'blur(10px)',
            }}
          >
            {selectedCultureInfo && (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#D4A574',
                    fontWeight: 'bold',
                    marginBottom: 1,
                    textTransform: 'uppercase',
                    fontSize: '1.3rem',
                  }}
                >
                  {selectedCultureInfo.name}
                </Typography>

                <Typography
                  sx={{
                    color: '#aaa',
                    marginBottom: 3,
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  {selectedCultureInfo.description}
                </Typography>

                <Box sx={{ borderTop: '1px solid #555', paddingTop: 2, marginBottom: 2 }} />
              </>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {error}
                </Alert>
              )}

              <Typography
                variant="subtitle2"
                sx={{
                  color: '#D4A574',
                  marginBottom: 1,
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                }}
              >
                NOME DO REINO
              </Typography>

              <TextField
                fullWidth
                value={kingdomName}
                onChange={(e) => setKingdomName(e.target.value)}
                disabled={loading}
                placeholder="Ex: Reino da Esperança"
                sx={{
                  marginBottom: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
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
                  '& .MuiInputLabel-root': {
                    color: '#8B6F47',
                    '&.Mui-focused': {
                      color: '#D4A574',
                    },
                  },
                }}
                inputProps={{
                  maxLength: 50,
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading || !selectedCulture}
                sx={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #8B6F47 100%)',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginTop: 2,
                  '&:hover':
                    !loading && selectedCulture
                      ? {
                          background:
                            'linear-gradient(135deg, #E8C78A 0%, #9B7F57 100%)',
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
                    <CircularProgress size={20} sx={{ marginRight: 1 }} />
                    Fundando...
                  </>
                ) : (
                  '🏰 FUNDAR REINO'
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
