import { Table } from '@/types';
import { FC, useState } from 'react';

interface TableFormModalProps {
  initial?: Table;
  onSubmit: (data: { tableName: string; status: 'available'|'occupied'}) => void;
  onClose: () => void;
}

const TableFormModal: FC<TableFormModalProps> = ({ initial, onSubmit, onClose }) => {
  const [tableName, setTableName] = useState(initial?.tableName || '');
  const [status, setStatus] = useState<Table['status']>(initial?.status || 'available');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{initial ? 'Edit Table' : 'New Table'}</h2>
        <div className="mb-3">
          <label className="block mb-1">Table Name</label>
          <input value={tableName} onChange={e=>setTableName(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value as Table['status'])} className="border rounded px-2 py-1 w-full">
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1 bg-primary text-white rounded" onClick={()=>onSubmit({tableName, status})}>{initial?'Update':'Create'}</button>
          <button className="ml-2 px-4 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default TableFormModal;

