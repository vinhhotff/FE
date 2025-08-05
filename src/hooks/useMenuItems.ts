import { useQuery } from '@tanstack/react-query';
import { getMenuItems } from '@/services/api';

export function useMenuItems(params?: any) {
  return useQuery({
    queryKey: ['menuItems', params],
    queryFn: () => getMenuItems(params).then(res => res.data.data), // Lấy đúng array từ res.data.data
    // Nếu cần filter trong select thì dùng:
    // select: (data) => (Array.isArray(data) ? data : []),
  });
}

