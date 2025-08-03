import { Guest } from '@/types';
import { FC } from 'react';

interface GuestListProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
}

const GuestList: FC<GuestListProps> = ({ guests, onEdit, onDelete }) => (
  <table className="w-full bg-white rounded shadow">
    <thead>
      <tr className="bg-gray-100">
        <th className="py-2 px-3 text-left">Table</th>
        <th className="py-2 px-3 text-left">Name</th>
        <th className="py-2 px-3 text-left">Paid</th>
        <th className="py-2 px-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {guests.map((row) => (
        <tr key={row._id} className="border-t">
          <td className="py-2 px-3">{row.tableName}</td>
          <td className="py-2 px-3">{row.guestName}</td>
          <td className="py-2 px-3">{row.isPaid ? 'Yes' : 'No'}</td>
          <td className="py-2 px-3 text-center">
            <button className="text-blue-700 hover:underline mr-3" onClick={() => onEdit(row)}>Edit</button>
            <button className="text-red-600 hover:underline" onClick={() => onDelete(row._id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default GuestList;

