
export type TeacherRole = 'Vacataire' | 'ATER' | 'MdC' | 'Professeur';
export interface Course {
  id: number; // ID du cours
  titre: string; // Titre du cours
  description: string; // Description du cours
  volumehoraire: number; // Volume horaire
  type_cours: string; // Type de cours
  semestre: string; // Semestre
  anneeetude: string; // Année d'étude
  enseignant: number; // ID de l'enseignant
  enrolled: boolean; // Calculé côté frontend
}
 
export interface Teacher {
  id?: number;
  prenom: string;
  nom: string;
  tel: string;
  fonction: TeacherRole;
  password: string;
  password2: string;
  datedenaissance: string;
  anneeinscrit: string;
  email: string;
  role:string
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
  id: number;
  courseId: number;
  courseName: string;
  examType: string;
  grade: number;
  feedback?: string;
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