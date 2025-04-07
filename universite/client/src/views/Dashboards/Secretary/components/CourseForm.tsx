import React, { useState } from 'react';
import { Course, CourseType } from '../types';
import { BookOpen, FileText, Clock, Tag } from 'lucide-react';



interface CourseFormProps {
  onSubmit: (course: Course) => void;
}

const courseTypes: CourseType[] = ['CM', 'TP', 'TD'];

export function CourseForm({ onSubmit }: CourseFormProps) {
  const [formData, setFormData] = useState<Course>({
    title: '',
    description: '', 
    hours: 0,
    type: 'CM'
  });
  const [errors, setErrors] = useState<Partial<Course>>({});

  const validate = () => {
    const newErrors: Partial<Course> = {};
    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (formData.hours <= 0) newErrors.hours = 'Le nombre d\'heures doit être positif';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({ title: '', description: '', hours: 0, type: 'CM' });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <div className="relative mt-1">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
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
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Heures</label>
        <div className="relative mt-1">
          <input
            type="number"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            min="1"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.hours && <p className="mt-1 text-sm text-red-600">{errors.hours}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <div className="relative mt-1">
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Sélectionner un type</option>
            {courseTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Ajouter le cours
      </button>
    </form>
  );
}