import { useMenuItems } from '@/hooks/useMenuItems';
import MenuList from '@/components/Menu/MenuList';
import GuestOrderCart from '@/components/Order/GuestOrderCart';
import { GuestOrderProvider, useGuestOrderContext } from '@/contexts/GuestOrderContext';
import { createOrder } from '@/services/api';
import { useState } from 'react';
import { useRouter } from 'next/router';
import GuestOrderStatus from '@/components/Order/GuestOrderStatus';
import GuestPaymentStatus from '@/components/Order/GuestPaymentStatus';

// This would be routed like /guest/table/[tableName]
export default function GuestTablePage() {
  const router = useRouter();
  const { tableName } = router.query;
  
  if (!tableName || typeof tableName !== 'string') {
    return <p>Loading...</p>;
  }
  
  return (
    <GuestOrderProvider>
      <GuestTableInner tableName={tableName} />
    </GuestOrderProvider>
  );
}

function GuestTableInner({ tableName }: { tableName: string }) {
  const { data, isLoading } = useMenuItems();
  const { cart, total, guestName, setGuestName, resetCart } = useGuestOrderContext();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      await createOrder({ guestName, tableName, items: cart.map(item => ({ menuItem: item.menuItem._id, quantity: item.quantity })), totalAmount: total });
      setOrderSuccess(true);
      resetCart();
    } catch (e) {
      alert('Failed to submit order.');
    }
    setPlacingOrder(false);
  };

  if (isLoading) return <p>Loading menu...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6 flex flex-col lg:flex-row">
      <div className="flex-1">
        <label className="block font-semibold mb-1">Your Name</label>
        <input
          className="mb-4 border p-2 rounded w-full"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          placeholder="Enter your name"
        />
        <MenuList items={data?.items ?? []} onAdd={/* add to cart handled by context */ (item) => {}} />
        {guestName && <GuestOrderStatus tableName={tableName} guestName={guestName} />}
        {guestName && <GuestPaymentStatus tableName={tableName} guestName={guestName} />}
      </div>
      <div className="lg:w-96 lg:ml-8 mt-8 lg:mt-0">
        <GuestOrderCart />
        <button
          className="mt-4 w-full py-2 rounded bg-primary text-white text-lg font-bold disabled:bg-gray-300"
          disabled={!guestName || !cart.length || placingOrder}
          onClick={handlePlaceOrder}
        >
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
        {orderSuccess && <p className="mt-2 text-green-600 font-semibold">Order placed successfully!</p>}
      </div>
    </div>
  );
}

