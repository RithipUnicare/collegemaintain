import api from './api';

export const AuthService = {
  login: async (mobileNumber: string, password: string): Promise<any> => {
    const response = await api.post('/auth/login', { mobileNumber, password });
    return response.data;
  },

  signup: async (userData: any): Promise<any> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  updateRole: async (mobileNumber: string, roles: string): Promise<any> => {
    const response = await api.post('/auth/update-role', {
      mobileNumber,
      roles,
    });
    return response.data;
  },
};
