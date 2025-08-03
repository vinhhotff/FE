import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPayments, createPayment, updatePayment, deletePayment } from '@/services/api';

export function useAdminPayments(query: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['payments', query],
    queryFn: () => getPayments(query),
    select: (res) => res.data,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => queryClient.invalidateQueries(['payments']),
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => updatePayment(id, data),
    onSuccess: () => queryClient.invalidateQueries(['payments']),
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () => queryClient.invalidateQueries(['payments']),
  });
}

