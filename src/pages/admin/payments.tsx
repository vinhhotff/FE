import { useState } from 'react';
import { useAdminPayments, useCreatePayment, useUpdatePayment, useDeletePayment } from '@/hooks/useAdminPayments';
import PaymentList from '@/components/Admin/PaymentList';
import PaymentFormModal from '@/components/Admin/PaymentFormModal';
import { Payment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPaymentsPage() {
  const { user, loading } = useAuth();
  const { data, isLoading } = useAdminPayments();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();
  const [modalOpen, setModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment|null>(null);

  if (loading || !user) return <p className="p-12 text-center">Loading...</p>;
  if (user.role !== 'ADMIN') return <p>Not authorized</p>;
  function handleCreate() { setEditPayment(null); setModalOpen(true); }
  function handleSave(data: { guest: string; amount: number; method: Payment['method'] }) {
    if (editPayment) updatePayment.mutate({ id: editPayment._id, ...data });
    else createPayment.mutate(data);
    setModalOpen(false);
  }
  function handleEdit(payment: Payment) { setEditPayment(payment); setModalOpen(true); }
  function handleDelete(id: string) { if (confirm('Delete payment?')) deletePayment.mutate(id); }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Payments</h1>
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleCreate}>+ Payment</button>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <PaymentList payments={data?.items || []} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {modalOpen && (
        <PaymentFormModal
          initial={editPayment || undefined}
          onSubmit={handleSave}
          onClose={()=>setModalOpen(false)}
        />
      )}
    </div>
  );
}

