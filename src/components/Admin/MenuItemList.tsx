import { MenuItem } from '@/types';
import { FC } from 'react';

interface MenuItemListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const MenuItemList: FC<MenuItemListProps> = ({ items, onEdit, onDelete }) => (
  <table className="w-full bg-white rounded shadow">
    <thead>
      <tr className="bg-gray-100">
        <th className="py-2 px-3 text-left">Name</th>
        <th className="py-2 px-3 text-left">Price</th>
        <th className="py-2 px-3 text-left">Status</th>
        <th className="py-2 px-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {items.map((row) => (
        <tr key={row._id} className="border-t">
          <td className="py-2 px-3">{row.name}</td>
          <td className="py-2 px-3">${row.price}</td>
          <td className="py-2 px-3">{row.isAvailable ? 'Available' : 'Unavailable'}</td>
          <td className="py-2 px-3 text-center">
            <button
              className="text-blue-700 hover:underline mr-3"
              onClick={() => onEdit(row)}
            >
              Edit
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => onDelete(row._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default MenuItemList;

