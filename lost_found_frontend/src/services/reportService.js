import api from './api';

// Fetch all items
export const getItems = async (params = {}) => {
  const response = await api.get('/items', { params });
  return response.data;
};

// Fetch single item
export const getItem = async (itemId) => {
  const response = await api.get(`/items/${itemId}`);
  return response.data;
};

// Create new item
export const createItem = async (itemData) => {
  const response = await api.post('/items', itemData);
  return response.data;
};

// Update item
export const updateItem = async (itemId, itemData) => {
  const response = await api.put(`/items/${itemId}`, itemData);
  return response.data;
};

// Delete item
export const deleteItem = async (itemId) => {
  const response = await api.delete(`/items/${itemId}`);
  return response.data;
};

// Upload image for item
export const uploadItemImage = async (itemId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/items/${itemId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Get all categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Get all locations
export const getLocations = async () => {
  const response = await api.get('/locations');
  return response.data;
};

// ✅ NEW FUNCTION: Get all reports
export const getReports = async (params = {}) => {
  try {
    const response = await api.get('/reports', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const getReport = async (reportId) => {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

export const updateReportStatus = async (reportId, status) => {
  const response = await api.put(`/reports/${reportId}/status?status=${status}`);
  return response.data;
};