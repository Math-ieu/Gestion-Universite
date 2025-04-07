import { useState } from 'react';
import { MessageSquare, BookOpen, Calendar } from 'lucide-react';
import type { Course, Session } from '../types';

interface QuestionFormProps {
  courses: Course[];
  onSubmit: (courseId: string, sessionId: string, content: string) => void;
}

export function QuestionForm({ courses, onSubmit }: QuestionFormProps) {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCourse = courses.find(course => course.id === selectedCourseId);
  const sessions = selectedCourse?.sessions || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedCourseId) {
      newErrors.course = 'Veuillez sélectionner un cours';
    }
    if (!selectedSessionId) {
      newErrors.session = 'Veuillez sélectionner une séance';
    }
    if (!content.trim()) {
      newErrors.content = 'La question ne peut pas être vide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(selectedCourseId, selectedSessionId, content);
    setContent('');
    setSelectedCourseId('');
    setSelectedSessionId('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cours
        </label>
        <div className="relative mt-1">
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedSessionId('');
            }}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Sélectionner un cours</option>
            {courses.filter(course => course.enrolled).map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.course && (
          <p className="mt-1 text-sm text-red-600">{errors.course}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Séance
        </label>
        <div className="relative mt-1">
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            disabled={!selectedCourseId}
          >
            <option value="">Sélectionner une séance</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {new Date(session.date).toLocaleDateString('fr-FR')} - {session.description}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.session && (
          <p className="mt-1 text-sm text-red-600">{errors.session}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Votre question
        </label>
        <div className="relative mt-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            rows={3}
            placeholder="Posez votre question ici..."
          />
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Poser la question
      </button>
    </form>
  );
}