import React, { useState, useEffect } from 'react';
import { fetchOrders } from '@/services/api';
import { Order } from '@/types';

export default function StaffOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Guest</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="bg-gray-100">
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">
                  {typeof order.guest === 'string' ? order.guest : order.guest.guestName}
                </td>
                <td className="border px-4 py-2">${order.totalAmount.toFixed(2)}</td>
                <td className="border px-4 py-2">{order.status || 'pending'}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500 hover:underline mr-2"
                    onClick={() => console.log('View Order', order._id)}
                  >
                    View
                  </button>
                  <button
                    className="text-green-500 hover:underline"
                    onClick={() => console.log('Update Status', order._id)}
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
