import { useQuery } from '@tanstack/react-query';
import { getMenuItems } from '@/services/api';

export function useMenuItems() {
  return useQuery({
    queryKey: ['menuItems'],
    queryFn: () => getMenuItems({}),
    select: res => res.data,
  });
}

