import { MenuItem } from '@/types';
import { FC, useState } from 'react';

interface MenuItemFormModalProps {
  initial?: MenuItem;
  onSubmit: (data: { name: string; price: number; isAvailable: boolean; description: string }) => void;
  onClose: () => void;
}

const MenuItemFormModal: FC<MenuItemFormModalProps> = ({ initial, onSubmit, onClose }) => {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [price, setPrice] = useState(initial?.price || 0);
  const [isAvailable, setIsAvailable] = useState(initial?.isAvailable !== false);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{initial ? 'Edit Menu Item' : 'New Menu Item'}</h2>
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Description</label>
          <input value={description} onChange={e=>setDescription(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Price ($)</label>
          <input type="number" value={price} min={0} onChange={e=>setPrice(Number(e.target.value))} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Available</label>
          <input type="checkbox" checked={isAvailable} onChange={e=>setIsAvailable(e.target.checked)} /> Yes
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1 bg-primary text-white rounded" onClick={()=>onSubmit({name, price, description, isAvailable})}>{initial?'Update':'Create'}</button>
          <button className="ml-2 px-4 py-1 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default MenuItemFormModal;

