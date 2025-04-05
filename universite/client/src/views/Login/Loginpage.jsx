import React, { useContext, useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import "./Loginpage.css";

export const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    email.length > 0 && loginUser(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <LogIn size={48} className="icon" />
        </div>
        <h2 className="text-2xl font-bold text-center">
          Connectez-vous à votre compte
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Adresse email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail size={20} className="text-gray-400" />
              </span>
              <input
                type="email"
                id="email"
                placeholder="vous@exemple.com"
                className="mt-1 block w-full px-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={20} className="text-gray-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 block w-full px-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            id="login-button"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Se connecter
          </button>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{" "}
            </span>
            <a
              href="/register"
              className="text-sm hover:underline"
              id="link"
            >
              Inscrivez-vous
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};