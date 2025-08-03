import { useState } from 'react';
import { useAdminGuests, useCreateGuest, useUpdateGuest, useDeleteGuest } from '@/hooks/useAdminGuests';
import GuestList from '@/components/Admin/GuestList';
import GuestFormModal from '@/components/Admin/GuestFormModal';
import { Guest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminGuestsPage() {
  const { user, loading } = useAuth();
  const { data, isLoading } = useAdminGuests();
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();
  const [modalOpen, setModalOpen] = useState(false);
  const [editGuest, setEditGuest] = useState<Guest|null>(null);

  if (loading || !user) return <p className="p-12 text-center">Loading...</p>;
  if (user.role !== 'admin') return <p>Not authorized</p>;

  function handleCreate() { setEditGuest(null); setModalOpen(true); }
  function handleSave(data: { guestName: string; tableName: string; isPaid: boolean }) {
    if (editGuest) updateGuest.mutate({ id: editGuest._id, ...data });
    else createGuest.mutate(data);
    setModalOpen(false);
  }
  function handleEdit(guest: Guest) { setEditGuest(guest); setModalOpen(true); }
  function handleDelete(id: string) { if (confirm('Delete guest?')) deleteGuest.mutate(id); }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Guests</h1>
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleCreate}>+ Guest</button>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <GuestList guests={data?.items || []} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {modalOpen && (
        <GuestFormModal
          initial={editGuest || undefined}
          onSubmit={handleSave}
          onClose={()=>setModalOpen(false)}
        />
      )}
    </div>
  );
}

