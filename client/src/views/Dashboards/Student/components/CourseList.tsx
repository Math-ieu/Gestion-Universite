import { BookOpen, Clock, User } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import type { Course, Teacher } from '../types';
import AuthContext from '../../../../context/AuthContext';

interface CourseListProps {
  courses: Course[];
  onEnroll: (courseId: string) => Promise<void>;
  onUnenroll: (courseId: string) => Promise<void>; 
}

export function CourseList({ courses, onEnroll, onUnenroll }: CourseListProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const { fetchTeachersfunction } = useContext(AuthContext);

  // Fetcher la liste des enseignants
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      try {
        const teachersData = await fetchTeachersfunction();
        console.log('Teachers data:', teachersData); // Log pour débogage
        if (Array.isArray(teachersData)) {
          setTeachers(teachersData);
        } else {
          throw new Error('Données des enseignants non valides');
        }
      } catch (error) {
        console.error('Erreur lors du fetch des enseignants:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les enseignants',
          icon: 'error',
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [fetchTeachersfunction]);

  // Trouver un enseignant par ID
  const getTeacherName = (teacherId: number): string => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? `${teacher.nom} ${teacher.prenom}` : 'Enseignant inconnu';
  };

  const handleEnrollClick = async (courseId: string, courseName: string) => {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vous inscrire au cours "${courseName}" ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, s\'inscrire',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onEnroll(courseId);
          Swal.fire({
            title: 'Succès',
            text: 'Inscription réussie !',
            icon: 'success',
            toast: true,
            timer: 3000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            title: 'Erreur',
            text: 'Échec de l\'inscription',
            icon: 'error',
            toast: true,
            timer: 3000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  const handleUnenrollClick = async (courseId: string, courseName: string) => {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vous désinscrire du cours "${courseName}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, se désinscrire',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onUnenroll(courseId);
          Swal.fire({
            title: 'Succès',
            text: 'Désinscription réussie !',
            icon: 'success',
            toast: true,
            timer: 3000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            title: 'Erreur',
            text: 'Échec de la désinscription',
            icon: 'error',
            toast: true,
            timer: 3000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {courses.map((course) => (
        <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{course.titre}</h3>
              <p className="text-sm text-gray-500">{course.id}</p>
            </div>
            <button
              onClick={() =>
                course.enrolled
                  ? handleUnenrollClick(course.id.toString(), course.titre)
                  : handleEnrollClick(course.id.toString(), course.titre)
              }
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                course.enrolled
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {course.enrolled ? 'Se désinscrire' : "S'inscrire"}
            </button>
          </div>

          <p className="mt-2 text-gray-600">{course.description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-2" />
              <span>{loadingTeachers ? 'Chargement...' : getTeacherName(course.enseignant)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>{course.semestre}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}