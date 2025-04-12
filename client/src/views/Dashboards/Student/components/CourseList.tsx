import { BookOpen, Clock, User } from 'lucide-react';
import type { Course } from '../types';

interface CourseListProps {
  courses: Course[];
  onEnroll: (courseId: string) => void;
}

export function CourseList({ courses, onEnroll }: CourseListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {courses.map((course) => (
        <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
              <p className="text-sm text-gray-500">{course.code}</p>
            </div>
            <button
              onClick={() => onEnroll(course.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                course.enrolled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={course.enrolled}
            >
              {course.enrolled ? 'Inscrit' : "S'inscrire"}
            </button>
          </div>

          <p className="mt-2 text-gray-600">{course.description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-2" />
              <span>{course.teacher}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>{course.schedule}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}