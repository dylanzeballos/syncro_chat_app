const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthToken = async () => {
  const { supabase } = await import("../config/supabase");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
};

const authFetch = async (url, options = {}) => {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
};

export const authAPI = {
  verifyToken: () => authFetch("/auth/verify"),
  getCurrentUser: () => authFetch("/auth/me"),
  updateStatus: (status) =>
    authFetch("/auth/status", {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

export const chatAPI = {
  getRooms: () => authFetch("/chat/rooms"),
  getMessages: (roomId, limit = 50, offset = 0) =>
    authFetch(`/chat/rooms/${roomId}/messages?limit=${limit}&offset=${offset}`),

  getMembers: (roomId) => authFetch(`/chat/rooms/${roomId}/members`),
  sendMessage: (roomId, content, messageType = "text") =>
    authFetch(`/chat/rooms/${roomId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, messageType }),
    }),
};
