import { useState } from 'react';
import { UserCircle, Hash, GraduationCap, Pencil, MessageSquare } from 'lucide-react';
import type { Grade } from '../types';

interface GradeFormProps {
  onSubmit: (grade: Omit<Grade, 'id' | 'date'>) => void;
}

const examTypes = ['Partiel', 'Final', 'TP', 'Projet'];

export function GradeForm({ onSubmit }: GradeFormProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    examType: '',
    grade: '',
    comment: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Le nom de l\'étudiant est requis';
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Le numéro étudiant est requis';
    }
    if (!formData.examType) {
      newErrors.examType = 'Le type d\'examen est requis';
    }
    if (!formData.grade) {
      newErrors.grade = 'La note est requise';
    } else {
      const gradeNum = Number(formData.grade);
      if (gradeNum < 0 || gradeNum > 20) {
        newErrors.grade = 'La note doit être comprise entre 0 et 20';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      grade: Number(formData.grade),
    });

    setFormData({
      studentId: '',
      studentName: '',
      examType: '',
      grade: '',
      comment: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom de l'étudiant
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserCircle className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.studentName && (
          <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Numéro étudiant
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.studentId && (
          <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Type d'examen
        </label>
        <div className="relative mt-1">
          <select
            value={formData.examType}
            onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Sélectionner un type</option>
            {examTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GraduationCap className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.examType && (
          <p className="mt-1 text-sm text-red-600">{errors.examType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Note
        </label>
        <div className="relative mt-1">
          <input
            type="number"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            min="0"
            max="20"
            step="0.5"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Pencil className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.grade && (
          <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Commentaire
        </label>
        <div className="relative mt-1">
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            rows={3}
          />
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Enregistrer la note
      </button>
    </form>
  );
}