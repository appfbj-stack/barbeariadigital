import React from 'react';
import type { LegacyBarber } from '../types';

interface BarberSelectorProps {
  barbers: LegacyBarber[];
  onSelect: (barber: LegacyBarber) => void;
}

const BarberSelector: React.FC<BarberSelectorProps> = ({ barbers, onSelect }) => {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-amber-400">Escolha o Profissional</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {barbers.map((barber) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber)}
            className="group p-4 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-amber-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-300 text-center transform hover:-translate-y-1"
          >
            <img
              src={barber.avatarUrl}
              alt={barber.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 border-4 border-gray-700 group-hover:border-amber-400 transition-all duration-300"
            />
            <h3 className="text-xl sm:text-2xl font-semibold text-white">{barber.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BarberSelector;