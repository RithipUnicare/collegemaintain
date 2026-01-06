import api from './api';

export const UserService = {
  getProfile: async (): Promise<any> => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  getAllUsers: async (): Promise<any[]> => {
    const response = await api.get('/api/users');
    return response.data;
  },

  editProfile: async (userData: any): Promise<any> => {
    const response = await api.put('/api/users/edit', userData);
    return response.data;
  },

  deleteUser: async (id: number | string): Promise<any> => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
};
