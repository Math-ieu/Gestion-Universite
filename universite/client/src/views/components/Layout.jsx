import React, { useContext } from "react";
import { LogOut } from "lucide-react";
import  AuthContext from "../../context/AuthContext";

export const Layout = ({ children }) => {
  const { logoutUser } = useContext(AuthContext);
  const handleLogout = () => {
    // Add logout logic here
    logoutUser();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Univ</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-indigo-200 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
