import type { Admin } from "../types/Admin";

type Props = {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (id: number) => void;
};

const AdminList = ({ admins, onEdit, onDelete }: Props) => {
  return (
    <div>
      <h3>Liste des admins</h3>

      {admins.map((admin) => (
        <div key={admin.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p><strong>Nom:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Téléphone:</strong> {admin.phone}</p>
          <p><strong>Rôle:</strong> {admin.role}</p>

          <button onClick={() => onEdit(admin)}>Modifier</button>
          <button onClick={() => onDelete(admin.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
};

export default AdminList;