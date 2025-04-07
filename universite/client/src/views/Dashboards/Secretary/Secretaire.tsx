import React, { useState, useEffect } from "react";
import { TeacherForm } from "./components/TeacherForm";
import { CourseForm } from "./components/CourseForm";
import { SemesterCourseForm } from "./components/SemesterCourseForm";
import { StudentForm } from "./components/StudentForm";
import { DataTable } from "./components/DataTable";
import { Teacher, Course, SemesterCourse, Student } from "./types";
import { GraduationCap, BookOpen, Calendar, Users } from "lucide-react";
import { Layout } from "../../components/Layout";

type Tab = "teachers" | "courses" | "semester-courses" | "students";
 
function Secretaire() {
  const [activeTab, setActiveTab] = useState<Tab>("teachers");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    // Fetch initial data
    fetchTeachers(); 
    fetchStudents();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/teachers");
      const data = await response.json();
      setTeachers(data.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      setStudents(data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleTeacherSubmit = async (teacher: Teacher) => {
    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacher),
      });
      if (!response.ok)
        throw new Error("Erreur lors de la création de l'enseignant");
      fetchTeachers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCourseSubmit = async (course: Course) => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      if (!response.ok) throw new Error("Erreur lors de la création du cours");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSemesterCourseSubmit = async (semesterCourse: SemesterCourse) => {
    try {
      const response = await fetch("/api/semester-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(semesterCourse),
      });
      if (!response.ok)
        throw new Error("Erreur lors de l'association du cours");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStudentSubmit = async (student: Student) => {
    try {
      const method = editingStudent ? "PUT" : "POST";
      const url = editingStudent
        ? `/api/students/${editingStudent.id}`
        : "/api/students";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la gestion de l'étudiant");

      fetchStudents();
      setEditingStudent(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!student.id) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      try {
        const response = await fetch(`/api/students/${student.id}`, {
          method: "DELETE",
        });

        if (!response.ok)
          throw new Error("Erreur lors de la suppression de l'étudiant");

        fetchStudents();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!teacher.id) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) {
      try {
        const response = await fetch(`/api/teachers/${teacher.id}`, {
          method: "DELETE",
        });

        if (!response.ok)
          throw new Error("Erreur lors de la suppression de l'enseignant");

        fetchTeachers();
      } catch (error) {
        console.error("Error:", error);
      }
    }
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
                  className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
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
                  className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
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
                  onClick={() => setActiveTab("semester-courses")}
                  className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "semester-courses"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Calendar className="w-5 h-5 mx-auto mb-1" />
                  Cours Semestriels
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
                      { key: "firstName", header: "Prénom" },
                      { key: "lastName", header: "Nom" },
                      { key: "phone", header: "Téléphone" },
                      { key: "role", header: "Fonction" },
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
                      { key: "firstName", header: "Prénom" },
                      { key: "lastName", header: "Nom" },
                      { key: "studentNumber", header: "N° Étudiant" },
                      { key: "email", header: "Email" },
                      { key: "dateOfBirth", header: "Date de naissance" },
                    ]}
                    onEdit={setEditingStudent}
                    onDelete={handleDeleteStudent}
                  />
                </div>
              )}

              {activeTab === "courses" && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                   Gestion des cours
                  </h2>
                  <CourseForm onSubmit={handleCourseSubmit} />
                </div>
              )}

              {activeTab === "semester-courses" && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Associer un cours à un semestre
                  </h2>
                  <SemesterCourseForm onSubmit={handleSemesterCourseSubmit} />
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
