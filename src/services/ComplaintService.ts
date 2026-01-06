import api from './api';

export const ComplaintService = {
  createComplaint: async (complaintData: any) => {
    const response = await api.post('/api/complaints', complaintData);
    return response.data;
  },

  getAllComplaints: async () => {
    const response = await api.get('/api/complaints');
    return response.data;
  },

  getMyComplaints: async () => {
    const response = await api.get('/api/complaints/my');
    return response.data;
  },

  updateStatus: async (id: number | string, status: string) => {
    const response = await api.put(`/api/complaints/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  uploadImage: async (complaintId: number | string, imageUri: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: `complaint_${complaintId}.jpg`,
      type: 'image/jpeg',
    } as any);

    const response = await api.post(
      `/api/complaints/${complaintId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  submitFeedback: async (complaintId: number | string, feedbackData: any) => {
    const response = await api.post(
      `/api/feedback/${complaintId}`,
      feedbackData,
    );
    return response.data;
  },
};
