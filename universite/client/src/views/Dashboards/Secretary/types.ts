export type TeacherRole = 'Vacataire' | 'ATER' | 'MdC' | 'Professeur';
export type CourseType = 'CM' | 'TP' | 'TD';

export interface Teacher {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: TeacherRole;
}

export interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  dateOfBirth: string;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  hours: number;
  type: CourseType;
}

export interface SemesterCourse {
  id?: string;
  teacherId: string;
  courseId: string;
  semester: 1 | 2;
  year: number;
}

export interface ApiResponse<T> {
  data: T[];
  error?: string;
}