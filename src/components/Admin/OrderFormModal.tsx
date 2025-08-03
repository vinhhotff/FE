import { Order } from '@/types';
import { FC, useState } from 'react';

interface OrderFormModalProps {
  initial?: Order;
  onSubmit: (data: { guest: string; status: string }) => void;
  onClose: () => void;
}

const OrderFormModal: FC<OrderFormModalProps> = ({ initial, onSubmit, onClose }) => {
  const [guest, setGuest] = useState(typeof initial?.guest === 'string' ? initial.guest : initial?.guest?.guestName || '');
  const [status, setStatus] = useState<Order['status']>((initial?.status as Order['status']) || 'pending');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{initial ? 'Edit Order' : 'New Order'}</h2>
        <div className="mb-3">
          <label className="block mb-1">Guest</label>
          <input value={guest} onChange={e=>setGuest(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value as Order['status'])} className="border rounded px-2 py-1 w-full">
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="served">Served</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1 bg-primary text-white rounded" onClick={()=>onSubmit({guest, status})}>{initial?'Update':'Create'}</button>
          <button className="ml-2 px-4 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default OrderFormModal;

