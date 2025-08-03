import { useGuestOrders } from '@/hooks/useGuestOrders';
import { FC } from 'react';

interface GuestOrderStatusProps {
  tableName: string;
  guestName: string;
}

const GuestOrderStatus: FC<GuestOrderStatusProps> = ({ tableName, guestName }) => {
  const { data, isLoading } = useGuestOrders(tableName, guestName);

  if (!guestName) return null;
  if (isLoading) return <p>Loading your orders...</p>;
  if (!data || !data.items.length) return <p>You have no orders yet.</p>;

  return (
    <div className="mt-6 bg-white rounded shadow p-4">
      <h4 className="font-bold mb-2">Your Orders</h4>
      {data.items.map((order: any) => (
        <div key={order._id} className="mb-3 border-b pb-2">
          <div className="text-sm text-gray-600">Status: <b>{order.status}</b> | Time: {new Date(order.createdAt).toLocaleTimeString()}</div>
          <ul className="mt-1">
            {order.items.map((it: any) => (
              <li key={it.menuItem+it._id} className="ml-2 text-gray-900">
                {it.quantity} x {it.menuItem}
              </li>
            ))}
          </ul>
          <div className="text-right font-bold mt-1">Total: ${order.totalAmount}</div>
        </div>
      ))}
    </div>
  );
};

export default GuestOrderStatus;

