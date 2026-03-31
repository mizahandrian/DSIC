import { useEffect, useState } from "react";
import api from "./api";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data));
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {user && <p>Bienvenue {user.name}</p>}
    </div>
  );
}