import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export async function fetchAuthUrl() {
  const { data } = await api.get('/auth/google');
  return data.url;
}

export async function fetchGlobalStats() {
  const { data } = await api.get('/stats/global');
  return data;
}

export async function scanDrive(accessToken) {
  const { data } = await api.post('/drive/scan', { accessToken });
  return data;
}

export async function cleanDrive(accessToken, fileIds) {
  const { data } = await api.post('/drive/clean', { accessToken, fileIds });
  return data;
}

export default api;
