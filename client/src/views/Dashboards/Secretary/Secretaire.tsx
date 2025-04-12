import React, { useState, useEffect, useContext } from "react";
import { TeacherForm } from "./components/TeacherForm";
import { CourseForm } from "./components/CourseForm";
import { StudentForm } from "./components/StudentForm";
import { DataTable } from "./components/DataTable";
import { Teacher, Course, Student } from "./types";
import { GraduationCap, BookOpen, Users } from "lucide-react";
import { Layout } from "../../components/Layout";

import AuthContext from "../../../context/AuthContext";

type Tab = "teachers" | "courses" | "students";

function Secretaire() {
  const [activeTab, setActiveTab] = useState<Tab>("teachers");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { fetchTeachersfunction, fetchCoursesfunction, fetchStudentsfunction, addTeacher, addStudent, addCourse, updateCourse, updateStudent, deleteStudent,
    deleteTeacher,
    deleteCourse,} =
    useContext(AuthContext);

  useEffect(() => {
    // Fetch initial data
    fetchTeachers();
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await fetchTeachersfunction();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await fetchCoursesfunction();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      // Fetch students from API
      const data = await fetchStudentsfunction();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleTeacherSubmit = async (teacher: Teacher) => {
    addTeacher(teacher);
  };

  const handleCourseSubmit = async (course : Course) => {
    try {
      let result;
      if (editingCourse) {
        // Mise à jour d'un cours existant
        result = await updateCourse(editingCourse.id, course);
      } else {
        // Ajout d'un nouveau cours
        result = await addCourse(course);
      }

      if (result) {
        await fetchCourses(); // Rafraîchit la liste des cours
        setEditingCourse(null); // Réinitialise l'état d'édition
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleStudentSubmit = async (student : Student) => {
    try {
      console.log("Soumission de l'étudiant:", student);
      let result;
      if (editingStudent) {
        // Mise à jour d'un étudiant existant
        result = await updateStudent(editingStudent.id, student);
      } else {
        // Ajout d'un nouvel étudiant
        result = await addStudent(student);
      }

      if (result) {
        await fetchStudents(); // Rafraîchit la liste des étudiants
        setEditingStudent(null); // Réinitialise l'état d'édition
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDeleteStudent = async (student) => {
    if (!student.id) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      try {
        const success = await deleteStudent(student.id);
        if (success) {
          await fetchStudents(); // Rafraîchit la liste des étudiants
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const handleDeleteTeacher = async (teacher) => {
    if (!teacher.id) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) {
      try {
        const success = await deleteTeacher(teacher.id);
        if (success) {
          await fetchTeachers(); // Rafraîchit la liste des enseignants
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!course.id) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      try {
        const success = await deleteCourse(course.id);
        if (success) {
          await fetchCourses(); // Rafraîchit la liste des cours
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? `${teacher.prenom} ${teacher.nom}` : "Inconnu";
  };

  return (
    <Layout>
      <div className="justify-center items-center flex flex-col">
        <h1 className="text-3xl font-bold">Tableau de bord du secrétaire</h1>
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("teachers")}
                    className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "teachers"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 mx-auto mb-1" />
                    Enseignants
                  </button>
                  <button
                    onClick={() => setActiveTab("students")}
                    className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "students"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    Étudiants
                  </button>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "courses"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mx-auto mb-1" />
                    Cours
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "teachers" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Gestion des enseignants
                    </h2>
                    <TeacherForm onSubmit={handleTeacherSubmit} />
                    <DataTable<Teacher>
                      data={teachers}
                      columns={[
                        { key: "prenom", header: "Prénom" },
                        { key: "nom", header: "Nom" },
                        { key: "tel", header: "Téléphone" },
                        { key: "email", header: "Adresse Mail" },
                        { key: "fonction", header: "Fonction" },
                      ]}
                      onDelete={handleDeleteTeacher}
                    />
                  </div>
                )}

                {activeTab === "students" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Gestion des étudiants
                    </h2>
                    <StudentForm
                      onSubmit={handleStudentSubmit}
                      initialData={editingStudent || undefined}
                      isEditing={!!editingStudent}
                    />
                    <DataTable<Student>
                      data={students}
                      columns={[
                        { key: "prenom", header: "Prénom" },
                        { key: "nom", header: "Nom" },
                        { key: "anneeinscrit", header: "Année d'inscription" },
                        { key: "email", header: "Email" },
                        { key: "filiere", header: "Filière" },
                        { key: "anneeetude", header: "Année d'étude" },
                      ]}
                      onEdit={setEditingStudent}
                      onDelete={handleDeleteStudent}
                    />
                  </div>
                )}

                {activeTab === "courses" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Gestion des cours
                    </h2>
                    <CourseForm
                      onSubmit={handleCourseSubmit}
                      initialData={editingCourse || undefined}
                      isEditing={!!editingCourse}
                    />
                    <DataTable<Course>
                      data={courses}
                      columns={[
                        { key: "titre", header: "Titre" },
                        { key: "type_cours", header: "Type" },
                        { key: "volumehoraire", header: "Volume horaire" },
                        { key: "semestre", header: "Semestre" },
                        { key: "anneeetude", header: "Niveau d'étude" },
                        {
                          key: "enseignant",
                          header: "Enseignant",
                          render: (value) => getTeacherName(value as string),
                        },
                      ]}
                      onEdit={setEditingCourse}
                      onDelete={handleDeleteCourse}
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

export default Secretaire;
