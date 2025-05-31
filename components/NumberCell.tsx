
import React from 'react';
import { Ticket, TicketStatus, GridSizePresetKey } from '../types';
import { GRID_SIZE_PRESETS, DEFAULT_GRID_SIZE_PRESET } from '../constants';

interface NumberCellProps {
  ticket: Ticket;
  onSelect: (ticketNumber: string) => void;
  isSelected: boolean;
  gridSizePreset?: GridSizePresetKey;
}

const NumberCell: React.FC<NumberCellProps> = ({ ticket, onSelect, isSelected, gridSizePreset = DEFAULT_GRID_SIZE_PRESET }) => {
  const { number, status } = ticket;
  const sizeClasses = GRID_SIZE_PRESETS[gridSizePreset] || GRID_SIZE_PRESETS[DEFAULT_GRID_SIZE_PRESET];

  const isDisabled = status === TicketStatus.RESERVED || status === TicketStatus.PAID;

  let baseCellClasses = 'flex items-center justify-center border border-gray-300 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform';
  let cellStatusClasses = '';
  let textStatusClasses = sizeClasses.font; // Apply font size from preset

  if (isDisabled) {
    baseCellClasses += ' cursor-not-allowed opacity-80';
  } else {
    baseCellClasses += ' hover:scale-105 cursor-pointer';
  }
  
  if (status === TicketStatus.RESERVED) {
    cellStatusClasses = 'bg-red-600'; 
    textStatusClasses += ' text-yellow-300'; 
  } else if (status === TicketStatus.PAID) {
    cellStatusClasses = 'bg-purple-700'; 
    textStatusClasses += ' text-white';
  } else if (status === TicketStatus.AVAILABLE) {
    if (isSelected) {
      cellStatusClasses = 'bg-blue-600 ring-4 ring-blue-400'; 
      textStatusClasses += ' text-white';
    } else {
      cellStatusClasses = 'bg-green-100 hover:bg-green-200'; 
      textStatusClasses += ' text-blue-900'; 
    }
  } else { 
     cellStatusClasses = 'bg-gray-200';
     textStatusClasses += ' text-gray-700';
  }
  
  const handleClick = () => {
    if (status === TicketStatus.AVAILABLE) {
      onSelect(number);
    }
  };

  const finalCellClasses = `${baseCellClasses} ${sizeClasses.cell} ${cellStatusClasses}`;
  
  let ariaLabelStatus = '';
  switch(status) {
    case TicketStatus.AVAILABLE: ariaLabelStatus = 'Disponible'; break;
    case TicketStatus.RESERVED: ariaLabelStatus = 'Reservado'; break;
    case TicketStatus.PAID: ariaLabelStatus = 'Pagado'; break;
    case TicketStatus.SELECTED: ariaLabelStatus = 'Seleccionado'; break;
    default: ariaLabelStatus = 'Estado desconocido';
  }


  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={finalCellClasses}
      aria-label={`Número ${number}, estado: ${ariaLabelStatus}`}
    >
      <span className={textStatusClasses}>{number}</span>
    </button>
  );
};

export default NumberCell;