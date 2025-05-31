
export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SELECTED = 'SELECTED', // For UI indication before reservation
  PAID = 'PAID', // Nuevo estado para boletos pagados
}

export interface Participant {
  name: string;
  phone: string;
  email: string;
}

export interface Ticket {
  id: string;
  number: string; // 00-99
  status: TicketStatus;
  participant?: Participant;
}

export type GridSizePresetKey = 'compact' | 'regular' | 'large';

export interface Raffle {
  id: string;
  title: string;
  description: string;
  itemImageBase64?: string; // Base64 string for the image
  ticketPrice: number;
  raffleDate: string;
  lotteryName: string;
  tickets: Ticket[];
  gridSizePreset?: GridSizePresetKey;
}

export interface RaffleCreationData {
  title: string;
  description:string;
  itemImageBase64?: string;
  ticketPrice: string; // Input as string
  raffleDate: string;
  lotteryName: string;
  gridSizePreset?: GridSizePresetKey;
}