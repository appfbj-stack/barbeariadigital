import React from 'react';
import type { Appointment } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarViewProps {
    appointments: Appointment[];
    currentDate: Date;
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    onMonthChange: (offset: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, currentDate, selectedDate, onDateSelect, onMonthChange }) => {

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay(); // 0 for Sunday, 1 for Monday...
    const daysInMonth = endOfMonth.getDate();

    const calendarDays = [];
    
    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-start-${i}`} className="border-r border-b border-gray-700"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        
        const appointmentsOnDay = appointments.filter(a => a.date.toISOString().split('T')[0] === dateString);
        
        const isToday = new Date().toISOString().split('T')[0] === dateString;
        const isSelected = selectedDate.toISOString().split('T')[0] === dateString;

        calendarDays.push(
            <div 
                key={day} 
                className={`p-2 border-r border-b border-gray-700 cursor-pointer transition-colors duration-200 
                    ${isSelected ? 'bg-amber-500/30' : 'hover:bg-gray-700'}
                    ${date.getDay() === 0 ? 'bg-gray-800/50' : ''}
                `}
                onClick={() => onDateSelect(date)}
            >
                <div className={`flex justify-center items-center w-8 h-8 rounded-full text-lg font-bold
                  ${isToday ? 'bg-amber-400 text-black' : ''}
                  ${isSelected ? 'ring-2 ring-amber-400' : ''}
                `}>
                    {day}
                </div>
                {appointmentsOnDay.length > 0 && (
                    <div className="mt-2 text-center text-xs text-amber-300">
                        {appointmentsOnDay.length} agend.
                    </div>
                )}
            </div>
        );
    }
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => onMonthChange(-1)} className="p-2 rounded-full bg-gray-700 hover:bg-amber-500 transition">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 text-center">
                    {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={() => onMonthChange(1)} className="p-2 rounded-full bg-gray-700 hover:bg-amber-500 transition">
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="grid grid-cols-7 border-t border-l border-gray-700">
                 {weekDays.map(day => (
                    <div key={day} className="p-2 text-center text-xs sm:text-base font-semibold text-gray-400 border-r border-b border-gray-700 bg-gray-900">{day}</div>
                ))}
                {calendarDays}
            </div>
        </div>
    );
};

export default CalendarView;