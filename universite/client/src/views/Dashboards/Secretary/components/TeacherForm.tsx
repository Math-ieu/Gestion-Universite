import React, { useState } from 'react';
import { Teacher, TeacherRole } from '../types';
import { User, Mail, Calendar, Phone } from 'lucide-react';

interface TeacherFormProps {
  onSubmit: (teacher: Teacher) => void;""
}

const roles: TeacherRole[] = ['Vacataire', 'ATER', 'MdC', 'Professeur'];

export function TeacherForm({ onSubmit }: TeacherFormProps) {
  const [formData, setFormData] = useState<Teacher>({
    firstName: '',
    lastName: '', 
    phone: '',
    role: 'Vacataire'
  });
  const [errors, setErrors] = useState<Partial<Teacher>>({});

  const validate = () => {
    const newErrors: Partial<Teacher> = {};
    if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Format de téléphone invalide';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({ firstName: '', lastName: '', phone: '', role: 'Vacataire' });
    } else {
      setErrors(newErrors);
    }
  };

  

return (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail size={20} className="text-gray-400" />
        </div>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="vous@exemple.com"
        />
      </div>
      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={formData.year || '2023'}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>
      {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone size={20} className="text-gray-400" />
        </div>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>
      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as TeacherRole })}
        className="block w-full rounded-md border border-gray-300 bg-white py-3 pl-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      >
        {roles.map((role) => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Ajouter l'enseignant
    </button>
  </form>
)
}