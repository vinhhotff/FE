import { Order } from '@/types';
import { FC } from 'react';

interface OrderListProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

const OrderList: FC<OrderListProps> = ({ orders, onEdit, onDelete }) => (
  <table className="w-full bg-white rounded shadow">
    <thead>
      <tr className="bg-gray-100">
        <th className="py-2 px-3 text-left">Guest</th>
        <th className="py-2 px-3 text-left">Total</th>
        <th className="py-2 px-3 text-left">Status</th>
        <th className="py-2 px-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((row) => (
        <tr key={row._id} className="border-t">
          <td className="py-2 px-3">{row.guest}</td>
          <td className="py-2 px-3">${row.totalAmount}</td>
          <td className="py-2 px-3">{row.status}</td>
          <td className="py-2 px-3 text-center">
            <button className="text-blue-700 hover:underline mr-3" onClick={() => onEdit(row)}>Edit</button>
            <button className="text-red-600 hover:underline" onClick={() => onDelete(row._id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OrderList;

