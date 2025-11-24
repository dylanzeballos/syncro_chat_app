import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const useWebSocket = (token) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef({});
  const currentRoomRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      setError(error.message);
      setIsConnected(false);
    });

    socket.on('new-message', (message) => {
      setMessages(prev => ({
        ...prev,
        [message.roomId]: [...(prev[message.roomId] || []), message]
      }));
    });

    socket.on('message-sent', () => {
      // Message confirmation will come through 'new-message' event
    });

    socket.on('user-typing', (data) => {
      const { userId, username, isTyping } = data;

      setTypingUsers(prev => ({
        ...prev,
        [userId]: isTyping ? { username, isTyping: true } : undefined
      }));

      if (isTyping) {
        if (typingTimeoutRef.current[userId]) {
          clearTimeout(typingTimeoutRef.current[userId]);
        }

        typingTimeoutRef.current[userId] = setTimeout(() => {
          setTypingUsers(prev => ({
            ...prev,
            [userId]: undefined
          }));
        }, 3000);
      }
    });

    socket.on('user-joined', (data) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    socket.on('user-left', (data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    socket.on('user-status-changed', (data) => {
      if (data.status === 'offline') {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      } else if (data.status === 'online') {
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      }
    });

    socket.on('room-members-online', (data) => {
      setOnlineUsers(new Set(data.onlineUserIds));
    });

    socket.on('error', (error) => {
      setError(error.message);
    });

    const localTypingTimeouts = typingTimeoutRef.current;

    return () => {
      Object.values(localTypingTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      socket.disconnect();
    };
  }, [token]);

  const joinRoom = useCallback(async (roomId) => {
    if (socketRef.current?.connected) {
      currentRoomRef.current = roomId;

      setMessages(prev => ({
        ...prev,
        [roomId]: []
      }));

      try {
        const { roomAPI } = await import('../services/chatApi');
        const existingMessages = await roomAPI.getMessages(roomId);

        setMessages(prev => ({
          ...prev,
          [roomId]: existingMessages.map(msg => ({
            id: msg.id,
            content: msg.content,
            messageType: msg.message_type,
            timestamp: msg.created_at,
            user: {
              id: msg.users?.id,
              username: msg.users?.username || 'Usuario desconocido',
              avatarUrl: msg.users?.avatar_url,
            },
            roomId: msg.room_id,
            status: 'sent'
          }))
        }));
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }

      socketRef.current.emit('join-room', roomId);
    }
  }, []);

  const leaveRoom = useCallback((roomId) => {
    if (socketRef.current?.connected) {
      currentRoomRef.current = null;
      socketRef.current.emit('leave-room', roomId);
    }
  }, []);

  const sendMessage = useCallback((roomId, content, messageType = 'text') => {
    if (!socketRef.current?.connected || !content.trim()) return;

    const tempId = `temp_${Date.now()}_${Math.random()}`;

    socketRef.current.emit('send-message', {
      tempId,
      roomId,
      content: content.trim(),
      messageType,
    });
  }, []);

  const startTyping = useCallback((roomId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing-start', roomId);
    }
  }, []);

  const stopTyping = useCallback((roomId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing-stop', roomId);
    }
  }, []);

  const getRoomMessages = useCallback((roomId) => {
    return messages[roomId] || [];
  }, [messages]);

  const getTypingUsers = useCallback(() => {
    return Object.entries(typingUsers)
      .filter(([, data]) => data?.isTyping)
      .map(([userId, data]) => ({ userId, username: data.username }));
  }, [typingUsers]);

  return {
    isConnected,
    error,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    getRoomMessages,
    getTypingUsers,
    onlineUsers,
  };
};
