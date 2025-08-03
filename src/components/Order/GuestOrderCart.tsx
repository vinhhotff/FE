import { useGuestOrderContext } from '@/contexts/GuestOrderContext';
import { FC } from 'react';

const GuestOrderCart: FC = () => {
  const { cart, total, removeFromCart, updateQuantity } = useGuestOrderContext();

  if (!cart.length) return <p className="text-center text-gray-400">Your cart is empty</p>;

  return (
    <div className="mt-4 bg-white rounded shadow p-4">
      <h4 className="font-bold mb-2">Your Order</h4>
      {cart.map(item => (
        <div key={item.menuItem._id} className="flex items-center justify-between border-b py-2">
          <div>
            <span>{item.menuItem.name}</span>
            <input
              type="number"
              min={1}
              value={item.quantity}
              className="mx-2 w-14 text-center border rounded"
              onChange={e => updateQuantity(item.menuItem._id, Number(e.target.value))}
            /> x {item.menuItem.price}
          </div>
          <div>
            <strong>${item.menuItem.price * item.quantity}</strong>
            <button onClick={() => removeFromCart(item.menuItem._id)} className="ml-2 text-red-500">Remove</button>
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-2">
        <span className="text-lg font-bold">Total: ${total}</span>
      </div>
    </div>
  );
};

export default GuestOrderCart;

