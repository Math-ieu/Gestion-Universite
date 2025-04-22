import { useState } from "react";
import {
  Calendar as CalendarIcon,
  GraduationCap,
  ClipboardList,
  MessageCircle,
  Plus,
  BookOpen,
  PenLine,
  HelpCircle,
} from "lucide-react";

import { TabButton } from "./components/TabButton";
import { Calendar } from "./components/Calendar";
import { GradeForm } from "./components/GradeForm";
import { SessionForm } from "./components/SessionForm";
import type {
  Session,
  Exercise,
  Question,
  TabProps,
  NoteSubmit,
} from "./types";
import { Layout } from "../../components/Layout";
import { useContext } from "react";
import AuthContext from "../../../context/AuthContext";

const TABS: TabProps[] = [
  {
    id: "calendar",
    label: "Calendrier",
    icon: <CalendarIcon className="w-5 h-5" />,
  },
  { id: "grades", label: "Notes", icon: <GraduationCap className="w-5 h-5" /> },
  {
    id: "exercises",
    label: "Exercices",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    id: "questions",
    label: "Questions",
    icon: <MessageCircle className="w-5 h-5" />,
  },
];

// Données de test
const mockSessions: Session[] = [
  {
    id: "1",
    courseId: "CS101",
    courseName: "Introduction à la programmation",
    date: "2024-03-20T09:00:00",
    duration: 2,
    description: "Introduction aux concepts de base de la programmation",
    room: "A101",
  },
];

function Enseignant() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [showSessionForm, setShowSessionForm] = useState(false);

  const { addNote } = useContext(AuthContext);
  const handleGradeSubmit = async (grade: Omit<NoteSubmit, "id" | "date">) => {
    try {
      await addNote(grade);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error);
    }
  };

  const handleSessionSubmit = async (sessionData: Omit<Session, "id">) => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création de la séance");

      const newSession = await response.json();
      setSessions([...sessions, newSession]);
      setShowSessionForm(false);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <Layout>
      <div className="justify-center items-center flex flex-col">
        <h1 className="text-3xl font-bold">Tableau de bord de l'enseignant</h1>
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("calendar")}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "calendar"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5 mx-auto mb-1" />
                    Calendrier
                  </button>
                  <button
                    onClick={() => setActiveTab("grades")}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "grades"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mx-auto mb-1" />
                    Notes
                  </button>
                  <button
                    onClick={() => setActiveTab("exercises")}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "exercises"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <PenLine className="w-5 h-5 mx-auto mb-1" />
                    Exercices
                  </button>
                  <button
                    onClick={() => setActiveTab("questions")}
                    className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === "questions"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <HelpCircle className="w-5 h-5 mx-auto mb-1" />
                    Questions
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "calendar" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Calendrier des séances
                      </h2>
                      <button
                        onClick={() => setShowSessionForm(!showSessionForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Nouvelle séance</span>
                      </button>
                    </div>

                    {showSessionForm ? (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <SessionForm onSubmit={handleSessionSubmit} />
                      </div>
                    ) : (
                      <Calendar sessions={sessions} />
                    )}
                  </div>
                )}

                {activeTab === "grades" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Saisie des notes
                    </h2>
                    <GradeForm onSubmit={handleGradeSubmit} />
                  </div>
                )}

                {activeTab === "exercises" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Exercices à corriger
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Aucun exercice en attente de correction.
                    </p>
                  </div>
                )}

                {activeTab === "questions" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Questions des étudiants
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Aucune question en attente de réponse.
                    </p>
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

export default Enseignant;
