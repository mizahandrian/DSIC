import { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await api.post("/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);

    navigate("/home");
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

      <button type="submit">Login</button>
    </form>
  );
}