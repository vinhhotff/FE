import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGuests, createGuest, updateGuest, deleteGuest } from '@/services/api';

export function useAdminGuests(query: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['guests', query],
    queryFn: () => getGuests(query),
    select: (res) => res.data,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGuest,
    onSuccess: () => queryClient.invalidateQueries(['guests']),
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => updateGuest(id, data),
    onSuccess: () => queryClient.invalidateQueries(['guests']),
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGuest,
    onSuccess: () => queryClient.invalidateQueries(['guests']),
  });
}

