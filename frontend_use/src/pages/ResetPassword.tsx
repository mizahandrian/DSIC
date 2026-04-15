import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const [params] = useSearchParams();
  const email = params.get("email");

  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas ❌");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/reset-password", {
        email,
        password,
        password_confirmation: confirm,
      });

      setMessage("Mot de passe changé ✔");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setMessage("Erreur lors du changement ❌");
    }
  };

  return (
    <div>
      <h2>Nouveau mot de passe</h2>

      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmer mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button>Changer mot de passe</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}