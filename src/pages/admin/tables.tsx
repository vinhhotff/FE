import { useState } from 'react';
import { useAdminTables, useCreateTable, useUpdateTable, useDeleteTable } from '@/hooks/useAdminTables';
import TableList from '@/components/Admin/TableList';
import TableFormModal from '@/components/Admin/TableFormModal';
import { Table } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminTablesPage() {
  const { user, loading } = useAuth();
  const { data, isLoading } = useAdminTables();
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTable, setEditTable] = useState<Table|null>(null);

  if (loading || !user) return <p className="p-12 text-center">Loading...</p>;
  if (user.role !== 'ADMIN') return <p>Not authorized</p>;

  function handleCreate() { setEditTable(null); setModalOpen(true); }

  function handleSave(data: { tableName: string; status: Table['status'] }) {
    if (editTable) updateTable.mutate({ id: editTable._id, ...data });
    else createTable.mutate(data);
    setModalOpen(false);
  }

  function handleEdit(table: Table) { setEditTable(table); setModalOpen(true); }
  function handleDelete(id: string) { if (confirm('Delete table?')) deleteTable.mutate(id); }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Tables</h1>
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleCreate}>+ Table</button>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <TableList tables={data?.items || []} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {modalOpen && (
        <TableFormModal
          initial={editTable || undefined}
          onSubmit={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

