import api from '../api/axiosConfig';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return {
        success: true,
        data: {
          token: response.data.token,
          user: response.data.user
        }
      };
    } catch (error) {
      throw error;
    }
  },

  googleLogin: async (credential: string) => {
    try {
      const response = await api.post('/api/auth/google', { credential });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyResetCode: async (email: string, code: string) => {
    try {
      const response = await api.post('/api/auth/verify-reset-code', { email, code });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    try {
      const response = await api.post('/api/auth/reset-password', {
        email,
        code,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  signup: async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 