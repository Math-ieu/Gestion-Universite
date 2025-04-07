import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Etudiant from "../Dashboards/Student/Etudiant";
import Secretaire from "../Dashboards/Secretary/Secretaire";
import Enseignant from "../Dashboards/Teacher/Enseignant";
import AuthContext from "../../context/AuthContext";

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  // Si l'utilisateur n'existe pas, rediriger vers la page de connexion
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Afficher le tableau de bord approprié en fonction du rôle
  switch (user.role) {
    case "etudiant":
      return <Etudiant />;
    case "enseignant":
      return <Enseignant />;
    case "secretaire":
      return <Secretaire />;
    default:
      // Si le rôle n'est pas reconnu, rediriger vers la page de connexion
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRouter;