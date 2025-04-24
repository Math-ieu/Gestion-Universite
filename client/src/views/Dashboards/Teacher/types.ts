export interface Session {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  duration: number;
  description: string;
  room: string;
}
 
export interface Note {
  cours: number;
  id?: number;
  etudiant: number;
  type_examen: string;
  note: number;
  explication: string;
  nomEtudiant: string;
}

export interface NoteSubmit {
  cours_id: number;
  etudiant_id: number;
  type_examen: string;
  note: number;
  explication: string;
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
  status: "pending" | "answered";
  createdAt: string;
  answer?: string;
}
 
export interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface Student {
  id?: number;
  prenom: string;
  nom: string;
  anneeinscrit: string;
  email: string;
  datedenaissance: string;
  password: string;
  password2: string;
  filiere: string;
  anneeetude: string;
  role: string;
}

export interface Cours {
  id?: number;
  titre: string;
  description: string;
  volumehoraire: number;
  type_cours: string;
  semestre: string;
  anneeetude: string;
  enseignant: number | null; // ID de l'enseignant
}


