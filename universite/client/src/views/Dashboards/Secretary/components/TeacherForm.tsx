import React, { useState } from "react";
import { Teacher, TeacherRole } from "../types";
import { User, Mail, Calendar, Phone, Lock, CalendarDays, EyeOff, Eye } from "lucide-react";

interface TeacherFormProps {
  onSubmit: (teacher: Teacher) => void;
}

const roles: TeacherRole[] = ["Vacataire", "ATER", "MdC", "Professeur"];

export function TeacherForm({ onSubmit }: TeacherFormProps) {
  const [formData, setFormData] = useState<Teacher>({
    prenom: "",
    nom: "",
    tel: "",
    fonction: "Vacataire",
    datedenaissance: "",
    password: "",
    password2: "",
    email: "",
    anneeinscrit: "2023",
    role: "enseignant",
  });
  const [errors, setErrors] = useState<Partial<Teacher>>({});
  const [showPassword, setShowPassword] = useState(false);
  const validate = () => {
    const newErrors: Partial<Teacher> = {};
    if (!formData.prenom) newErrors.prenom = "Le prénom est requis";
    if (!formData.nom) newErrors.nom = "Le nom est requis";
    if (!formData.tel) newErrors.tel = "Le télétel est requis";
    if (!/^\d{10}$/.test(formData.tel))
      newErrors.tel = "Format de télétel invalide";
    if (!formData.datedenaissance)
      newErrors.datedenaissance = "La date de naissance est requise";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    if (formData.password && formData.password.length < 8)
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    if (!formData.password2)
      newErrors.password2 =
        "La confirmation du mot de passe est requise";
    if (formData.password !== formData.password2)
      newErrors.password2 = "Les mots de passe ne correspondent pas";
    if (!formData.email) newErrors.email = "L'email est requis";
    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      newErrors.email = "Format d'email invalide";
    if (!formData.anneeinscrit) newErrors.anneeinscrit = "L'année est requise";
    if (!/^\d{4}$/.test(formData.anneeinscrit))
      newErrors.anneeinscrit = "Format d'année invalide";
    if (formData.anneeinscrit && (parseInt(formData.anneeinscrit) < 2000 || parseInt(formData.anneeinscrit) > new Date().getFullYear()))
      newErrors.anneeinscrit = "L'année doit être comprise entre 2000 et l'année actuelle";
    
    return newErrors;
   
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({
        prenom: "",
        nom: "",
        tel: "",
        fonction: "Vacataire",
        datedenaissance: "",
        password: "",
        password2: "",
        email: "",
        anneeinscrit: "2023",
        role: "enseignant",
      });
    } else {
      setErrors(newErrors);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

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
          Adresse email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={20} className="text-gray-400" />
          </div>
          <input
            type="email"
            value={formData.email || ""}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.anneeinscrit || "2023"}
              onChange={(e) =>
                setFormData({ ...formData, anneeinscrit: e.target.value })
              }
              className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {errors.anneeinscrit && (
            <p className="mt-1 text-sm text-red-600">{errors.anneeinscrit}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays size={20} className="text-gray-400" />
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de télétel
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone size={20} className="text-gray-400" />
          </div>
          <input
            type="tel"
            value={formData.tel}
            onChange={(e) =>
              setFormData({ ...formData, tel: e.target.value })
            }
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        {errors.tel && (
          <p className="mt-1 text-sm text-red-600">{errors.tel}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fonction
        </label>
        <select 
          value={formData.fonction}
          onChange={(e) =>
            setFormData({ ...formData, fonction: e.target.value as TeacherRole })
          }
          className="block w-full rounded-md border border-gray-300 bg-white py-3 pl-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
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



      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Ajouter l'enseignant
      </button>
    </form>
  );
}
