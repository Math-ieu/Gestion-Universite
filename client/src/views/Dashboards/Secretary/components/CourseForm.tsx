import React, { useState, useEffect, useContext } from "react";
import {
  User2,
  BookOpen,
  FileText,
  Clock,
  Tag,
  CalendarDays,
  GraduationCap,
} from "lucide-react";


import AuthContext from "../../../../context/AuthContext";
// Types nécessaires
interface User {
  id: string;
  prenom: string;
  nom: string;
  role: string;
}

// Modifier l'interface Course pour que enseignant soit un nombre
interface Course {
  titre: string;
  description: string;
  volumehoraire: number;
  type_cours: string;
  semestre: string;
  anneeetude: string;
  enseignant_id: number | null; // Changé de string à number | null
}

interface CourseFormProps {
  onSubmit: (course: Course) => void | Promise<void>;
  isEditing?: boolean;
  initialData?: Course;
}

const courseTypes = ["CM", "TP", "TD"];
const semestreOptions = ["Semestre 1", "Semestre 2"];
const niveauOptions = [
  "Licence 1",
  "Licence 2",
  "Licence 3",
  "Master 1",
  "Master 2",
];

export function CourseForm({ onSubmit }: CourseFormProps) {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Course>({
    titre: "",
    description: "",
    volumehoraire: 0,
    type_cours: "CM",
    semestre: "Semestre 1",
    anneeetude: "Licence 1",
    enseignant_id: null, // Initialement null au lieu de chaîne vide
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Course, string>>>({});

  const { fetchTeachersfunction } = useContext(AuthContext);
  useEffect(() => {
    // Fetch teachers from API
    fetchTeachersfunction()
      .then((data) => setTeachers(data));
  }, []);

  const validate = () => {
    const newErrors: Partial<Record<keyof Course, string>> = {};
    if (!formData.titre) newErrors.titre = "Le titre est requis";
    if (!formData.description)
      newErrors.description = "La description est requise";
    if (formData.volumehoraire <= 0)
      newErrors.volumehoraire = "Le volume horaire doit être supérieur à 0";

    if (!formData.semestre) newErrors.semestre = "Le semestre est requis";
    if (!formData.anneeetude)
      newErrors.anneeetude = "Le niveau d'étude est requis";
    if (formData.enseignant_id === null) newErrors.enseignant_id = "L'enseignant est requis";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      // Log pour vérifier la valeur de l'enseignant envoyée
      console.log("Type de l'ID enseignant:", typeof formData.enseignant_id);
      
      setFormData({
        titre: "",
        description: "",
        volumehoraire: 0,
        type_cours: "CM",
        semestre: "Semestre 1",
        anneeetude: "Licence 1",
        enseignant_id: null,
      });
    } else {
      setErrors(newErrors);
    }
  };

  const handleEnseignantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeacherId = e.target.value;
    // Convertir en nombre ou null si vide
    const teacherIdAsNumber = selectedTeacherId ? parseInt(selectedTeacherId, 10) : null;
    
    setFormData({ ...formData, enseignant_id: teacherIdAsNumber });
    
    // Log pour débugger
    console.log("ID enseignant sélectionné:", teacherIdAsNumber);
    console.log("Type de l'ID:", typeof teacherIdAsNumber);
    
    // Trouver l'enseignant sélectionné pour afficher plus d'informations
    if (selectedTeacherId) {
      const selectedTeacher = teachers.find(teacher => teacher.id === selectedTeacherId);
      if (selectedTeacher) {
        console.log("Enseignant sélectionné:", `${selectedTeacher.prenom} ${selectedTeacher.nom}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <div className="relative mt-1">
          <input
            type="text"
            value={formData.titre}
            onChange={(e) =>
              setFormData({ ...formData, titre: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.titre && (
          <p className="mt-1 text-sm text-red-600">{errors.titre}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="relative mt-1">
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            rows={3}
          />
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Volume Horaire
        </label>
        <div className="relative mt-1">
          <input
            type="number"
            value={formData.volumehoraire}
            onChange={(e) =>
              setFormData({
                ...formData,
                volumehoraire: parseFloat(e.target.value) || 0,
              })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            min="0.5"
            step="0.5"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.volumehoraire && (
          <p className="mt-1 text-sm text-red-600">{errors.volumehoraire}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Type de Cours
        </label>
        <div className="relative mt-1">
          <select
            value={formData.type_cours}
            onChange={(e) =>
              setFormData({
                ...formData,
                type_cours: e.target.value as "CM" | "TP" | "TD",
              })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            {courseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Semestre
        </label>
        <div className="relative mt-1">
          <select
            value={formData.semestre}
            onChange={(e) =>
              setFormData({ ...formData, semestre: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            {semestreOptions.map((semestre) => (
              <option key={semestre} value={semestre}>
                {semestre}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarDays className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Niveau d'étude
        </label>
        <div className="relative mt-1">
          <select
            value={formData.anneeetude}
            onChange={(e) =>
              setFormData({ ...formData, anneeetude: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            {niveauOptions.map((niveau) => (
              <option key={niveau} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GraduationCap className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Enseignant
        </label>
        <div className="relative mt-1">
          <select
            value={formData.enseignant_id !== null ? formData.enseignant_id.toString() : ""}
            onChange={handleEnseignantChange}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Sélectionner un enseignant</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.prenom} {teacher.nom}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User2 className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.enseignant_id && (
          <p className="mt-1 text-sm text-red-600">{errors.enseignant_id}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Ajouter le cours
      </button>
    </form>
  );
}