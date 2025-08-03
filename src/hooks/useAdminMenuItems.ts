import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/api';

export function useAdminMenuItems(query: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['menuItems', query],
    queryFn: () => getMenuItems(query),
    select: (res) => res.data,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => queryClient.invalidateQueries(['menuItems']),
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => updateMenuItem(id, data),
    onSuccess: () => queryClient.invalidateQueries(['menuItems']),
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => queryClient.invalidateQueries(['menuItems']),
  });
}

