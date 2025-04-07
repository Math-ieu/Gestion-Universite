export interface Session {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  duration: number;
  description: string;
  room: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  examType: string;
  grade: number;
  comment: string;
  date: string;
}

export interface Exercise {
  id: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  content: string;
  grade?: number;
  feedback?: string;
  submittedAt: string;
}

export interface Question {
  id: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  content: string;
  status: 'pending' | 'answered';
  createdAt: string;
  answer?: string;
}

export interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
}