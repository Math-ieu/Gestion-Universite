export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  teacher: string;
  schedule: string;
  enrolled: boolean;
  sessions?: Session[];
}

export interface Session {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  duration: number;
  description: string;
  room: string;
}

export interface Exercise {
  id: string;
  sessionId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  submitted: boolean;
  submissionDate?: string;
  grade?: number;
  feedback?: string;
}

export interface Question {
  id: string;
  sessionId: string;
  courseName: string;
  content: string;
  status: 'pending' | 'answered';
  createdAt: string;
  answer?: string;
}

export interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  examType: string;
  grade: number;
  feedback?: string;
  date: string;
}

export interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface StudentSubmission {
  courseId: string;
  sessionId: string;
  file: File;
  comment?: string;
}