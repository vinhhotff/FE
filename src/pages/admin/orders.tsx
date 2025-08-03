import { useState } from 'react';
import { useAdminOrders, useCreateOrder, useUpdateOrder, useDeleteOrder } from '@/hooks/useAdminOrders';
import OrderList from '@/components/Admin/OrderList';
import OrderFormModal from '@/components/Admin/OrderFormModal';
import { Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const { data, isLoading } = useAdminOrders();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const [modalOpen, setModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order|null>(null);

  if (loading || !user) return <p className="p-12 text-center">Loading...</p>;
  if (user.role !== 'admin') return <p>Not authorized</p>;
  function handleCreate() { setEditOrder(null); setModalOpen(true); }
  function handleSave(data: { guest: string; status: Order['status'] }) {
    if (editOrder) updateOrder.mutate({ id: editOrder._id, ...data });
    else createOrder.mutate(data);
    setModalOpen(false);
  }
  function handleEdit(order: Order) { setEditOrder(order); setModalOpen(true); }
  function handleDelete(id: string) { if (confirm('Delete order?')) deleteOrder.mutate(id); }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleCreate}>+ Order</button>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <OrderList orders={data?.items || []} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {modalOpen && (
        <OrderFormModal
          initial={editOrder || undefined}
          onSubmit={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

