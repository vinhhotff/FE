import { useQuery } from '@tanstack/react-query';
import { getPayments } from '@/services/api';

export function useGuestPayments(tableName: string, guestName: string) {
  return useQuery({
    queryKey: ['guestPayments', tableName, guestName],
    enabled: !!tableName && !!guestName,
    queryFn: () => getPayments({ tableName, guestName }),
    select: res => res.data,
  });
}

