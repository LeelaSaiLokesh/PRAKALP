/**
 * API Service - Communication with FastAPI backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeData = async (csvFile, goal, selectedModel = null) => {
  try {
    const formData = new FormData();
    formData.append('csv_file', csvFile);
    
    const requestData = {
      goal: goal,
      ...(selectedModel && { selected_model: selectedModel }),
    };
    formData.append('request_data', JSON.stringify(requestData));

    const response = await api.post('/api/run-analysis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error analyzing data:', error);
    throw error;
  }
};

export const predictCluster = async (data) => {
  try {
    const response = await api.post('/api/predict', { data });
    return response.data;
  } catch (error) {
    console.error('Error predicting cluster:', error);
    throw error;
  }
};

export const runSimulation = async (scenario) => {
  try {
    const response = await api.post('/api/simulate', { scenario });
    return response.data;
  } catch (error) {
    console.error('Error running simulation:', error);
    throw error;
  }
};

export const getStatus = async () => {
  try {
    const response = await api.get('/api/status');
    return response.data;
  } catch (error) {
    console.error('Error getting status:', error);
    throw error;
  }
};

export const getLogs = async () => {
  try {
    const response = await api.get('/api/logs');
    return response.data;
  } catch (error) {
    console.error('Error getting logs:', error);
    throw error;
  }
};

export default api;
