import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, createOrder, updateOrder, deleteOrder } from '@/services/api';

export function useAdminOrders(query: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['orders', query],
    queryFn: () => getOrders(query),
    select: (res) => res.data,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => queryClient.invalidateQueries(['orders']),
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => updateOrder(id, data),
    onSuccess: () => queryClient.invalidateQueries(['orders']),
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => queryClient.invalidateQueries(['orders']),
  });
}

