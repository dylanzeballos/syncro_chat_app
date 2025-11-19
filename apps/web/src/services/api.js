// API service to communicate with backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para obtener el token de autenticación
const getAuthToken = async () => {
  const { supabase } = await import('../config/supabase');
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

// Helper para hacer requests autenticados
const authFetch = async (url, options = {}) => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token');
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  verifyToken: () => authFetch('/auth/verify'),
  getCurrentUser: () => authFetch('/auth/me'),
  updateStatus: (status) => authFetch('/auth/status', {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Chat API
export const chatAPI = {
  // Obtener rooms del usuario
  getRooms: () => authFetch('/chat/rooms'),
  
  // Obtener mensajes de un room
  getMessages: (roomId, limit = 50, offset = 0) => 
    authFetch(`/chat/rooms/${roomId}/messages?limit=${limit}&offset=${offset}`),
  
  // Obtener miembros de un room
  getMembers: (roomId) => authFetch(`/chat/rooms/${roomId}/members`),
  
  // Enviar mensaje
  sendMessage: (roomId, content, messageType = 'text') => 
    authFetch(`/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, messageType }),
    }),
};
