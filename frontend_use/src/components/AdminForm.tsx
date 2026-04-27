import { useState, useEffect } from "react";
import type { Admin } from "../types/Admin";

type Props = {
  onSubmit: (admin: Admin) => void;
  initialData?: Admin;
};

const AdminForm = ({ onSubmit, initialData }: Props) => {
  const [form, setForm] = useState<Admin>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    role: "admin",
    password: ""
  });

  // remplir le formulaire si modification
  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, password: "" });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, marginBottom: 20 }}>
      <h3>{initialData ? "Modifier Admin" : "Ajouter Admin"}</h3>

      <input name="name" placeholder="Nom" value={form.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="phone" placeholder="Téléphone" value={form.phone} onChange={handleChange} />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>

      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        value={form.password}
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={() => onSubmit(form)}>Enregistrer</button>
    </div>
  );
};

export default AdminForm;