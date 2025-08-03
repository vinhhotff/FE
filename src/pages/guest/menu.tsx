import React, { useState, useEffect } from 'react';
import { fetchMenuItems } from '@/services/api';
import { MenuItem } from '@/types';

export default function GuestMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems().then((data) => {
      setMenuItems(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <div key={item._id} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-gray-800 font-bold">${item.price.toFixed(2)}</p>
            <button className="mt-2 bg-primary text-white px-4 py-2 rounded">
              Add to Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
