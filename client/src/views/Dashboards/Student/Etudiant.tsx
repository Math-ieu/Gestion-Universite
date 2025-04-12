import { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  MessageCircle,
} from 'lucide-react';

import { CourseList } from './components/CourseList';
import { ExerciseSubmission } from './components/ExerciseSubmission';
import { GradesList } from './components/GradesList';
import { QuestionForm } from './components/QuestionForm';
import type { Course, Grade, StudentSubmission, Session } from './types';
import { Layout } from "../../components/Layout";

// Données de test
const mockSessions: Session[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Introduction à la programmation',
    date: '2024-03-20T09:00:00',
    duration: 2,
    description: 'Introduction aux concepts de base',
    room: 'A101',
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'Algèbre linéaire',
    date: '2024-03-21T14:00:00',
    duration: 2,
    description: 'Espaces vectoriels',
    room: 'B202',
  },
];

const mockCourses: Course[] = [
  {
    id: '1',
    code: 'INFO101',
    name: 'Introduction à la programmation',
    description: 'Fondamentaux de la programmation en Python',
    teacher: 'Dr. Martin',
    schedule: 'Lundi 9h-11h',
    enrolled: false,
    sessions: mockSessions.filter(s => s.courseId === '1'),
  },
  {
    id: '2',
    code: 'MATH201',
    name: 'Algèbre linéaire',
    description: 'Étude des espaces vectoriels et des transformations linéaires',
    teacher: 'Dr. Bernard',
    schedule: 'Mardi 14h-16h',
    enrolled: true,
    sessions: mockSessions.filter(s => s.courseId === '2'),
  },
];

const mockGrades: Grade[] = [
  {
    id: '1',
    courseId: '2',
    courseName: 'Algèbre linéaire',
    examType: 'Partiel',
    grade: 15,
    feedback: 'Excellent travail sur les matrices',
    date: '2024-02-15',
  },
];

function Etudiant() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState(mockCourses);
  const [grades] = useState(mockGrades);

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch(`/api/student/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription");

      setCourses(courses.map(course =>
        course.id === courseId
          ? { ...course, enrolled: true }
          : course
      ));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleExerciseSubmit = async (submission: StudentSubmission) => {
    try {
      const formData = new FormData();
      formData.append('file', submission.file);
      formData.append('courseId', submission.courseId);
      formData.append('sessionId', submission.sessionId);
      if (submission.comment) {
        formData.append('comment', submission.comment);
      }

      const response = await fetch('/api/student/exercises', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi de l'exercice");
      
      // Gérer le succès...
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleQuestionSubmit = async (courseId: string, sessionId: string, content: string) => {
    try {
      const response = await fetch('/api/student/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, sessionId, content }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi de la question');
      
      // Gérer le succès...
    } catch (error) {
      console.error('Erreur:', error);
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
                {activeTab === 'courses' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Catalogue des cours
                    </h2>
                    <CourseList courses={courses} onEnroll={handleEnroll} />
                  </div>
                )}
    
                {activeTab === 'exercises' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Soumettre un exercice
                    </h2>
                    <ExerciseSubmission
                      courses={courses}
                      onSubmit={handleExerciseSubmit}
                    />
                  </div>
                )}
    
                {activeTab === 'grades' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Mes notes
                    </h2>
                    <GradesList grades={grades} />
                  </div>
                )}
    
                {activeTab === 'questions' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Poser une question
                    </h2>
                    <QuestionForm
                      courses={courses}
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