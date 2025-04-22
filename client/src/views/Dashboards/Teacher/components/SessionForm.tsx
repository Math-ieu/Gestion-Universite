import { useState } from 'react';
import { BookOpen, FileText, Clock, MapPin } from 'lucide-react';
import type { Session } from '../types';

interface SessionFormProps {
  onSubmit: (session: Omit<Session, 'id'>) => void;
}

export function SessionForm({ onSubmit }: SessionFormProps) {
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    date: '',
    duration: '',
    description: '',
    room: '', 
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Le nom du cours est requis';
    }
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }
    if (!formData.duration) {
      newErrors.duration = 'La durée est requise';
    }
    if (!formData.room.trim()) {
      newErrors.room = 'La salle est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      duration: Number(formData.duration),
    });

    setFormData({
      courseId: '',
      courseName: '',
      date: '',
      duration: '',
      description: '',
      room: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom du cours
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            value={formData.courseName}
            onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.courseName && (
          <p className="mt-1 text-sm text-red-600">{errors.courseName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="relative mt-1">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            rows={3}
          />
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="relative mt-1">
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Durée (heures)
          </label>
          <div className="relative mt-1">
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              min="1"
              step="0.5"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Salle
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.room && (
          <p className="mt-1 text-sm text-red-600">{errors.room}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Créer la séance
      </button>
    </form>
  );
}