
import React from 'react';
import { Ticket, GridSizePresetKey } from '../types';
import NumberCell from './NumberCell';
import { DEFAULT_GRID_SIZE_PRESET } from '../constants';

interface RaffleGridProps {
  tickets: Ticket[];
  onSelectTicket: (ticketNumber: string) => void;
  selectedTicketNumber?: string;
  id?: string; // For screenshot targeting
  gridSizePreset?: GridSizePresetKey;
}

const RaffleGrid: React.FC<RaffleGridProps> = ({ tickets, onSelectTicket, selectedTicketNumber, id, gridSizePreset = DEFAULT_GRID_SIZE_PRESET }) => {
  if (!tickets || tickets.length === 0) {
    return <p className="text-center text-gray-500">No hay boletos para mostrar.</p>;
  }
  return (
    <div id={id} className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 p-4 bg-white rounded-xl shadow-lg">
      {tickets.map((ticket) => (
        <NumberCell
          key={ticket.id}
          ticket={ticket}
          onSelect={onSelectTicket}
          isSelected={ticket.number === selectedTicketNumber}
          gridSizePreset={gridSizePreset}
        />
      ))}
    </div>
  );
};

export default RaffleGrid;