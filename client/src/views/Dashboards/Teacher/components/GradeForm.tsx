import { useState, useEffect, useContext } from "react";
import {
  GraduationCap,
  Pencil,
  MessageSquare,
  BookOpen,
  Users,
} from "lucide-react";
import type { Cours, Student, NoteSubmit } from "../types";
import AuthContext from "../../../../context/AuthContext";

interface GradeFormProps {
  onSubmit: (note: Omit<NoteSubmit, "id" | "date">) => void;
}

const examTypes = ["Partiel", "Final", "TP", "Projet"];

export function GradeForm({ onSubmit }: GradeFormProps) {
  const [cours, setCours] = useState<Cours[]>([]);
  const [etudiants, setEtudiants] = useState<Student[]>([]);
  const [loading, setLoading] = useState({
    cours: false,
    etudiants: false,
  });

  const { user, fetchStudentsByCourse, fetchTeacherCourses, fetchStudentById } = useContext(AuthContext);
  const teacherId = user.id;

  const [formData, setFormData] = useState({
    cours: 0,
    etudiant: 0,
    nomEtudiant: "",
    type_examen: "",
    note: "",
    explication: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch cours when component mounts
  useEffect(() => {
    const fetchCours = async () => {
      setLoading((prev) => ({ ...prev, cours: true }));
      try {
        const data = await fetchTeacherCourses(teacherId);
        console.log("Fetched cours:", data);
        setCours(data);
        if (data.length === 0) {
          setErrors((prev) => ({ ...prev, cours: "Aucun cours disponible" }));
        }
      } catch (error) {
        console.error("Error fetching cours:", error);
        setErrors((prev) => ({ ...prev, cours: "Erreur lors du chargement des cours" }));
      } finally {
        setLoading((prev) => ({ ...prev, cours: false }));
      }
    };

    fetchCours();
  }, [fetchTeacherCourses, teacherId]);

  // Fetch etudiants when cours changes
  useEffect(() => {
    if (formData.cours === 0) {
      setEtudiants([]);
      setFormData((prev) => ({ ...prev, etudiant: 0, nomEtudiant: "" }));
      return;
    }

    const fetchEtudiants = async () => {
      setLoading((prev) => ({ ...prev, etudiants: true }));
      try {
        // Étape 1 : Récupérer les IDs des étudiants inscrits au cours
        const studentIds = await fetchStudentsByCourse(formData.cours);
        
        // Étape 2 : Récupérer les détails de chaque étudiant via fetchStudentById
        const studentPromises = studentIds.map(async (studentId: number) => {
          try {
            const studentData = await fetchStudentById(studentId);
            return studentData;
          } catch (error) {
            console.error(`Error fetching student ${studentId}:`, error);
            return null; // Retourner null pour les étudiants qui échouent
          }
        });

        // Étape 3 : Attendre que toutes les requêtes soient terminées
        const studentsData = await Promise.all(studentPromises);
        
        // Filtrer les résultats pour enlever les null (étudiants non trouvés)
        const validStudents = studentsData.filter((student): student is Student => student !== null);
       
        // Étape 4 : Mettre à jour le state avec les détails des étudiants
        setEtudiants(validStudents);
        
        if (validStudents.length === 0) {
          setErrors((prev) => ({ ...prev, etudiant: "Aucun étudiant inscrit à ce cours" }));
        } else {
          setErrors((prev) => ({ ...prev, etudiant: "" }));
        }
      } catch (error) {
        console.error("Error fetching etudiants:", error);
        setErrors((prev) => ({ ...prev, etudiant: "Erreur lors du chargement des étudiants" }));
      } finally {
        setLoading((prev) => ({ ...prev, etudiants: false }));
      }
    };

    fetchEtudiants();
  }, [formData.cours, fetchStudentsByCourse, fetchStudentById]);

  // Handle cours selection
  const handleCoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coursId = Number(e.target.value);
    setFormData({
      ...formData,
      cours: coursId,
      etudiant: 0,
      nomEtudiant: "",
    });
  };

  // Handle etudiant selection
  const handleEtudiantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const etudiantId = Number(e.target.value);
    const selectedEtudiant = etudiants.find((etudiant) => etudiant.id === etudiantId);
    setFormData({
      ...formData,
      etudiant: etudiantId,
      nomEtudiant: selectedEtudiant ? `${selectedEtudiant.nom} ${selectedEtudiant.prenom}` : "",
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.cours === 0) {
      newErrors.cours = "Le cours est requis";
    }
    if (formData.etudiant === 0) {
      newErrors.etudiant = "L'étudiant est requis";
    }
    if (!formData.type_examen) {
      newErrors.type_examen = "Le type d'examen est requis";
    }
    if (!formData.note) {
      newErrors.note = "La note est requise";
    } else {
      const noteNum = Number(formData.note);
      if (noteNum < 0 || noteNum > 20) {
        newErrors.note = "La note doit être comprise entre 0 et 20";
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      cours_id: formData.cours,
      etudiant_id: formData.etudiant,
      type_examen: formData.type_examen,
      note: Number(formData.note),
      explication: formData.explication,
    });

    setFormData({ 
      ...formData,
      etudiant: 0,
      nomEtudiant: "",
      type_examen: "",
      note: "",
      explication: "",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cours */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Cours</label>
        <div className="relative mt-1">
          <select
            value={formData.cours}
            onChange={handleCoursChange}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            disabled={loading.cours}
          >
            <option value="0">Sélectionner un cours</option>
            {cours.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titre}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {loading.cours && (
          <p className="mt-1 text-sm text-gray-500">Chargement des cours...</p>
        )}
        {errors.cours && (
          <p className="mt-1 text-sm text-red-600">{errors.cours}</p>
        )}
      </div>

      {/* Étudiant */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Étudiant</label>
        <div className="relative mt-1">
          <select
            value={formData.etudiant}
            onChange={handleEtudiantChange}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            disabled={formData.cours === 0 || loading.etudiants || etudiants.length === 0}
          >
            <option value="0">Sélectionner un étudiant</option>
            {etudiants.map((etudiant) => (
              <option key={etudiant.id} value={etudiant.id}>
                {etudiant.nom} {etudiant.prenom}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {loading.etudiants && (
          <p className="mt-1 text-sm text-gray-500">Chargement des étudiants...</p>
        )}
        {errors.etudiant && (
          <p className="mt-1 text-sm text-red-600">{errors.etudiant}</p>
        )}
      </div>

      {/* Type d'examen */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Type d'examen</label>
        <div className="relative mt-1">
          <select
            value={formData.type_examen}
            onChange={(e) => setFormData({ ...formData, type_examen: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Sélectionner un type</option>
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GraduationCap className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.type_examen && (
          <p className="mt-1 text-sm text-red-600">{errors.type_examen}</p>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <div className="relative mt-1">
          <input
            type="number"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            min="0"
            max="20"
            step="0.5"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Pencil className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.note && (
          <p className="mt-1 text-sm text-red-600">{errors.note}</p>
        )}
      </div>

      {/* Explication */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Explication</label>
        <div className="relative mt-1">
          <textarea
            value={formData.explication}
            onChange={(e) => setFormData({ ...formData, explication: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            rows={3}
          />
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Enregistrer la note
      </button>
    </form>
  );
}