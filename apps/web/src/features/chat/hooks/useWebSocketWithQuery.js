import { useEffect, useCallback, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const useWebSocketWithQuery = (token) => {
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef({});
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
    });

    socketRef.current = socket;
    const localTypingTimeouts = typingTimeoutRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new-message', (message) => {
      const ROOM_MESSAGES_QUERY_KEY = ['messages', message.roomId];
      queryClient.setQueryData(ROOM_MESSAGES_QUERY_KEY, (oldData) => [
        ...(oldData || []),
        {
          id: message.id,
          content: message.content,
          message_type: message.messageType,
          created_at: message.timestamp,
          users: {
            id: message.user.id,
            username: message.user.username,
            avatar_url: message.user.avatarUrl,
          },
          room_id: message.roomId,
        }
      ]);
    });

    socket.on('room-members-online', (data) => {
      if (data?.onlineUserIds) {
        setOnlineUsers(new Set(data.onlineUserIds));
      }
      queryClient.invalidateQueries({
        queryKey: ['members'],
        refetchType: 'stale',
      });
    });

    socket.on('user-joined', (data) => {
      if (data?.userId) {
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      }
    });

    socket.on('user-left', (data) => {
      if (data?.userId) {
        setOnlineUsers(prev => {
          const updated = new Set(prev);
          updated.delete(data.userId);
          return updated;
        });
      }
    });

    socket.on('user-typing', (data) => {
      const { userId, username, isTyping } = data;

      if (isTyping) {
        setTypingUsers(prev => ({
          ...prev,
          [userId]: { username, isTyping: true }
        }));

        if (localTypingTimeouts[userId]) {
          clearTimeout(localTypingTimeouts[userId]);
        }

        localTypingTimeouts[userId] = setTimeout(() => {
          setTypingUsers(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
          });
          delete localTypingTimeouts[userId];
        }, 3000);
      } else {
        setTypingUsers(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
        if (localTypingTimeouts[userId]) {
          clearTimeout(localTypingTimeouts[userId]);
          delete localTypingTimeouts[userId];
        }
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      Object.values(localTypingTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      socket.disconnect();
    };
  }, [token, queryClient]);

  const joinRoom = useCallback((roomId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-room', roomId);
    }
  }, []);

  const leaveRoom = useCallback((roomId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-room', roomId);
    }
  }, []);

  const sendMessage = useCallback((roomId, content, messageType = 'text') => {
    if (socketRef.current?.connected && content?.trim()) {
      socketRef.current.emit('send-message', { roomId, content: content.trim(), messageType });
    }
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

  return {
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    typingUsers: Object.entries(typingUsers)
      .filter(([, data]) => data?.isTyping)
      .map(([userId, data]) => ({ userId, username: data.username })),
    onlineUsers,
  };
};


