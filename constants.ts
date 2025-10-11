import type { Service, Barber } from './types';

export const INITIAL_SERVICES: Service[] = [
  { id: 1, name: 'Corte de Cabelo', description: 'Corte moderno e estilizado com tesoura e máquina.', price: 50, duration: 45 },
  { id: 2, name: 'Barba', description: 'Modelagem e aparo da barba com toalha quente e navalha.', price: 40, duration: 30 },
  { id: 3, name: 'Combo (Corte + Barba)', description: 'O pacote completo para um visual impecável.', price: 85, duration: 75 },
  { id: 4, name: 'Pezinho', description: 'Acabamento profissional do corte, contorno e nuca.', price: 20, duration: 15 },
  { id: 5, name: 'Hidratação de Barba', description: 'Tratamento com óleos especiais para fortalecer e dar brilho à barba.', price: 30, duration: 20 },
];

export const INITIAL_BARBERS: Barber[] = [
  { id: 1, name: 'Jonas "Navalha"', avatarUrl: 'https://i.pravatar.cc/150?u=jonas' },
  { id: 2, name: 'Ricardo "Tesoura"', avatarUrl: 'https://i.pravatar.cc/150?u=ricardo' },
  { id: 3, name: 'Fernando "Estilo"', avatarUrl: 'https://i.pravatar.cc/150?u=fernando' },
  { id: 4, name: 'Lucas "Máquina"', avatarUrl: 'https://i.pravatar.cc/150?u=lucas' },
];

export const TIME_SLOTS: string[] = [
  '09:00', '09:45', '10:30', '11:15',
  '13:00', '13:45', '14:30', '15:15',
  '16:00', '16:45', '17:30', '18:15',
];