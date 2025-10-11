import React, { useState } from 'react';
import type { PartialAppointment } from '../types';

interface ConfirmationProps {
  appointment: PartialAppointment;
  onConfirm: (clientName: string, clientPhone: string) => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ appointment, onConfirm }) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { service, barber, date, time } = appointment;

  if (!service || !barber || !date || !time) {
    return <div className="text-center text-red-500">Informações do agendamento incompletas. Por favor, volte e preencha todos os campos.</div>
  }

  const handleConfirmClick = () => {
    let isValid = true;
    if (clientName.trim() === '') {
      setNameError('Por favor, insira seu nome para confirmar.');
      isValid = false;
    } else {
      setNameError('');
    }

    const phoneDigits = clientPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setPhoneError('Por favor, insira um número de WhatsApp válido.');
      isValid = false;
    } else {
      setPhoneError('');
    }

    if (!isValid) return;
    
    onConfirm(clientName, clientPhone);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-amber-400">Confirme seu Agendamento</h2>
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg border-2 border-amber-400 shadow-lg space-y-4 text-xl sm:text-2xl">
        <p><strong className="text-amber-400">Serviço:</strong> {service.name} (R$ {service.price.toFixed(2)})</p>
        <p><strong className="text-amber-400">Barbeiro:</strong> {barber.name}</p>
        <p><strong className="text-amber-400">Data:</strong> {date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
        <p><strong className="text-amber-400">Horário:</strong> {time}</p>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-xl sm:text-2xl font-semibold mb-2 text-amber-400">Seu Nome</label>
          <input 
            type="text" 
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Digite seu nome completo"
            className="w-full bg-gray-700 text-white text-xl sm:text-2xl p-3 sm:p-4 rounded-lg border-2 border-gray-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
          />
          {nameError && <p className="text-red-400 mt-2 text-lg">{nameError}</p>}
        </div>
        <div>
          <label htmlFor="clientPhone" className="block text-xl sm:text-2xl font-semibold mb-2 text-amber-400">Seu WhatsApp</label>
          <input 
            type="tel" 
            id="clientPhone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="(XX) XXXXX-XXXX"
            className="w-full bg-gray-700 text-white text-xl sm:text-2xl p-3 sm:p-4 rounded-lg border-2 border-gray-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
          />
          {phoneError && <p className="text-red-400 mt-2 text-lg">{phoneError}</p>}
        </div>
      </div>

      <button
        onClick={handleConfirmClick}
        className="mt-8 w-full bg-amber-500 text-black text-2xl sm:text-3xl font-bold py-3 sm:py-4 px-6 rounded-lg hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={!clientName.trim() || !clientPhone.trim()}
      >
        Confirmar e Agendar
      </button>
    </div>
  );
};

export default Confirmation;