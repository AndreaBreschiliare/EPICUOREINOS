// Serviços de Autenticação
// Chamadas à API do backend

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://api.odisseiadamente.com.br/api';

export const authService = {
  /**
   * Registra um novo usuário
   */
  async register(username, email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`Resposta inválida do servidor: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }

      return {
        user: {
          id: data.data.id,
          username: data.data.username,
          email: data.data.email,
          role: data.data.role || 'player',
        },
        token: data.data.token,
      };
    } catch (error) {
      throw new Error(error.message || 'Erro na conexão');
    }
  },

  /**
   * Faz login de usuário
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`Resposta inválida do servidor: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      return {
        user: {
          id: data.data.id,
          username: data.data.username,
          email: data.data.email,
          role: data.data.role || 'player',
        },
        token: data.data.token,
      };
    } catch (error) {
      throw new Error(error.message || 'Erro na conexão');
    }
  },

  /**
   * Faz logout (limpa localStorage)
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtém token salvo
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Obtém usuário salvo
   */
  getUser() {
    try {
      const userStr = localStorage.getItem('user');
      // Guardian contra valores inválidos (undefined, null, strings vazias)
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        localStorage.removeItem('user');
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erro ao parse de usuário:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  /**
   * Verifica se está autenticado
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Salva token e usuário
   */
  saveAuth(user, token) {
    console.log('💾 saveAuth called with:', { user, token: token ? token.substring(0, 20) + '...' : 'null' });
    localStorage.setItem('token', token);
    const userJson = JSON.stringify(user);
    console.log('📝 Saving user JSON:', userJson);
    localStorage.setItem('user', userJson);
    console.log('✅ localStorage after save:', {
      token: localStorage.getItem('token') ? 'EXISTS' : 'MISSING',
      user: JSON.parse(localStorage.getItem('user')),
    });
  },
};
