import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import ServiceSelector from './components/ServiceSelector';
import BarberSelector from './components/BarberSelector';
import DateTimePicker from './components/DateTimePicker';
import Confirmation from './components/Confirmation';
import BookingSummary from './components/BookingSummary';
import BookingSuccess from './components/BookingSuccess';
import AdminDashboard from './components/AdminDashboard';
import { INITIAL_SERVICES, INITIAL_BARBERS } from './constants';
import type { Service, Barber, Appointment, PartialAppointment, ShopInfo } from './types';

// --- LocalStorage Persistence ---

const getInitialShopInfo = (): ShopInfo => {
  try {
    const item = window.localStorage.getItem('barberShopInfo');
    return item ? JSON.parse(item) : { name: 'BarberTime+', logoUrl: '' };
  } catch (error) {
    console.error('Error reading shopInfo from localStorage', error);
    return { name: 'BarberTime+', logoUrl: '' };
  }
};

const getInitialServices = (): Service[] => {
  try {
    const item = window.localStorage.getItem('barberShopServices');
    return item ? JSON.parse(item) : INITIAL_SERVICES;
  } catch (error) {
    console.error('Error reading services from localStorage', error);
    return INITIAL_SERVICES;
  }
};

const getInitialBarbers = (): Barber[] => {
  try {
    const item = window.localStorage.getItem('barberShopBarbers');
    return item ? JSON.parse(item) : INITIAL_BARBERS;
  } catch (error) {
    console.error('Error reading barbers from localStorage', error);
    return INITIAL_BARBERS;
  }
};

const getInitialAppointments = (): Appointment[] => {
  try {
    const item = window.localStorage.getItem('barberShopAppointments');
    if (!item) return [];
    // Revive date strings into Date objects
    return (JSON.parse(item) as any[]).map(appt => ({
      ...appt,
      date: new Date(appt.date),
    }));
  } catch (error) {
    console.error('Error reading appointments from localStorage', error);
    return [];
  }
};

