import { useState, useEffect } from "react";
import type { Admin } from "../types/Admin";

type Props = {
  onSubmit: (admin: Admin) => void;
  initialData?: Admin;
  onCancel?: () => void;
  isLoading?: boolean;
};

const AdminForm = ({ onSubmit, initialData, onCancel, isLoading = false }: Props) => {
  const [form, setForm] = useState<Admin>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    role: "admin",
    password: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Admin, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Admin, boolean>>>({});

  // remplir le formulaire si modification
  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, password: "" });
    }
  }, [initialData]);

  const validateField = (name: keyof Admin, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Le nom est requis";
        if (value.trim().length < 2) return "Le nom doit contenir au moins 2 caractères";
        return "";
      case "email":
        if (!value.trim()) return "L'email est requis";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Email invalide";
        return "";
      case "phone":
        if (value && !/^[\d\s+()-]{10,}$/.test(value.replace(/\s/g, ''))) {
          return "Numéro de téléphone invalide";
        }
        return "";
      case "password":
        if (!initialData && !value) return "Le mot de passe est requis";
        if (value && value.length < 6) return "Le mot de passe doit contenir au moins 6 caractères";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validation en temps réel
    if (touched[name as keyof Admin]) {
      const error = validateField(name as keyof Admin, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof Admin, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Admin, string>> = {};
    let isValid = true;

    (Object.keys(form) as Array<keyof Admin>).forEach(key => {
      if (key === 'id') return;
      if (key === 'phone' && !form[key]) return;
      if (key === 'password' && initialData && !form[key]) return;
      
      const value = form[key] as string;
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: !initialData || !!form.password
    });
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(form);
      if (!initialData) {
        // Reset form after successful submission (only for add mode)
        setForm({
          id: 0,
          name: "",
          email: "",
          phone: "",
          role: "admin",
          password: ""
        });
        setTouched({});
        setErrors({});
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (initialData) {
      // Reset to initial data if available
      setForm({ ...initialData, password: "" });
      setTouched({});
      setErrors({});
    } else {
      // Clear form
      setForm({
        id: 0,
        name: "",
        email: "",
        phone: "",
        role: "admin",
        password: ""
      });
      setTouched({});
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-header">
        <h3 className="form-title">
          {initialData ? (
            <>
              <span className="form-icon">✏️</span>
              Modifier l'administrateur
            </>
          ) : (
            <>
              <span className="form-icon">➕</span>
              Ajouter un administrateur
            </>
          )}
        </h3>
        {initialData && (
          <div className="admin-id-badge">
            ID: {initialData.id}
          </div>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">
            Nom complet <span className="required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jean Dupont"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name && touched.name ? "error" : ""}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.name && touched.name && (
            <span className="error-message">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jean@example.com"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? "error" : ""}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.email && touched.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.phone && touched.phone ? "error" : ""}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.phone && touched.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="role">
            Rôle <span className="required">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className="role-select"
          >
            <option value="admin">📋 Admin</option>
            <option value="super_admin">👑 Super Admin</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="password">
            Mot de passe {!initialData && <span className="required">*</span>}
            {initialData && <span className="optional">(laisser vide pour conserver l'actuel)</span>}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder={initialData ? "Nouveau mot de passe" : "Mot de passe"}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password && touched.password ? "error" : ""}
            disabled={isLoading}
            autoComplete="new-password"
          />
          {errors.password && touched.password && (
            <span className="error-message">{errors.password}</span>
          )}
          {!initialData && (
            <span className="hint">Minimum 6 caractères</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={handleCancel}
          className="btn-cancel"
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn-submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Chargement...
            </>
          ) : (
            <>
              {initialData ? "💾 Mettre à jour" : "✅ Enregistrer"}
            </>
          )}
        </button>
      </div>

      <style>{`
        .admin-form {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-icon {
          font-size: 24px;
        }

        .admin-id-badge {
          background: #e2e8f0;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: #4a5568;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 14px;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .required {
          color: #e53e3e;
          font-size: 12px;
        }

        .optional {
          font-size: 11px;
          font-weight: normal;
          color: #718096;
          margin-left: 8px;
        }

        .hint {
          font-size: 11px;
          color: #718096;
          margin-top: 4px;
        }

        .form-group input,
        .form-group select {
          padding: 10px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #e53e3e;
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background-color: #f7fafc;
          cursor: not-allowed;
        }

        .error-message {
          font-size: 12px;
          color: #e53e3e;
          margin-top: 4px;
        }

        .role-select {
          cursor: pointer;
          background-color: white;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 8px;
        }

        .btn-cancel,
        .btn-submit {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-cancel {
          background: #f7fafc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        .btn-submit {
          background: linear-gradient(135deg, #4299e1, #3182ce);
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
        }

        .btn-cancel:disabled,
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-form {
            padding: 16px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .btn-cancel,
          .btn-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </form>
  );
};

export default AdminForm;