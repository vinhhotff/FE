import { Guest } from '@/types';
import { FC, useState } from 'react';

interface GuestFormModalProps {
  initial?: Guest;
  onSubmit: (data: { guestName: string; tableName: string; isPaid: boolean }) => void;
  onClose: () => void;
}

const GuestFormModal: FC<GuestFormModalProps> = ({ initial, onSubmit, onClose }) => {
  const [guestName, setGuestName] = useState(initial?.guestName || '');
  const [tableName, setTableName] = useState(initial?.tableName || '');
  const [isPaid, setIsPaid] = useState(initial?.isPaid || false);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{initial ? 'Edit Guest' : 'New Guest'}</h2>
        <div className="mb-3">
          <label className="block mb-1">Guest Name</label>
          <input value={guestName} onChange={e=>setGuestName(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Table Name</label>
          <input value={tableName} onChange={e=>setTableName(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Paid</label>
          <input type="checkbox" checked={isPaid} onChange={e=>setIsPaid(e.target.checked)} /> Yes
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1 bg-primary text-white rounded" onClick={()=>onSubmit({guestName, tableName, isPaid})}>{initial?'Update':'Create'}</button>
          <button className="ml-2 px-4 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default GuestFormModal;

