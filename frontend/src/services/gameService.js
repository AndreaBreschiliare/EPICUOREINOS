import { authService } from './authService';

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://api.odisseiadamente.com.br/api';

function getAuthHeaders() {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...getAuthHeaders(),
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    const error = new Error(`Resposta inválida do servidor (status ${response.status})`);
    error.statusCode = response.status;
    throw error;
  }

  if (!response.ok) {
    // Preservar mais informações de erro
    const errorMessage = data.message || data.error || 'Erro ao carregar dados do jogo';
    const error = new Error(errorMessage);
    error.errorCode = data.error;
    error.statusCode = response.status;
    throw error;
  }

  return data.data;
}

export const gameService = {
  getMyFeud() {
    return request('/feud/me');
  },

  getBuildings(feudId) {
    return request(`/feud/${feudId}/buildings`);
  },

  getAvailableBuildings(feudId) {
    return request(`/feud/${feudId}/buildings/available`);
  },

  startBuilding(feudId, type, level = 1) {
    return request(`/feud/${feudId}/buildings`, {
      method: 'POST',
      body: JSON.stringify({ type, level }),
    });
  },

  upgradeBuilding(feudId, buildingId) {
    return request(`/feud/${feudId}/buildings/${buildingId}/upgrade`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  },

  demolishBuilding(feudId, buildingId) {
    return request(`/feud/${feudId}/buildings/${buildingId}`, {
      method: 'DELETE',
      body: JSON.stringify({}),
    });
  },

  collectResources(feudId) {
    return request(`/feud/${feudId}/collect`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  getResearchProgress(feudId) {
    return request(`/feud/${feudId}/research/progress`);
  },

  getAvailableResearch(feudId) {
    return request(`/feud/${feudId}/research/available`);
  },

  startResearch(feudId, techName) {
    return request(`/feud/${feudId}/research/start`, {
      method: 'POST',
      body: JSON.stringify({ 
        techName: this.getTechNameFromDisplay(techName) || techName 
      }),
    });
  },

  getTechNameFromDisplay(displayName) {
    // Map para conversão de nome display para tech_name backend
    const nameMap = {
      'Técnicas de Arado': 'tecnicas_arado',
      'Cunhas de Madeira': 'silvicultura',
      'Escoramento Simples': 'mineracao_avancada',
      'Registros do Feudo': 'registros_feudo',
      'Estacas Afiadas': 'estacas_afiadas',
      'Milícia Básica': 'milicia_basica',
      'Escrita Formal': 'escrita_formal',
      'Fundamentos da Metalurgia': 'metalurgia',
      'Carpintaria Avançada': 'carpintaria_avancada',
      'Hospitalidade Comunitária': 'hospitalidade_comunitaria',
      'Domesticação de Bestas': 'domesticacao_bestas',
      'Princípios da Fé': 'principios_fe',
      'Técnicas de Fortificação': 'tecnicas_fortificacao',
      'Administração Centralizada': 'administracao_centralizada',
      'Organização Militar': 'organizacao_militar',
      'Medicina e Saneamento': 'medicina_saneamento',
      'Fundamentos da Alquimia': 'fundamentos_alquimia',
      'Contabilidade Avançada': 'contabilidade_avancada',
      'Engenharia Defensiva': 'engenharia_defensiva',
      'Engenharia de Guerra': 'engenharia_guerra',
      'Teoria Arcana de Batalha': 'teoria_arcana',
      'Rotas de Caravana': 'rotas_caravana',
      'Infiltração e Sabotagem': 'infiltracao_sabotagem',
      'Arquitetura de Bastião': 'arquitetura_bastiao',
      'Arquitetura Soberana': 'arquitetura_soberana',
      'Cartografia Celestial': 'cartografia_celestial',
      'Guerra nas Sombras': 'guerra_sombras',
      'Doutrina de Legado [Cultural]': 'doutrina_legado',
    };
    return nameMap[displayName];
  },

  getLevelStatus(feudId) {
    return request(`/feud/${feudId}/level-up/status`);
  },

  levelUp(feudId) {
    return request(`/feud/${feudId}/level-up`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },
};
