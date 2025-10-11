import React from 'react';
import type { Service } from '../types';
import { ScissorsIcon, BeardIcon, ComboIcon } from './icons';

interface ServiceSelectorProps {
  services: Service[];
  onSelect: (service: Service) => void;
}

const ServiceIcon = ({ serviceName, className }: { serviceName: string, className: string }) => {
  if (serviceName.includes('Combo')) return <ComboIcon className={className} />;
  if (serviceName.includes('Corte')) return <ScissorsIcon className={className} />;
  if (serviceName.includes('Barba')) return <BeardIcon className={className} />;
  return null;
};

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ services, onSelect }) => {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-amber-400">Escolha o Serviço</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className="group text-left p-4 sm:p-6 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-amber-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-3">
              <ServiceIcon serviceName={service.name} className="w-8 h-8 mr-4 text-amber-400" />
              <h3 className="text-2xl sm:text-3xl font-semibold text-white">{service.name}</h3>
            </div>
            <p className="text-gray-400 mb-3 text-base sm:text-lg">{service.description}</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-400">R$ {service.price.toFixed(2)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;