import api from './api';

export const getClaims = async (params = {}) => {
  const response = await api.get('/claims', { params });
  return response.data;
};

export const getClaim = async (claimId) => {
  const response = await api.get(`/claims/${claimId}`);
  return response.data;
};

export const createClaim = async (claimData) => {
  const response = await api.post('/claims', claimData);
  return response.data;
};

export const updateClaim = async (claimId, claimData) => {
  const response = await api.put(`/claims/${claimId}`, claimData);
  return response.data;
};

export const approveClaim = async (claimId) => {
  const response = await api.post(`/claims/${claimId}/approve`);
  return response.data;
};

export const rejectClaim = async (claimId) => {
  const response = await api.post(`/claims/${claimId}/reject`);
  return response.data;
};

export const deleteClaim = async (claimId) => {
  const response = await api.delete(`/claims/${claimId}`);
  return response.data;
};