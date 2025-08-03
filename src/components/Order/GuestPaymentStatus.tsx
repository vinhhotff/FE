import { useGuestPayments } from '@/hooks/useGuestPayments';
import { createPayment } from '@/services/api';
import { FC, useState } from 'react';

interface GuestPaymentStatusProps {
  tableName: string;
  guestName: string;
}

const GuestPaymentStatus: FC<GuestPaymentStatusProps> = ({ tableName, guestName }) => {
  const { data, isLoading, refetch } = useGuestPayments(tableName, guestName);
  const [paying, setPaying] = useState(false);
  const [payDone, setPayDone] = useState(false);

  async function handlePay() {
    setPaying(true);
    try {
      // Assume backend sums unpaid orders for guest/table
      await createPayment({ guestName, tableName, method: 'cash' }); // method can be a dropdown QR/cash/card
      setPayDone(true);
      refetch();
    } catch (e) {
      alert('Payment failed!');
    }
    setPaying(false);
  }

  if (!guestName) return null;
  if (isLoading) return <p>Loading your payments...</p>;

  const hasUnpaid = data && data.items.some((p: any) => p.status !== 'completed');
  const totalDue = data ? data.items.filter((p: any) => p.status !== 'completed').reduce((a: number, p: any) => a + p.amount, 0) : 0;

  return (
    <div className="mt-6 bg-white rounded shadow p-4">
      <h4 className="font-bold mb-2">Your Payments (Bills)</h4>
      {data && data.items.map((payment: any) => (
        <div key={payment._id} className="mb-3 border-b pb-2">
          <div className="text-sm text-gray-600">
            Method: <b>{payment.method}</b> | Time: {new Date(payment.createdAt).toLocaleTimeString()}
          </div>
          <div className="text-right font-bold mt-1">Amount: ${payment.amount}</div>
          <div className={"mt-1 text-right font-medium " + (payment.status === 'completed' ? 'text-green-700' : 'text-orange-500')}>
            {payment.status === 'completed' ? 'Paid' : 'Pending'}
          </div>
        </div>
      ))}
      {hasUnpaid && (
        <button
          className="mt-4 px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold w-full"
          onClick={handlePay}
          disabled={paying}
        >
          {paying ? 'Paying...' : `Pay Now $${totalDue}`}
        </button>
      )}
      {payDone && (
        <div className="text-center text-green-700 font-semibold mt-3">Payment processed! Thank you.</div>
      )}
    </div>
  );
};

export default GuestPaymentStatus;

