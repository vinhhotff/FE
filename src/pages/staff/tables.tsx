import React, { useState, useEffect } from 'react';
import { fetchTables } from '@/services/api';
import { Table } from '@/types';

export default function StaffTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables().then((data) => {
      setTables(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Tables</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="w-1/3 px-4 py-2">Table Name</th>
              <th className="w-1/3 px-4 py-2">Status</th>
              <th className="w-1/3 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id} className="bg-gray-100">
                <td className="border px-4 py-2">{table.tableName}</td>
                <td className="border px-4 py-2">{table.status}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => console.log('View Details', table._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
