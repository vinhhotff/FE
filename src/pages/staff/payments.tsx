import React, { useState, useEffect } from 'react';
import { fetchPayments } from '@/services/api';
import { Payment } from '@/types';

export default function StaffPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments().then((data) => {
      setPayments(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Payments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">Guest</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="bg-gray-100">
                <td className="border px-4 py-2">{payment._id}</td>
                <td className="border px-4 py-2">
                  {typeof payment.guest === 'string' ? payment.guest : payment.guest.guestName}
                </td>
                <td className="border px-4 py-2">
                  ${payment.amount.toFixed(2)}
                </td>
                <td className="border px-4 py-2">{payment.method}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => console.log('View Payment', payment._id)}
                  >
                    View
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

