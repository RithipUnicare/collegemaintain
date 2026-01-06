import api from './api';

export const MasterService = {
  // Blocks
  getAllBlocks: async () => {
    const response = await api.get('/api/blocks');
    return response.data;
  },
  createBlock: async (blockData: any) => {
    const response = await api.post('/api/blocks', blockData);
    return response.data;
  },

  // Floors
  getFloorsByBlock: async (blockId: any) => {
    const response = await api.get(`/api/floors/block/${blockId}`);
    return response.data;
  },
  createFloor: async (floorData: any) => {
    const response = await api.post('/api/floors', floorData);
    return response.data;
  },

  // Rooms
  getRoomsByFloor: async (floorId: any) => {
    const response = await api.get(`/api/rooms/floor/${floorId}`);
    return response.data;
  },
  createRoom: async (roomData: any) => {
    const response = await api.post('/api/rooms', roomData);
    return response.data;
  },
};
