import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/chatApi';

const USER_PROFILE_QUERY_KEY = ['user', 'profile'];
const USER_STATUS_QUERY_KEY = ['user', 'status'];

export const useUserProfileQuery = (options = {}) => {
  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const user = await userAPI.getProfile();
      return user;
    },
    staleTime: 1000 * 60 * 10, 
    ...options,
  });
};

export const useSyncUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const userData = await userAPI.syncUser();
      return userData;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, userData);
    },
  });
};

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status) => {
      const userData = await userAPI.updateStatus(status);
      return userData;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, userData);
      queryClient.setQueryData(USER_STATUS_QUERY_KEY, userData.status);
    },
  });
};
