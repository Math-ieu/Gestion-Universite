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

  const getCsrfToken = () => {
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));

    return csrfCookie ? csrfCookie.split("=")[1] : "";
  };

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Connexion utilisateur - Modifiée pour utiliser une route unique /dashboard
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
      // Stocker les tokens d'authentification
      setAuthTokens(data);

      // Extraire les informations utilisateur directement des données reçues
      const userData = data.user;
      setUser(userData);

      // Stocker les données d'authentification dans le localStorage
      localStorage.setItem("authTokens", JSON.stringify(data));

      // Rediriger vers le dashboard unique quelle que soit le rôle
      navigate("/dashboard");

      swal.fire({
        title: "Connexion réussie",
        icon: "success",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      // Afficher le message d'erreur spécifique renvoyé par l'API
      const errorMessage = data.detail || "Email ou mot de passe incorrect";

      swal.fire({
        title: errorMessage,
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  // ✅ Inscription utilisateur
  const registerUser = async (userData) => {
    const {
      email,
      nom,
      prenom,
      password,
      password2,
      role,
      annee,
      tel,
      fonction,
    } = userData;

    const requestBody = {
      email,
      nom,
      prenom,
      password,
      password2,
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
          // Important pour CSRF avec Django
          "X-CSRFToken": getCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (response.status === 201) {
        navigate("/login");
        swal.fire({
          title: "Inscription réussie ! Connectez-vous maintenant",
          icon: "success",
          toast: true,
          timer: 4000,
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
          timer: 4000,
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
        timer: 4000,
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
      timer: 4000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  // ✅ Récupérer la liste des enseignants
  const fetchTeachersfunction = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/teachers/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`, // Ajout du token JWT
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return data; // Retourne la liste des enseignants
      } else {
        throw new Error("Erreur lors de la récupération des enseignants");
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: "Impossible de récupérer les enseignants",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return [];
    }
  };

  // ✅ Récupérer les cours d’un enseignant spécifique
  const fetchTeacherCourses = async (teacherId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses/?enseignant=${teacherId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`, // Ajout du token JWT
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        return data; // Retourne la liste des cours de l’enseignant
      } else {
        throw new Error("Erreur lors de la récupération des cours");
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: "Impossible de récupérer les cours",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return [];
    }
  };

  // ✅ Ajouter un cours
  const addCourse = async (courseData) => {
    try {
      console.log("Données envoyées:", courseData);

      const response = await fetch("http://127.0.0.1:8000/api/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({ ...courseData }),
      });

      const responseData = await response.json();
      console.log("Réponse complète:", responseData);
      console.log("Status code:", response.status);

      if (response.status === 201) {
        swal.fire({
          title: "Cours ajouté avec succès",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return responseData;
      } else {
        throw new Error(
          JSON.stringify(responseData) || "Erreur lors de l'ajout du cours"
        );
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      swal.fire({
        title: "Erreur",
        text:
          error.message && error.message.length < 100
            ? error.message
            : "Impossible d'ajouter le cours",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return null;
    }
  };
  // ✅ Ajouter un étudiant
  const addStudent = async (studentData) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/students/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({ ...studentData, role: "etudiant" }), // Force le rôle à "etudiant"
      });

      if (response.status === 201) {
        const data = await response.json();
        swal.fire({
          title: "Étudiant ajouté avec succès",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return data; // Retourne l'étudiant créé
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de l'ajout de l'étudiant"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: error.message || "Impossible d'ajouter l'étudiant",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return null;
    }
  };

  

  // ✅ Ajouter un enseignant
  const addTeacher = async (teacherData) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/teachers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({ ...teacherData, role: "enseignant" }), // Force le rôle à "enseignant"
      });

      if (response.status === 201) {
        const data = await response.json();
        swal.fire({
          title: "Enseignant ajouté avec succès",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return data; // Retourne l'enseignant créé
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de l'ajout de l'enseignant"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: error.message || "Impossible d'ajouter l'enseignant",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return null;
    }
  };

  // ✅ Récupérer la liste des cours
  const fetchCoursesfunction = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/courses/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return data; // Retourne la liste des cours
      } else {
        throw new Error("Erreur lors de la récupération des cours");
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: "Impossible de récupérer les cours",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return [];
    }
  };

  // ✅ Récupérer la liste des étudiants
  const fetchStudentsfunction = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/students/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return data; // Retourne la liste des étudiants
      } else {
        throw new Error("Erreur lors de la récupération des étudiants");
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: "Impossible de récupérer les étudiants",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return [];
    }
  };

    // ✅ Récupérer un étudiant spécifique
    const fetchStudentById = async (studentId) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
          },
        });

        if (response.status === 200) {  
          const data = await response.json();
          return data; // Retourne l'étudiant spécifique
        } else {
          throw new Error("Erreur lors de la récupération de l'étudiant");
        }
      } catch (error) {
        console.error("Erreur:", error);
        swal.fire({
          title: "Erreur",
          text: error.message || "Impossible de récupérer l'étudiant",
          icon: "error",
        }); 
        return null;
      }
    };

  // ✅ Mettre à jour un cours
  const updateCourse = async (courseId, courseData) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
            "X-CSRFToken": getCsrfToken(),
          },
          body: JSON.stringify(courseData),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        swal.fire({
          title: "Cours mis à jour avec succès",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return data; // Retourne le cours mis à jour
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la mise à jour du cours"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: error.message || "Impossible de mettre à jour le cours",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return null;
    }
  };

  // ✅ Mettre à jour un étudiant
  const updateStudent = async (studentId, studentData) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/${studentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
            "X-CSRFToken": getCsrfToken(),
          },
          body: JSON.stringify({ ...studentData, role: "etudiant" }), // Force le rôle à "etudiant"
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        swal.fire({
          title: "Étudiant mis à jour avec succès",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return data; // Retourne l'étudiant mis à jour
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la mise à jour de l'étudiant"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: error.message || "Impossible de mettre à jour l'étudiant",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return null;
    }
  };

  // ✅ Supprimer un étudiant
  const deleteStudent = async (studentId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/${studentId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );

      if (response.status === 204) {
        // 204 No Content est typique pour DELETE réussi
        swal.fire({
          title: "Étudiant supprimé avec succès",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return true; // Indique que la suppression a réussi
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la suppression de l'étudiant"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: error.message || "Impossible de supprimer l'étudiant",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return false;
    }
  };

  // ✅ Supprimer un enseignant
  const deleteTeacher = async (teacherId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/teachers/${teacherId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );

      if (response.status === 204) {
        swal.fire({
          title: "Enseignant supprimé avec succès",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la suppression de l'enseignant"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: error.message || "Impossible de supprimer l'enseignant",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return false;
    }
  };

  // ✅ Supprimer un cours
  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );

      if (response.status === 204) {
        swal.fire({
          title: "Cours supprimé avec succès",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la suppression du cours"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      swal.fire({
        title: "Erreur",
        text: error.message || "Impossible de supprimer le cours",
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return false;
    }
  };
// ✅ Récupérer les étudiants inscrits à un cours spécifique
const fetchStudentsByCourse = async (courseId) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/inscriptions/?cours=${courseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`, // Ajout du token JWT
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      // Extraire les étudiants des inscriptions
      const students = data.map(inscription => inscription.etudiant);
      return students; // Retourne la liste des étudiants inscrits
    } else {
      throw new Error("Erreur lors de la récupération des étudiants");
    }
  } catch (error) {
    console.error("Erreur:", error);
    swal.fire({
      title: "Erreur",
      text: "Impossible de récupérer les étudiants inscrits",
      icon: "error",
      toast: true,
      timer: 4000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return [];
  }
};

// ajouter les notes
const addNote = async (noteData) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/notes/", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify(noteData),
    });

    if (response.status === 201) {
      const data = await response.json();
      swal.fire({
        title: "Note ajoutée avec succès",
        icon: "success",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erreur lors de l'ajout de la note");
    }
  } catch (error) {
    console.error("Erreur:", error);
    swal.fire({
      title: "Erreur",
      text: error.message || "Impossible d'ajouter la note",
      icon: "error",
      toast: true,
      timer: 4000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return null;
  }
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
    fetchTeachersfunction,
    fetchTeacherCourses,
    addCourse,
    addStudent,
    addTeacher,
    fetchCoursesfunction,
    fetchStudentsfunction,
    updateCourse,
    updateStudent,
    deleteStudent,
    deleteTeacher,
    deleteCourse,
    fetchStudentsByCourse,
    fetchStudentById,
    addNote,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