type View = 'booking' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('booking');
  const [currentStep, setCurrentStep] = useState(1);
  const [appointment, setAppointment] = useState<PartialAppointment>({});
  
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(getInitialAppointments);
  const [services, setServices] = useState<Service[]>(getInitialServices);
  const [barbers, setBarbers] = useState<Barber[]>(getInitialBarbers);
  const [shopInfo, setShopInfo] = useState<ShopInfo>(getInitialShopInfo);

  const [bookingComplete, setBookingComplete] = useState(false);
  
  // --- useEffects for persistence ---
  useEffect(() => {
    try {
      window.localStorage.setItem('barberShopInfo', JSON.stringify(shopInfo));
    } catch (error) {
      console.error('Error saving shopInfo to localStorage', error);
    }
  }, [shopInfo]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem('barberShopServices', JSON.stringify(services));
    } catch (error) {
      console.error('Error saving services to localStorage', error);
    }
  }, [services]);

  useEffect(() => {
    try {
      window.localStorage.setItem('barberShopBarbers', JSON.stringify(barbers));
    } catch (error) {
      console.error('Error saving barbers to localStorage', error);
    }
  }, [barbers]);

  useEffect(() => {
    try {
      window.localStorage.setItem('barberShopAppointments', JSON.stringify(allAppointments));
    } catch (error) {
      console.error('Error saving appointments to localStorage', error);
    }
  }, [allAppointments]);


  const totalSteps = 4;
  const stepLabels = ['Serviço', 'Profissional', 'Horário', 'Confirmação'];

  // --- CRUD Handlers ---
  const handleAddService = (serviceData: Omit<Service, 'id'>) => {
    setServices(prev => [...prev, { ...serviceData, id: Date.now() }]);
  };
  const handleUpdateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    setAllAppointments(prev => prev.map(a => a.service.id === updatedService.id ? { ...a, service: updatedService } : a));
  };
  const handleDeleteService = (id: number) => {
    setServices(prev => prev.filter(s => s.id !== id));
    // Note: This will not remove appointments with the deleted service.
    // A more robust implementation might prevent deletion or handle appointments.
  };

  const handleAddBarber = (barberData: Omit<Barber, 'id'>) => {
    setBarbers(prev => [...prev, { ...barberData, id: Date.now() }]);
  };
  const handleUpdateBarber = (updatedBarber: Barber) => {
    setBarbers(prev => prev.map(b => b.id === updatedBarber.id ? updatedBarber : b));
    setAllAppointments(prev => prev.map(a => a.barber.id === updatedBarber.id ? { ...a, barber: updatedBarber } : a));
  };
  const handleDeleteBarber = (id: number) => {
    setBarbers(prev => prev.filter(b => b.id !== id));
  };
  const handleUpdateShopInfo = (info: ShopInfo) => {
    setShopInfo(info);
  };
  // ---------------------

  const handleServiceSelect = (service: Service) => {
    setAppointment({ service });
    setCurrentStep(2);
  };

  const handleBarberSelect = (barber: Barber) => {
    setAppointment(prev => ({ ...prev, barber }));
    setCurrentStep(3);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setAppointment(prev => ({ ...prev, date, time }));
  };

  const handleConfirm = (clientName: string, clientPhone: string) => {
    const finalAppointment = { ...appointment, clientName, clientPhone } as Appointment;
    setAllAppointments(prev => [...prev, finalAppointment]);
    setAppointment(finalAppointment);
    setBookingComplete(true);
    setCurrentStep(5); // Success step
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      if (currentStep === 2) {
        setAppointment({});
      }
      if (currentStep === 3) {
        setAppointment(prev => ({...prev, barber: undefined}));
      }
      if (currentStep === 4) {
        setAppointment(prev => ({...prev, date: undefined, time: undefined}));
      }
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setAppointment({});
    setCurrentStep(1);
    setBookingComplete(false);
  };
  
  const renderBookingStep = () => {
    if (bookingComplete) {
      return <BookingSuccess appointment={appointment as Appointment} onReset={handleReset} />;
    }
    
    switch (currentStep) {
      case 1:
        return <ServiceSelector services={services} onSelect={handleServiceSelect} />;
      case 2:
        return <BarberSelector barbers={barbers} onSelect={handleBarberSelect} />;
      case 3:
        return <DateTimePicker onSelect={handleDateTimeSelect} barber={appointment.barber} appointments={allAppointments} />;
      case 4:
        return <Confirmation appointment={appointment} onConfirm={handleConfirm} />;
      default:
        return null;
    }
  };

  const handleDateTimeConfirm = () => {
    if (appointment.date && appointment.time) {
      setCurrentStep(4);
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="container mx-auto p-4">
        <Header 
          onViewChange={setCurrentView} 
          currentView={currentView}
          shopName={shopInfo.name}
          logoUrl={shopInfo.logoUrl}
        />
        {currentView === 'booking' ? (
          <>
            <main className="mt-8">
              {!bookingComplete && (
                  <ProgressBar currentStep={currentStep} totalSteps={totalSteps} labels={stepLabels} />
              )}
              <div className="mt-12">
                {renderBookingStep()}
              </div>
            </main>
            {!bookingComplete && (
              <BookingSummary appointment={appointment} onGoBack={handleGoBack} currentStep={currentStep} />
            )}
            {currentStep === 3 && appointment.date && appointment.time && (
              <div className="text-center mt-8">
                <button 
                  onClick={handleDateTimeConfirm}
                  className="bg-amber-500 text-black text-2xl font-bold py-3 px-8 rounded-lg hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300"
                >
                  Continuar
                </button>
              </div>
            )}
          </>
        ) : (
          <AdminDashboard 
            appointments={allAppointments} 
            barbers={barbers} 
            services={services}
            shopInfo={shopInfo}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            onAddBarber={handleAddBarber}
            onUpdateBarber={handleUpdateBarber}
            onDeleteBarber={handleDeleteBarber}
            onUpdateShopInfo={handleUpdateShopInfo}
          />
        )}
      </div>
    </div>
  );
};

export default App;