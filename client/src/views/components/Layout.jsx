import React, { useContext } from "react";
import { LogOut, User } from "lucide-react";
import AuthContext from "../../context/AuthContext";

export const Layout = ({ children }) => {
  const { logoutUser, user } = useContext(AuthContext);
  
  const handleLogout = () => {
    // Add logout logic here
    logoutUser();
  };
 
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Univ</h1>
        
        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-2">
              <User size={18} />
              <div>
                <span className="font-medium">{user.nom}</span>
                {user.role && (
                  <span className="text-xs bg-indigo-800 px-2 py-1 rounded ml-2">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-indigo-200 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};