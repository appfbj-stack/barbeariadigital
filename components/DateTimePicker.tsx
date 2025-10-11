import React, { useState, useMemo } from 'react';
import { TIME_SLOTS } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import type { LegacyAppointment, LegacyBarber } from '../types';

interface DateTimePickerProps {
  onSelect: (date: Date, time: string) => void;
  barber: LegacyBarber | undefined;
  appointments: LegacyAppointment[];
}

const getNextValidDays = (count: number): Date[] => {
    const days: Date[] = [];
    let currentDate = new Date();
    while (days.length < count) {
        const dayOfWeek = currentDate.getDay();
        // 0 is Sunday, 6 is Saturday. We want Mon-Sat.
        if (dayOfWeek > 0) { 
            days.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
};

const formatDateKey = (date: Date): string => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({ onSelect, barber, appointments }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => getNextValidDays(1)[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableDays = useMemo(() => getNextValidDays(14), []);

  const handleDateChange = (offset: number) => {
    const currentIndex = availableDays.findIndex(d => d.toDateString() === selectedDate.toDateString());
    const newIndex = currentIndex + offset;
    if (newIndex >= 0 && newIndex < availableDays.length) {
      setSelectedDate(availableDays[newIndex]);
      setSelectedTime(null);
    }
  };

  const isSlotUnavailable = (time: string) => {
    if (!barber) return true; // Can't check availability without a barber
    const dateKey = formatDateKey(selectedDate);
    
    return appointments.some(appt => 
        formatDateKey(appt.date) === dateKey &&
        appt.barber.id === barber.id &&
        appt.time === time
    );
  };
  
  const handleTimeSelect = (time: string) => {
      setSelectedTime(time);
      onSelect(selectedDate, time);
  }

  if (!barber) {
      return <div className="text-center text-amber-400 text-xl">Por favor, volte e selecione um profissional primeiro.</div>
  }

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-amber-400">Escolha a Data e Horário</h2>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
            <button 
                onClick={() => handleDateChange(-1)} 
                disabled={selectedDate.toDateString() === availableDays[0].toDateString()}
                className="p-2 rounded-full bg-gray-700 hover:bg-amber-500 disabled:bg-gray-800 disabled:text-gray-600 transition">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">
                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                </p>
                <p className="text-lg sm:text-xl text-gray-400">
                    {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                </p>
            </div>
            <button 
                onClick={() => handleDateChange(1)} 
                disabled={selectedDate.toDateString() === availableDays[availableDays.length - 1].toDateString()}
                className="p-2 rounded-full bg-gray-700 hover:bg-amber-500 disabled:bg-gray-800 disabled:text-gray-600 transition">
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {TIME_SLOTS.map((time) => {
          const isUnavailable = isSlotUnavailable(time);
          return (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              disabled={isUnavailable}
              className={`p-3 text-lg sm:p-4 sm:text-2xl font-semibold rounded-lg transition-all duration-200 
                ${isUnavailable ? 'bg-gray-700 text-gray-500 cursor-not-allowed line-through' : ''}
                ${!isUnavailable && selectedTime !== time ? 'bg-gray-700 hover:bg-amber-500 hover:text-black' : ''}
                ${selectedTime === time ? 'bg-amber-400 text-black ring-2 ring-offset-2 ring-offset-gray-900 ring-amber-400' : ''}
              `}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateTimePicker;