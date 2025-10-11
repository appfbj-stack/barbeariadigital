import React from 'react';
import type { Appointment } from '../types';

interface DayDetailViewProps {
  selectedDate: Date;
  appointments: Appointment[];
}

const DayDetailView: React.FC<DayDetailViewProps> = ({ selectedDate, appointments }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg h-full">
      <h3 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4 border-b border-gray-700 pb-2">
        Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}
      </h3>
      {appointments.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Nenhum agendamento para este dia.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {appointments.map((appt, index) => (
            <li key={index} className="bg-gray-900 p-2 sm:p-3 rounded-md">
              <p className="font-bold text-base sm:text-lg text-white">{appt.time} - {appt.clientName}</p>
              <p className="text-gray-400 text-sm sm:text-base">{appt.service.name} com {appt.barber.name}</p>
              <p className="text-amber-300 text-sm sm:text-base mt-1">WhatsApp: {appt.clientPhone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DayDetailView;