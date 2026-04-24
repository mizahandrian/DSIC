import { useEffect, useState } from "react";
import type { Admin } from "../types/Admin";
import AdminForm from "../components/AdminForm";
import AdminList from "../components/AdminList";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from "../Service/adminService";

const SuperAdmin = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const loadAdmins = async () => {
    const res = await getAdmins();
    setAdmins(res.data);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleSubmit = async (admin: Admin) => {
    if (selectedAdmin) {
      await updateAdmin(selectedAdmin.id, admin);
    } else {
      await createAdmin(admin);
    }
    setSelectedAdmin(null);
    loadAdmins();
  };

  const handleDelete = async (id: number) => {
    await deleteAdmin(id);
    loadAdmins();
  };

  return (
    <div>
      <h1>Super Admin</h1>

      <AdminForm
        onSubmit={handleSubmit}
        initialData={selectedAdmin || undefined}
      />

      <AdminList
        admins={admins}
        onEdit={(admin) => setSelectedAdmin(admin)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SuperAdmin;