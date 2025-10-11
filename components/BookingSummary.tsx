import React from 'react';
import type { PartialAppointment } from '../types';
import { ArrowLeftIcon } from './icons';

interface BookingSummaryProps {
    appointment: PartialAppointment;
    onGoBack: () => void;
    currentStep: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ appointment, onGoBack, currentStep }) => {
    const { service, barber, date, time } = appointment;

    if (currentStep <= 1) return null;

    return (
        <div className="mt-4 p-4 bg-gray-950/50 border border-gray-700 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-2 text-gray-300 text-sm sm:text-lg flex-wrap">
                {service && <span><strong>Serviço:</strong> {service.name}</span>}
                {barber && <span className="text-gray-500">/</span>}
                {barber && <span><strong>Barbeiro:</strong> {barber.name}</span>}
                {date && time && <span className="text-gray-500">/</span>}
                {date && time && <span><strong>Data:</strong> {date.toLocaleDateString('pt-BR')} às {time}</span>}
            </div>
            {currentStep < 4 && (
                 <button
                    onClick={onGoBack}
                    className="flex items-center space-x-2 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors self-start sm:self-center"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Voltar</span>
                </button>
            )}
        </div>
    );
};

export default BookingSummary;