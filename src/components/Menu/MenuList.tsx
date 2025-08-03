import { MenuItem } from '@/types';
import { FC } from 'react';

interface MenuListProps {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
}

const MenuList: FC<MenuListProps> = ({ items, onAdd }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item._id} className="p-4 rounded border shadow hover:shadow-md bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold text-primary">${item.price}</span>
            <button
              className="ml-2 px-3 py-1 bg-primary text-white rounded shadow hover:bg-primary/90"
              onClick={() => onAdd(item)}
              disabled={!item.isAvailable}
            >
              {item.isAvailable ? 'Add' : 'Unavailable'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;

