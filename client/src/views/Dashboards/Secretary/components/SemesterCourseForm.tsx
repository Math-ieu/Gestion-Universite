import React, { useState, useEffect } from 'react';
import { Teacher, Course, SemesterCourse } from '../types';

import { User2, BookOpen, CalendarDays, CalendarCheck } from 'lucide-react';

interface SemesterCourseFormProps {
  onSubmit: (semesterCourse: SemesterCourse) => void;
}

export function SemesterCourseForm({ onSubmit }: SemesterCourseFormProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<SemesterCourse>({
    teacherId: '',
    courseId: '',
    semester: 1,
    year: new Date().getFullYear(),
  });
  const [errors, setErrors] = useState<Partial<SemesterCourse>>({});

  useEffect(() => {
    // Fetch teachers and courses from API
    fetch('/api/teachers')
      .then(res => res.json())
      .then(data => setTeachers(data.data));
    
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data.data));
  }, []);

  const validate = () => {
    const newErrors: Partial<SemesterCourse> = {};
    if (!formData.teacherId) newErrors.teacherId = 'L\'enseignant est requis';
    if (!formData.courseId) newErrors.courseId = 'Le cours est requis';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({
        teacherId: '',
        courseId: '',
        semester: 1,
        year: new Date().getFullYear(),
      });
    } else {
      setErrors(newErrors);
    }
  };
return (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Enseignant</label>
      <div className="relative mt-1">
        <select
          value={formData.teacherId}
          onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
          className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">Sélectionner un enseignant</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.firstName} {teacher.lastName} ({teacher.role})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User2 className="h-5 w-5 text-gray-400" />
        </div>
        {errors.teacherId && <p className="mt-1 text-sm text-red-600">{errors.teacherId}</p>}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Cours</label>
      <div className="relative mt-1">
        <select
          value={formData.courseId}
          onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
          className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">Sélectionner un cours</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title} ({course.type}, {course.hours}h)
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <BookOpen className="h-5 w-5 text-gray-400" />
        </div>
        {errors.courseId && <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Semestre</label>
      <div className="relative mt-1">
        <select
          value={formData.semester}
          onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) as 1 | 2 })}
          className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value={1}>Semestre 1</option>
          <option value={2}>Semestre 2</option>
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarDays className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Année</label>
      <div className="relative mt-1">
        <input
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          min={new Date().getFullYear()}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarCheck className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Associer le cours au semestre
    </button>
  </form>
);

}