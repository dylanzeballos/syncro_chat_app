import api from '../../../services/api';

export const roomAPI = {
  getRooms: () => api.get('/rooms'),
  createRoom: (roomData) => api.post('/rooms', roomData),
  joinRoom: (code) => api.post(`/rooms/join/${code}`),
  getMessages: (roomId, params = {}) => api.get(`/rooms/${roomId}/messages`, { params }),
  getMembers: (roomId) => api.get(`/rooms/${roomId}/members`),
};

export const messageAPI = {
  sendMessage: (roomId, messageData) => api.post(`/rooms/${roomId}/messages`, messageData),
  markAsRead: (roomId, messageIds) => api.patch(`/rooms/${roomId}/messages/read`, { messageIds }),
};

export const userAPI = {
  syncUser: () => api.post('/users/sync'),
  getProfile: () => api.get('/users/profile'),
  updateStatus: (status) => api.patch('/users/status', { status }),
};

export default {
  rooms: roomAPI,
  messages: messageAPI,
  users: userAPI,
};
