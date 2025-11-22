import axios from 'axios';
import { supabase } from '../config/supabase';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const getValidToken = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      throw new Error('No hay sesión válida');
    }

    const expiresAt = session.expires_at * 1000;
    const now = Date.now();
    const oneMinute = 60 * 1000;

    if (expiresAt - now < oneMinute) {
      const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !newSession?.access_token) {
        throw new Error('Error refrescando token');
      }

      return newSession.access_token;
    }

    return session.access_token;
  } catch (error) {
    console.error('Error obteniendo token:', error);
    throw error;
  }
};

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error en interceptor de request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await getValidToken();
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Error refrescando token:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const message = error.response?.data?.message || error.message || 'Error en la solicitud';
    const transformedError = new Error(message);
    transformedError.status = error.response?.status;
    transformedError.originalError = error;

    return Promise.reject(transformedError);
  }
);

const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};



export { apiClient };
export default api;
