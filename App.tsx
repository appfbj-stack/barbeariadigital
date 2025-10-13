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
import type { 
  Service, 
  Barber, 
  Appointment, 
  PartialAppointment, 
  ShopInfo,
  LegacyService,
  LegacyBarber,
  LegacyAppointment
} from './types';
import { convertServiceToLegacy, convertBarberToLegacy } from './types';

import { getBarbeiros, getServicos, criarAgendamento } from './services/supabaseService';

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

const getInitialServices = (): LegacyService[] => {
  try {
    const item = window.localStorage.getItem('barberShopServices');
    return item ? JSON.parse(item) : INITIAL_SERVICES;
  } catch (error) {
    console.error('Error reading services from localStorage', error);
    return INITIAL_SERVICES;
  }
};

const getInitialBarbers = (): LegacyBarber[] => {
  try {
    const item = window.localStorage.getItem('barberShopBarbers');
    return item ? JSON.parse(item) : INITIAL_BARBERS;
  } catch (error) {
    console.error('Error reading barbers from localStorage', error);
    return INITIAL_BARBERS;
  }
};

const getInitialAppointments = (): LegacyAppointment[] => {
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
  
  const [allAppointments, setAllAppointments] = useState<LegacyAppointment[]>(getInitialAppointments);
  const [services, setServices] = useState<LegacyService[]>(getInitialServices);
  const [barbers, setBarbers] = useState<LegacyBarber[]>(getInitialBarbers);
  const [shopInfo, setShopInfo] = useState<ShopInfo>(getInitialShopInfo);

  const [bookingComplete, setBookingComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Carregar dados do Supabase ---
  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar barbeiros e serviços em paralelo
        const [barbeirosData, servicosData] = await Promise.all([
          getBarbeiros(),
          getServicos()
        ]);
        
        // Converter para formato legacy para compatibilidade
        const legacyBarbers = barbeirosData.map(convertBarberToLegacy);
        const legacyServices = servicosData.map(convertServiceToLegacy);
        
        // Log para debug dos IDs convertidos
        console.log('🔄 Conversão de IDs:');
        barbeirosData.forEach((original, index) => {
          console.log(`Barbeiro ${index}: ${original.id} → ${legacyBarbers[index].id}`);
        });
        servicosData.forEach((original, index) => {
          console.log(`Serviço ${index}: ${original.id} → ${legacyServices[index].id}`);
        });
        
        // Atualizar estados apenas se temos dados
        if (legacyBarbers.length > 0) {
          setBarbers(legacyBarbers);
        }
        
        if (legacyServices.length > 0) {
          setServices(legacyServices);
        }
        
        console.log('✅ Dados carregados do Supabase:', {
          barbeiros: legacyBarbers.length,
          servicos: legacyServices.length
        });
        
      } catch (err) {
        console.error('❌ Erro ao carregar dados do Supabase:', err);
        setError('Erro ao conectar com o banco de dados. Usando dados locais.');
        
        // Em caso de erro, usar dados locais como fallback
        setBarbers(getInitialBarbers());
        setServices(getInitialServices());
      } finally {
        setLoading(false);
      }
    };
    
    loadSupabaseData();
  }, []);
  
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

  const handleConfirm = async (clientName: string, clientPhone: string) => {
    try {
      setLoading(true);
      
      const finalAppointment = { ...appointment, clientName, clientPhone } as LegacyAppointment;
      
      // Preparar dados para o Supabase
      if (appointment.barber && appointment.service && appointment.date && appointment.time) {
        // Encontrar IDs originais do Supabase
        const barbeirosData = await getBarbeiros();
        const servicosData = await getServicos();
        
        // Busca simplificada usando nome como chave secundária
        const barbeiroOriginal = barbeirosData.find(b => b.nome === appointment.barber!.name);
        const servicoOriginal = servicosData.find(s => s.nome === appointment.service!.name);
        
        if (barbeiroOriginal && servicoOriginal) {
          // Criar data/hora completa
          const [hours, minutes] = appointment.time.split(':').map(Number);
          const dataAgendamento = new Date(appointment.date);
          dataAgendamento.setHours(hours, minutes, 0, 0);
          
          // Criar agendamento no Supabase
          const novoAgendamento = {
            cliente_nome: clientName,
            cliente_telefone: clientPhone,
            barbeiro_id: barbeiroOriginal.id,
            servico_id: servicoOriginal.id,
            data_agendamento: dataAgendamento.toISOString(),
            status: 'agendado' as const
          };
          
          try {
            const agendamentoCriado = await criarAgendamento(novoAgendamento);
            
            // Adicionar à lista local para exibição imediata
            setAllAppointments(prev => [...prev, finalAppointment]);
            setAppointment(finalAppointment);
            setBookingComplete(true);
            setCurrentStep(5); // Success step
            setError(null);
            
          } catch (err) {
            console.error('Erro ao criar agendamento:', err);
            setError('Erro ao salvar agendamento. Tente novamente.');
            setCurrentStep(5);
          }
        } else {
          throw new Error('Barbeiro ou serviço não encontrado');
        }
      } else {
        throw new Error('Dados do agendamento incompletos');
      }
    } catch (err) {
      console.error('Erro ao confirmar agendamento:', err);
      setError('Erro ao salvar agendamento. Tente novamente.');
      
      // Em caso de erro, ainda permite continuar localmente
      const finalAppointment = { ...appointment, clientName, clientPhone } as LegacyAppointment;
      setAllAppointments(prev => [...prev, finalAppointment]);
      setAppointment(finalAppointment);
      setBookingComplete(true);
      setCurrentStep(5);
    } finally {
      setLoading(false);
    }
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

  // Componente de carregamento
  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-amber-400">Carregando BarberTime+</h2>
          <p className="text-gray-400 mt-2">Conectando com o banco de dados...</p>
        </div>
      </div>
    );
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
        
        {/* Mensagem de erro se houver */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠️</span>
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
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