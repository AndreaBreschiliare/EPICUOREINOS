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
  { id: 'baduran', name: 'Baduran', description: 'Anões - Mestres em construção e mineração' },
  { id: 'drow', name: 'Drow', description: 'Elfos Negros - Especialistas em intriga' },
  { id: 'aiglanos', name: 'Aiglanos', description: 'Romano - Poder militar e organização' },
  { id: 'björske', name: 'Björske', description: 'Rohan - Guerreiros nórdicos' },
  { id: 'polkinea', name: 'Polkinea', description: 'Hobbit - Agricultores astuciosos' },
  { id: 'gulthrak', name: 'Gulthrak', description: 'Orc - Força bruta e agressão' },
  { id: 'p_leste', name: 'P. Leste', description: 'Oriental - Sabedoria e comércio' },
  { id: 'aluriel', name: 'Aluriel', description: 'Élfico - Magia e elegância' },
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
      <Container maxWidth="md">
        <Grid container spacing={3}>
          {/* Coluna Esquerda: Titulo e Descrição */}
          <Grid item xs={12} md={6} display="flex" flexDirection="column" justifyContent="center">
            <Typography
              variant="h3"
              sx={{
                color: '#D4A574',
                fontWeight: 'bold',
                marginBottom: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              🏰 Funde seu Reino
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#ccc',
                marginBottom: 3,
                lineHeight: 1.8,
              }}
            >
              Escolha o nome do seu reino e uma cultura que represente seu povo. Cada cultura possui
              características únicas que influenciam na produção de recursos, tecnologias disponíveis
              e estruturas de governo.
            </Typography>

            {selectedCultureInfo && (
              <Paper
                sx={{
                  background: 'rgba(212, 165, 116, 0.1)',
                  border: '2px solid #D4A574',
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: '#D4A574', fontWeight: 'bold', marginBottom: 1 }}
                >
                  ⚔️ {selectedCultureInfo.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  {selectedCultureInfo.description}
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Coluna Direita: Formulário */}
          <Grid item xs={12} md={6}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{
                padding: 4,
                background: 'rgba(50, 50, 50, 0.8)',
                border: '2px solid #D4A574',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#D4A574',
                  marginBottom: 3,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Configurações do Reino
              </Typography>

              {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Nome do Reino */}
              <TextField
                fullWidth
                label="Nome do Reino"
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

              {/* Seleção de Cultura - Grid de Botões */}
              <Box sx={{ marginBottom: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#D4A574',
                    marginBottom: 2,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Escolha sua Cultura
                </Typography>

                <Grid container spacing={2}>
                  {CULTURES.map((culture) => (
                    <Grid item xs={6} sm={4} md={3} key={culture.id}>
                      <Card
                        onClick={() => setSelectedCulture(culture.id)}
                        disabled={loading}
                        sx={{
                          cursor: loading ? 'not-allowed' : 'pointer',
                          opacity: loading ? 0.6 : 1,
                          background:
                            selectedCulture === culture.id
                              ? 'linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(139, 111, 71, 0.3))'
                              : 'rgba(50, 50, 50, 0.6)',
                          border:
                            selectedCulture === culture.id
                              ? '3px solid #D4A574'
                              : '2px solid #666',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          transform: selectedCulture === culture.id ? 'scale(1.05)' : 'scale(1)',
                          '&:hover': {
                            border: '2px solid #D4A574',
                            transform: 'scale(1.02)',
                            boxShadow: '0 8px 16px rgba(212, 165, 116, 0.2)',
                          },
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                        }}
                      >
                        {/* Imagem da Cultura */}
                        <CardMedia
                          component="img"
                          image={`/cultures/${culture.id}.jpg`}
                          alt={culture.name}
                          sx={{
                            height: 200,
                            width: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            backgroundColor: '#2a2a2a',
                            padding: '8px',
                            boxSizing: 'border-box',
                            borderBottom:
                              selectedCulture === culture.id
                                ? '2px solid #D4A574'
                                : '1px solid #555',
                          }}
                        />

                        {/* Conteúdo */}
                        <CardContent sx={{ padding: '12px', flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: '#D4A574',
                              fontWeight: 'bold',
                              marginBottom: 0.5,
                            }}
                          >
                            {culture.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#999',
                              display: 'block',
                              fontSize: '0.75rem',
                              lineHeight: 1.3,
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                            }}
                          >
                            {culture.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Botão de Envio */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #8B6F47 100%)',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E8C78A 0%, #9B7F57 100%)',
                  },
                  '&:disabled': {
                    background: '#555',
                    color: '#999',
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ marginRight: 1 }} />
                    Fundando reino...
                  </>
                ) : (
                  '⚔️ Fundar Reino'
                )}
              </Button>

              {/* Texto de Ajuda */}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#888',
                  marginTop: 2,
                }}
              >
                Você pode alterar estas configurações mais tarde
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
