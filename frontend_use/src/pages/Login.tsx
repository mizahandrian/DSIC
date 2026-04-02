import React from "react";
import Input from "../components/Input";

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Gestion Personnel
        </h2>

        {/* Form */}
        <form>
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Mot de passe" />

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">
            Se connecter
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-4">
          Pas de compte ?{" "}
          <span className="text-blue-500 cursor-pointer">
            S'inscrire
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;