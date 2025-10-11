import React, { useState } from 'react';
import CalendarView from './CalendarView';
import DayDetailView from './DayDetailView';
import ManagementPanel from './ManagementPanel';
import type { Appointment, Barber, Service, ShopInfo } from '../types';

interface AdminDashboardProps {
  appointments: Appointment[];
  barbers: Barber[];
  services: Service[];
  shopInfo: ShopInfo;
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: number) => void;
  onAddBarber: (barber: Omit<Barber, 'id'>) => void;
  onUpdateBarber: (barber: Barber) => void;
  onDeleteBarber: (id: number) => void;
  onUpdateShopInfo: (info: ShopInfo) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { appointments } = props;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'agenda' | 'management'>('agenda');

  const handleMonthChange = (offset: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const appointmentsForSelectedDay = appointments.filter(
    a => a.date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-400">Painel do</h2>
        <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full p-1">
          <button 
            onClick={() => setView('agenda')}
            className={`px-4 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${view === 'agenda' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-gray-700'}`}
          >
              Agenda
          </button>
          <button 
            onClick={() => setView('management')}
            className={`px-4 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${view === 'management' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-gray-700'}`}
          >
              Gerenciamento
          </button>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-400">Administrador</h2>
      </div>
      
      {view === 'agenda' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CalendarView 
              appointments={appointments}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onMonthChange={handleMonthChange}
            />
          </div>
          <div>
            <DayDetailView
              selectedDate={selectedDate}
              appointments={appointmentsForSelectedDay}
            />
          </div>
        </div>
      ) : (
        <ManagementPanel {...props} />
      )}
    </div>
  );
};

export default AdminDashboard;