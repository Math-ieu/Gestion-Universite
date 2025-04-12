export type TeacherRole = 'Vacataire' | 'ATER' | 'MdC' | 'Professeur';
export type CourseType = 'CM' | 'TP' | 'TD' 
;
export type SemestreType = 'Semestre 1' | 'Semestre 2';
export type NiveauEtude = 'Licence 1' | 'Licence 2' | 'Licence 3' | 'Master 1' | 'Master 2';

export interface Teacher {
  id?: string;
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

export interface Student {
  id?: string;
  prenom: string;
  nom: string;
  anneeinscrit: string;
  email: string;
  datedenaissance: string;
  password: string;
  password2: string;
  filiere: string;
  anneeetude: string;
  role:string

}

export interface Course {
  id?: string;
  titre: string;
  description: string;
  volumehoraire: number;
  type_cours: string ;
  semestre: string;
  anneeetude: string;
  enseignant: number | null; // ID de l'enseignant
}


export interface ApiResponse<T> {
  data: T[];
  error?: string;
}