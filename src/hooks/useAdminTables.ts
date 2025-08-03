import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTables, createTable, updateTable, deleteTable } from '@/services/api';

export function useAdminTables(query: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['tables', query],
    queryFn: () => getTables(query),
    select: (res) => res.data,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTable,
    onSuccess: () => queryClient.invalidateQueries(['tables']),
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => updateTable(id, data),
    onSuccess: () => queryClient.invalidateQueries(['tables']),
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTable,
    onSuccess: () => queryClient.invalidateQueries(['tables']),
  });
}

