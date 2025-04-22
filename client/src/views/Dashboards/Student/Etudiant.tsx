import { useState, useEffect, useContext } from "react";
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { CourseList } from "./components/CourseList";
import { ExerciseSubmission } from "./components/ExerciseSubmission";
import { GradesList } from "./components/GradesList";
import { QuestionForm } from "./components/QuestionForm";
import type { Course, Grade, StudentSubmission } from "./types";
import { Layout } from "../../components/Layout";
import AuthContext from "../../../context/AuthContext";

function Etudiant() {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades] = useState<Grade[]>([]); // À adapter si tu veux fetcher les notes
  const [loading, setLoading] = useState(false);
  const { user, authTokens, fetchCoursesfunction } = useContext(AuthContext);
  const studentId = user?.id;

  // Fetcher les cours et les inscriptions au chargement
  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      if (!studentId || !authTokens) return;
      setLoading(true);
      try {
        // Fetch tous les cours
        const coursesData = await fetchCoursesfunction();
        console.log(coursesData);
        // Fetch les inscriptions de l'étudiant
        const enrollmentsResponse = await fetch(
          `http://127.0.0.1:8000/api/inscriptions/?etudiant=${studentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        if (!enrollmentsResponse.ok)
          throw new Error("Erreur lors du chargement des inscriptions");
        const enrollmentsData = await enrollmentsResponse.json();

        // Marquer les cours comme inscrits
        const enrolledCourseIds = enrollmentsData.map(
          (enrollment: any) => enrollment.cours.id
        );
        const updatedCourses = coursesData.map((course: Course) => ({
          ...course,
          enrolled: enrolledCourseIds.includes(course.id),
        }));

        setCourses(updatedCourses);
      } catch (error) {
        console.error("Erreur:", error);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de charger les cours ou les inscriptions",
          icon: "error",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndEnrollments();
  }, [studentId, authTokens]);

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/inscriptions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: JSON.stringify({
          etudiant_id: studentId,
          cours_id: Number(courseId),
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription");

      setCourses(
        courses.map((course) =>
          course.id === Number(courseId) ? { ...course, enrolled: true } : course
        )
      );
    } catch (error) {
      console.error("Erreur:", error);
      throw error; // Propagé pour affichage dans CourseList
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      // Trouver l'inscription correspondante
      const enrollmentResponse = await fetch(
        `http://127.0.0.1:8000/api/inscriptions/?etudiant=${studentId}&cours=${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      if (!enrollmentResponse.ok)
        throw new Error("Erreur lors de la récupération de l'inscription");
      const enrollmentData = await enrollmentResponse.json();
      if (enrollmentData.length === 0)
        throw new Error("Aucune inscription trouvée");

      const enrollmentId = enrollmentData[0].id;

      // Supprimer l'inscription
      const deleteResponse = await fetch(
        `http://127.0.0.1:8000/api/inscriptions/${enrollmentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      if (!deleteResponse.ok)
        throw new Error("Erreur lors de la désinscription");

      setCourses(
        courses.map((course) =>
          course.id === Number(courseId) ? { ...course, enrolled: false } : course
        )
      );
    } catch (error) {
      console.error("Erreur:", error);
      throw error; // Propagé pour affichage dans CourseList
    }
  };

  const handleExerciseSubmit = async (submission: StudentSubmission) => {
    try {
      const formData = new FormData();
      formData.append("file", submission.file);
      formData.append("exercice_id", submission.courseId); // Ajusté pour ton API
      if (submission.comment) {
        formData.append("comment", submission.comment);
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/soumissions-exercices/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Erreur lors de l'envoi de l'exercice");

      Swal.fire({
        title: "Succès",
        text: "Exercice soumis avec succès",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erreur:", error);
      Swal.fire({
        title: "Erreur",
        text: "Erreur lors de l'envoi de l'exercice",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const handleQuestionSubmit = async (
    courseId: string,
    sessionId: string,
    content: string
  ) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: JSON.stringify({
          etudiant_id: studentId,
          seance_id: sessionId,
          contenu: content,
        }),
      });

      if (!response.ok)
        throw new Error("Erreur lors de l'envoi de la question");

      Swal.fire({
        title: "Succès",
        text: "Question envoyée avec succès",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erreur:", error);
      Swal.fire({
        title: "Erreur",
        text: "Erreur lors de l'envoi de la question",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Layout>
      <div className="justify-center items-center flex flex-col">
        <h1 className="text-3xl font-bold">Tableau de bord étudiant</h1>
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("courses")}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "courses"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mx-auto mb-1" />
                    Cours
                  </button>
                  <button
                    onClick={() => setActiveTab("exercises")}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "exercises"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <ClipboardList className="w-5 h-5 mx-auto mb-1" />
                    Exercices
                  </button>
                  <button
                    onClick={() => setActiveTab("grades")}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "grades"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 mx-auto mb-1" />
                    Notes
                  </button>
                  <button
                    onClick={() => setActiveTab("questions")}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "questions"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 mx-auto mb-1" />
                    Questions
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "courses" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Catalogue des cours
                    </h2>
                    {loading ? (
                      <p className="text-gray-500">Chargement des cours...</p>
                    ) : (
                      <CourseList
                        courses={courses}
                        onEnroll={handleEnroll}
                        onUnenroll={handleUnenroll}
                      />
                    )}
                  </div>
                )}

                {activeTab === "exercises" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Soumettre un exercice
                    </h2>
                    <ExerciseSubmission
                      courses={courses.filter((course) => course.enrolled)}
                      onSubmit={handleExerciseSubmit}
                    />
                  </div>
                )}

                {activeTab === "grades" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Mes notes
                    </h2>
                    <GradesList grades={grades} />
                  </div>
                )}

                {activeTab === "questions" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Poser une question
                    </h2>
                    <QuestionForm
                      courses={courses.filter((course) => course.enrolled)}
                      onSubmit={handleQuestionSubmit}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Etudiant;
