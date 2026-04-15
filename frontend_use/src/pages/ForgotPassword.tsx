import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://127.0.0.1:8000/api/forgot-password", {
        email,
      });

      setMessage("Code envoyé par email 📧");

      setTimeout(() => {
        navigate(`/verify-code?email=${email}`);
      }, 1000);
    } catch (err: any) {
  console.log(err.response?.data); // 👈 IMPORTANT DEBUG
  setMessage(err.response?.data?.message || "Erreur lors de l'envoi ❌");
} finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Mot de passe oublié</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Entrer votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Envoi..." : "Envoyer code"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}