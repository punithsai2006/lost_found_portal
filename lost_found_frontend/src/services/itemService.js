import api from './api';

export const getItems = async (params = {}) => {
  const response = await api.get('/items/', { params });
  return response.data;
};

export const getItem = async (itemId) => {
  const response = await api.get(`/items/${itemId}`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post('/items/', itemData);
  return response.data;
};

export const updateItem = async (itemId, itemData) => {
  const response = await api.put(`/items/${itemId}`, itemData);
  return response.data;
};

export const deleteItem = async (itemId) => {
  const response = await api.delete(`/items/${itemId}`);
  return response.data;
};

export const uploadItemImage = async (itemId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/items/${itemId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

// ✅ FIXED category endpoint
export const getCategories = async () => {
  const response = await api.get('/items/categories/all');
  return response.data;
};

// ✅ FIXED locations endpoint
export const getLocations = async () => {
  const response = await api.get('/items/locations/all');
  return response.data;
};
