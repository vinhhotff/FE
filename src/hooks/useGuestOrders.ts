import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/services/api';

export function useGuestOrders(tableName: string, guestName: string) {
  return useQuery({
    queryKey: ['guestOrders', tableName, guestName],
    enabled: !!tableName && !!guestName,
    queryFn: () => getOrders({ tableName, guestName }),
    select: res => res.data,
  });
}

