import { useState } from 'react';
import {
  useAdminMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem
} from '@/hooks/useAdminMenuItems';
import MenuItemList from '@/components/Admin/MenuItemList';
import MenuItemFormModal from '@/components/Admin/MenuItemFormModal';
import { MenuItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminMenuPage() {
  const { user, loading } = useAuth();
  const { data, isLoading } = useAdminMenuItems();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem|null>(null);

  if (loading || !user) return <p className="p-12 text-center">Loading...</p>;
  if (user.role !== 'ADMIN') return <p>Not authorized</p>;

  function handleCreate() { setEditItem(null); setModalOpen(true); }

  function handleSave(data: { name: string; price: number; isAvailable: boolean; description: string }) {
    if (editItem) updateMenuItem.mutate({ id: editItem._id, ...data });
    else createMenuItem.mutate(data);
    setModalOpen(false);
  }

  function handleEdit(item: MenuItem) { setEditItem(item); setModalOpen(true); }
  function handleDelete(id: string) { if (confirm('Delete menu item?')) deleteMenuItem.mutate(id); }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Menu Items</h1>
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleCreate}>+ Menu Item</button>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <MenuItemList items={data?.items || []} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {modalOpen && (
        <MenuItemFormModal
          initial={editItem || undefined}
          onSubmit={handleSave}
          onClose={()=>setModalOpen(false)}
        />
      )}
    </div>
  );
}

