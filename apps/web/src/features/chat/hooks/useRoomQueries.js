import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomAPI } from '../services/chatApi';

const ROOMS_QUERY_KEY = ['rooms'];
const ROOM_MESSAGES_QUERY_KEY = (roomId) => ['messages', roomId];
const ROOM_MEMBERS_QUERY_KEY = (roomId) => ['members', roomId];

export const useRoomsQuery = () => {
  return useQuery({
    queryKey: ROOMS_QUERY_KEY,
    queryFn: async () => {
      const rooms = await roomAPI.getRooms();
      return rooms || [];
    },
    staleTime: 1000 * 60 * 5, 
  });
};

export const useRoomMessagesQuery = (roomId, options = {}) => {
  return useQuery({
    queryKey: ROOM_MESSAGES_QUERY_KEY(roomId),
    queryFn: async () => {
      const messages = await roomAPI.getMessages(roomId);
      return messages || [];
    },
    staleTime: 1000 * 30,
    enabled: !!roomId,
    ...options,
  });
};

export const useRoomMembersQuery = (roomId) => {
  return useQuery({
    queryKey: ROOM_MEMBERS_QUERY_KEY(roomId),
    queryFn: async () => {
      const members = await roomAPI.getMembers(roomId);
      return members || [];
    },
    staleTime: 1000 * 60,
    enabled: !!roomId,
  });
};

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomData) => {
      const newRoom = await roomAPI.createRoom(roomData);
      return newRoom;
    },
    onSuccess: (newRoom) => {
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
      queryClient.setQueryData(ROOMS_QUERY_KEY, (oldData) => [...(oldData || []), newRoom]);
    },
  });
};

export const useJoinRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code) => {
      const room = await roomAPI.joinRoom(code);
      return room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
    },
  });
};

export const useAddMessageToCache = () => {
  const queryClient = useQueryClient();

  return (roomId, message) => {
    queryClient.setQueryData(ROOM_MESSAGES_QUERY_KEY(roomId), (oldData) => [
      ...(oldData || []),
      message,
    ]);
  };
};

export const useUpdateRoomMembersCache = () => {
  const queryClient = useQueryClient();

  return (roomId, members) => {
    queryClient.setQueryData(ROOM_MEMBERS_QUERY_KEY(roomId), members);
  };
};
