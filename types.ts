export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface Barber {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface Appointment {
  service: Service;
  barber: Barber;
  date: Date;
  time: string;
  clientName: string;
  clientPhone: string;
}

export type PartialAppointment = Partial<Omit<Appointment, 'date'>> & { date?: Date };

export interface ShopInfo {
  name: string;
  logoUrl: string;
}