
import { GridSizePresetKey } from './types';

export const TOTAL_TICKETS = 100;
export const GRID_COLS = 10;
export const APP_TITLE = "Las rifas de Echeverry";

export interface GridSizeClasses {
  cell: string;
  font: string;
}

export const GRID_SIZE_PRESETS: Record<GridSizePresetKey, GridSizeClasses> = {
  compact: { cell: 'w-10 h-10 md:w-11 md:h-11', font: 'text-sm font-medium' },
  regular: { cell: 'w-12 h-12 md:w-14 md:h-14', font: 'text-base font-semibold' },
  large: { cell: 'w-14 h-14 md:w-16 md:h-16', font: 'text-lg font-bold' },
};

export const DEFAULT_GRID_SIZE_PRESET: GridSizePresetKey = 'compact';

export const DEFAULT_RAFFLE_DETAILS = {
  id: 'default-raffle-123',
  title: 'Gran Rifa Increíble',
  description: 'Participa para ganar un fabuloso premio. ¡No te quedes fuera!',
  itemImageBase64: 'https://picsum.photos/seed/raffleitem/600/400', // Placeholder
  ticketPrice: 5,
  raffleDate: '2024-12-31',
  lotteryName: 'Lotería Nacional Nocturna',
  gridSizePreset: DEFAULT_GRID_SIZE_PRESET,
};