
import React from 'react';
import { Raffle } from '../types';
import { TicketIcon, CalendarIcon, PriceIcon, LotteryIcon, ImageIcon } from './icons';

interface RaffleDetailsCardProps {
  raffle?: Raffle;
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; valuePrefix?: string }> = ({ icon, label, value, valuePrefix }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
    <div className="flex-shrink-0 w-8 h-8 text-primary">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{valuePrefix}{value}</p>
    </div>
  </div>
);

const RaffleDetailsCard: React.FC<RaffleDetailsCardProps> = ({ raffle }) => {
  if (!raffle) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-xl text-center">
        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay rifa activa</h3>
        <p className="text-gray-500">Por favor, dirígete a la sección de administrador para crear una nueva rifa.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl shadow-xl space-y-6 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-center text-primary mb-2 tracking-tight">{raffle.title}</h2>
      
      {raffle.itemImageBase64 && (
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
          <img src={raffle.itemImageBase64} alt={raffle.title} className="object-cover w-full h-full" />
        </div>
      )}
      
      <p className="text-gray-700 text-center leading-relaxed px-2">{raffle.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <InfoItem icon={<PriceIcon className="w-full h-full"/>} label="Precio del Boleto" value={raffle.ticketPrice} valuePrefix="$" />
        <InfoItem icon={<TicketIcon className="w-full h-full"/>} label="Boletos Totales" value={raffle.tickets.length} />
        <InfoItem icon={<CalendarIcon className="w-full h-full"/>} label="Fecha del Sorteo" value={new Date(raffle.raffleDate + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} />
        <InfoItem icon={<LotteryIcon className="w-full h-full"/>} label="Juega con" value={raffle.lotteryName} />
      </div>
    </div>
  );
};

export default RaffleDetailsCard;
