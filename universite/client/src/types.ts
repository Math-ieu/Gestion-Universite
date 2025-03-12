export type UserRole = 'student' | 'teacher' | 'secretary';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
}

export interface SemesterCourse extends Course {
  teacherId: string;
  semester: string;
  schedule: string;
}

export interface Exercise {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  exerciseId?: string;
  score: number;
  feedback?: string;
}