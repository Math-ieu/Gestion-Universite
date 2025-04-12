import React, { useState } from "react";
import { Student } from "../types";
import {
  User,
  Mail,
  Calendar,
  Lock,
  GraduationCap,
  BookOpen,
  EyeOff,
  Eye,
} from "lucide-react";

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  initialData?: Student;
  isEditing?: boolean;
}

export function StudentForm({
  onSubmit,
  initialData,
  isEditing = false,
}: StudentFormProps) {
  const [formData, setFormData] = useState<Student>(
    initialData || {
      prenom: "",
      nom: "",
      anneeinscrit: "",
      email: "",
      datedenaissance: "",
      password: "",
      password2: "",
      filiere: "",
      anneeetude: "",
      role:"etudiant"
    }
  );
  const [errors, setErrors] = useState<Partial<Student>>({});

  const validate = () => {
    const newErrors: Partial<Student> = {};
    if (!formData.prenom) newErrors.prenom = "Le prénom est requis";
    if (!formData.nom) newErrors.nom = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.anneeinscrit) newErrors.anneeinscrit = "L'année d'inscription est requise";
    if (formData.anneeinscrit && !/^\d{4}$/.test(formData.anneeinscrit))
      newErrors.anneeinscrit = "L'année d'inscription doit être au format YYYY";
    if (
      formData.anneeinscrit &&
      (parseInt(formData.anneeinscrit) < 2000 ||
        parseInt(formData.anneeinscrit) > new Date().getFullYear()) // Correction ici
    )
      newErrors.anneeinscrit = "L'année d'inscription doit être entre 2000 et l'année actuelle";
    if (formData.anneeinscrit && formData.anneeinscrit.length !== 4)
      newErrors.anneeinscrit = "L'année d'inscription doit contenir 4 chiffres";
    if (formData.anneeinscrit && formData.anneeinscrit.length > 4)
      newErrors.anneeinscrit = "L'année d'inscription doit contenir 4 chiffres";
    if (formData.anneeinscrit && formData.anneeinscrit.length < 4)
      newErrors.anneeinscrit = "L'année d'inscription doit contenir 4 chiffres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.datedenaissance)
      newErrors.datedenaissance = "La date de naissance est requise";
    if (!formData.password && !isEditing)
      newErrors.password = "Le mot de passe est requis";
    if (formData.password && formData.password.length < 8)
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    if (!formData.filiere) newErrors.filiere = "La filière est requise";
    if (!formData.anneeetude) newErrors.anneeetude = "L'année d'étude est requise";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      if (!isEditing) {
        setFormData({
          prenom: "",
          nom: "",
          email: "",
          datedenaissance: "",
          password: "",
          password2: "",
          filiere: "",
          anneeetude: "",
          anneeinscrit:"",
          role:"etudiant"
        });
      }
    } else {
      setErrors(newErrors);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };
  const [showPassword, setShowPassword] = useState(false);


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
              className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {errors.prenom && (
            <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {errors.nom && (
            <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Année d'inscription
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            < Calendar size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.anneeinscrit}
            onChange={(e) => setFormData({ ...formData, anneeinscrit: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="2023"
          />
        </div>
        {errors.anneeinscrit && (
          <p className="mt-1 text-sm text-red-600">{errors.anneeinscrit}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={20} className="text-gray-400" />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="vous@exemple.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={20} className="text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
         Confirmer le mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={20} className="text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password2}
            onChange={(e) =>
              setFormData({ ...formData, password2: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={20} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.datedenaissance}
              onChange={(e) =>
                setFormData({ ...formData, datedenaissance: e.target.value })
              }
              className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {errors.datedenaissance && (
            <p className="mt-1 text-sm text-red-600">{errors.datedenaissance}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année d'étude
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen size={20} className="text-gray-400" />
            </div>
            <select
              value={formData.anneeetude}
              onChange={(e) =>
                setFormData({ ...formData, anneeetude: e.target.value })
              }
              className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Sélectionner une année</option>
              <option value="L1">Licence 1</option>
              <option value="L2">Licence 2</option>
              <option value="L3">Licence 3</option>
              <option value="M1">Master 1</option>
              <option value="M2">Master 2</option>
              <option value="D">Doctorat</option>
            </select>
          </div>
          {errors.anneeetude && (
            <p className="mt-1 text-sm text-red-600">{errors.anneeetude}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filière
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GraduationCap size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.filiere}
            onChange={(e) =>
              setFormData({ ...formData, filiere: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Ex: Informatique, Mathématiques, etc."
          />
        </div>
        {errors.filiere && (
          <p className="mt-1 text-sm text-red-600">{errors.filiere}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isEditing ? "Modifier l'étudiant" : "Ajouter l'étudiant"}
      </button>
    </form>
  );
}
