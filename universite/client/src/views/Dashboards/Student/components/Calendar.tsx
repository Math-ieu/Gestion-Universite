import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Session } from '../types';

interface CalendarProps {
  sessions: Session[];
}

export function Calendar({ sessions }: CalendarProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">Calendrier des séances</h2>
        <div className="mt-4 space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-start p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{session.courseName}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {format(new Date(session.date), 'PPP', { locale: fr })} - {session.duration}h
                </p>
                <p className="mt-1 text-sm text-gray-500">Salle: {session.room}</p>
                <p className="mt-2 text-sm text-gray-600">{session.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}