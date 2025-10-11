import React from 'react';
import type { LegacyAppointment } from '../types';
import { CheckCircleIcon } from './icons';

interface BookingSuccessProps {
  appointment: LegacyAppointment;
  onReset: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ appointment, onReset }) => {
    const { service, barber, date, time, clientName, clientPhone } = appointment;

  return (
    <div className="text-center p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg animate-fade-in mt-8">
      <CheckCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-green-400 mx-auto mb-4" />
      <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-green-400">Agendamento Confirmado!</h2>
      <p className="text-xl sm:text-2xl text-gray-300 mb-6">Seu horário está garantido. Nos vemos em breve!</p>
      
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600 space-y-3 text-lg sm:text-2xl text-left">
        <p><strong className="text-amber-400 w-24 sm:w-28 inline-block">Nome:</strong> {clientName}</p>
        <p><strong className="text-amber-400 w-24 sm:w-28 inline-block">WhatsApp:</strong> {clientPhone}</p>
        <p><strong className="text-amber-400 w-24 sm:w-28 inline-block">Serviço:</strong> {service.name}</p>
        <p><strong className="text-amber-400 w-24 sm:w-28 inline-block">Barbeiro:</strong> {barber.name}</p>
        <p><strong className="text-amber-400 w-24 sm:w-28 inline-block">Data:</strong> {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
        <p><strong className="text-amber-400 w-24 sm:w-28 inline-block">Horário:</strong> {time}</p>
      </div>

      <button
        onClick={onReset}
        className="mt-8 w-full bg-amber-500 text-black text-2xl sm:text-3xl font-bold py-3 sm:py-4 px-6 rounded-lg hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300"
      >
        Agendar Novo Horário
      </button>
       <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
              animation: fade-in 0.5s ease-out;
          }
      `}</style>
    </div>
  );
};

export default BookingSuccess;