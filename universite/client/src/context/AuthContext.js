import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
          const [authTokens, setAuthTokens] = useState(() =>
                    localStorage.getItem("authTokens")
                              ? JSON.parse(localStorage.getItem("authTokens"))
                              : null
          );

          const [user, setUser] = useState(() =>
                    localStorage.getItem("authTokens")
                              ? jwtDecode(localStorage.getItem("authTokens"))
                              : null
          );

          const [loading, setLoading] = useState(true);
          const navigate = useNavigate();

          // ✅ Connexion utilisateur
          const loginUser = async (email, password) => {
                    const response = await fetch("http://127.0.0.1:8000/api/token/", {
                              method: "POST",
                              headers: {
                                        "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (response.status === 200) {
                              console.log("Logged In");
                              setAuthTokens(data);
                              setUser(jwtDecode(data.access));
                              localStorage.setItem("authTokens", JSON.stringify(data));

                              // ✅ Redirection en fonction du rôle de l'utilisateur
                              const role = jwtDecode(data.access).role;
                              if (role === "etudiant") {
                                        navigate("/etudiant");
                              } else if (role === "secretaire") {
                                        navigate("/secretaire");
                              } else if (role === "enseignant") {
                                        navigate("/enseignant");
                              }

                              swal.fire({
                                        title: "Connexion réussie",
                                        icon: "success",
                                        toast: true,
                                        timer: 6000,
                                        position: "top-right",
                                        timerProgressBar: true,
                                        showConfirmButton: false,
                              });
                    } else {
                              swal.fire({
                                        title: "Email ou mot de passe incorrect",
                                        icon: "error",
                                        toast: true,
                                        timer: 6000,
                                        position: "top-right",
                                        timerProgressBar: true,
                                        showConfirmButton: false,
                              });
                    }
          };

          // ✅ Inscription utilisateur
          const registerUser = async (userData) => {
                    const { email, nom, prenom, password, role, annee, tel, fonction } = userData;

                    const requestBody = {
                              email,
                              nom,
                              prenom,
                              password,
                              role,
                              tel: tel || "",
                    };

                    if (role === "etudiant") {
                              requestBody.annee = annee;
                    } else if (role === "enseignant") {
                              requestBody.fonction = fonction;
                    }

                    try {
                              const response = await fetch("http://127.0.0.1:8000/api/register/", {
                                        method: "POST",
                                        headers: {
                                                  "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(requestBody),
                              });

                              if (response.status === 201) {
                                        navigate("/login");
                                        swal.fire({
                                                  title: "Inscription réussie ! Connectez-vous maintenant",
                                                  icon: "success",
                                                  toast: true,
                                                  timer: 6000,
                                                  position: "top-right",
                                                  timerProgressBar: true,
                                                  showConfirmButton: false,
                                        });
                              } else {
                                        const errorData = await response.json();
                                        swal.fire({
                                                  title: "Erreur lors de l'inscription",
                                                  text: errorData.detail || "Veuillez vérifier vos informations",
                                                  icon: "error",
                                                  toast: true,
                                                  timer: 6000,
                                                  position: "top-right",
                                                  timerProgressBar: true,
                                                  showConfirmButton: false,
                                        });
                              }
                    } catch {
                              swal.fire({
                                        title: "Erreur serveur",
                                        text: "Impossible de contacter le serveur, réessayez plus tard.",
                                        icon: "error",
                                        toast: true,
                                        timer: 5000,
                                        position: "top-right",
                                        timerProgressBar: true,
                                        showConfirmButton: false,
                              });
                    }
          };

          // ✅ Déconnexion utilisateur
          const logoutUser = () => {
                    setAuthTokens(null);
                    setUser(null);
                    localStorage.removeItem("authTokens");
                    navigate("/login");
                    swal.fire({
                              title: "Déconnexion réussie",
                              icon: "success",
                              toast: true,
                              timer: 6000,
                              position: "top-right",
                              timerProgressBar: true,
                              showConfirmButton: false,
                    });
          };

          useEffect(() => {
                    if (authTokens) {
                              setUser(jwtDecode(authTokens.access));
                    }
                    setLoading(false);
          }, [authTokens]);

          const contextData = {
                    user,
                    setUser,
                    authTokens,
                    setAuthTokens,
                    registerUser,
                    loginUser,
                    logoutUser,
          };

          return (
                    <AuthContext.Provider value={contextData}>
                              {!loading && children}
                    </AuthContext.Provider>
          );
};
