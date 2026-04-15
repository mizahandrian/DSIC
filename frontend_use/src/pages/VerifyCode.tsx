import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const [params] = useSearchParams();
  const email = params.get("email");

  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://127.0.0.1:8000/api/verify-code", {
        email,
        otp,
      });

      setMessage("Code valide ✔");

      setTimeout(() => {
        navigate(`/reset-password?email=${email}`);
      }, 1000);
    } catch (err) {
      setMessage("Code invalide ❌");
    }
  };

  return (
    <div>
      <h2>Vérifier le code</h2>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Entrer le code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button>Vérifier</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}