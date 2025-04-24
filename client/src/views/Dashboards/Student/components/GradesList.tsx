import type { Grade } from '../types';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../../../context/AuthContext';

interface GradesListProps {
  etudiantId: number;  // Prop pour l'ID de l'étudiant
}


export function GradesList({ etudiantId }: GradesListProps) {
  const { fetchNotesByStudentId, fetchCourseTitle } = useContext(AuthContext);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  // Fetcher les notes au montage du composant ou quand etudiantId change
  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true);
      setError(null);
      try {
        const notes = await fetchNotesByStudentId(etudiantId);
        // Mapper les données de l'API au format attendu par Grade
        const mappedGrades: Grade[] = await Promise.all(notes.map(async (note: any) => ({
          id: note.id,
          courseName: await fetchCourseTitle(note.cours),
          examType: note.type_examen,
          grade: note.note,
          feedback: note.explication,
        })));
        setGrades(mappedGrades);
      } catch (err) {
        setError('Erreur lors de la récupération des notes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, [etudiantId, fetchNotesByStudentId]);

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + Number(grade.grade), 0);
    return (sum / grades.length).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {loading && <p className="text-gray-500">Chargement des notes...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Moyenne générale</h3>
            <div className="text-3xl font-bold text-blue-600">{calculateAverage()}/20</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appréciation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucune note disponible
                    </td>
                  </tr>
                ) : (
                  grades.map((grade) => (
                    <tr key={grade.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{grade.courseName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{grade.examType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{grade.grade}/20</div>
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{grade.feedback}</div>
                      </td>
            
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}