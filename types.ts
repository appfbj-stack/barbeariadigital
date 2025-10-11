// Tipos compatíveis com Supabase
export interface Service {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number; // em minutos
  categoria: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: string;
  nome: string;
  especialidades: string[];
  avatar_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  cliente_email?: string;
  barbeiro_id: string;
  servico_id: string;
  data_agendamento: string;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para compatibilidade com componentes existentes
export interface LegacyService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface LegacyBarber {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface LegacyAppointment {
  service: LegacyService;
  barber: LegacyBarber;
  date: Date;
  time: string;
  clientName: string;
  clientPhone: string;
}

export type PartialAppointment = Partial<Omit<LegacyAppointment, 'date'>> & { date?: Date };

export interface ShopInfo {
  name: string;
  logoUrl: string;
}

// Funções de conversão para compatibilidade
export function convertServiceToLegacy(service: Service): LegacyService {
  return {
    id: parseInt(service.id.slice(-8), 16), // Converte UUID para número
    name: service.nome,
    description: service.descricao || '',
    price: service.preco,
    duration: service.duracao
  };
}

export function convertBarberToLegacy(barber: Barber): LegacyBarber {
  return {
    id: parseInt(barber.id.slice(-8), 16), // Converte UUID para número
    name: barber.nome,
    avatarUrl: barber.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(barber.nome)}&background=f59e0b&color=fff&size=128`
  };
}