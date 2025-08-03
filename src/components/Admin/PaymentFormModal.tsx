import { Payment } from '@/types';
import { FC, useState } from 'react';

interface PaymentFormModalProps {
  initial?: Payment;
  onSubmit: (data: { guest: string; amount: number; method: Payment['method'] }) => void;
  onClose: () => void;
}

const PaymentFormModal: FC<PaymentFormModalProps> = ({ initial, onSubmit, onClose }) => {
  const [guest, setGuest] = useState(initial?.guest || '');
  const [amount, setAmount] = useState(initial?.amount || 0);
  const [method, setMethod] = useState<Payment['method']>((initial?.method as Payment['method']) || 'cash');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{initial ? 'Edit Payment' : 'New Payment'}</h2>
        <div className="mb-3">
          <label className="block mb-1">Guest</label>
          <input value={guest} onChange={e=>setGuest(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Amount ($)</label>
          <input type="number" min={0} value={amount} onChange={e=>setAmount(Number(e.target.value))} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Method</label>
          <select value={method} onChange={e=>setMethod(e.target.value as Payment['method'])} className="border rounded px-2 py-1 w-full">
            <option value="cash">Cash</option>
            <option value="QR">QR</option>
            <option value="card">Card</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1 bg-primary text-white rounded" onClick={()=>onSubmit({guest, amount, method})}>{initial?'Update':'Create'}</button>
          <button className="ml-2 px-4 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default PaymentFormModal;

