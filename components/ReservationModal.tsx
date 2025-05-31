
import React, { useState } from 'react';
import { Participant, Raffle, Ticket } from '../types';
import { UserIcon, PhoneIcon, EmailIcon } from './icons';

interface ReservationModalProps {
  raffle: Raffle;
  ticket: Ticket;
  onClose: () => void;
  onReserve: (ticketNumber: string, participant: Participant) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ raffle, ticket, onClose, onReserve }) => {
  const [participant, setParticipant] = useState<Participant>({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Partial<Participant>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipant({ ...participant, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Participant> = {};
    if (!participant.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!participant.phone.trim()) newErrors.phone = 'El celular es obligatorio.';
    else if (!/^\d{7,15}$/.test(participant.phone.trim())) newErrors.phone = 'Número de celular inválido.';
    if (!participant.email.trim()) newErrors.email = 'El correo es obligatorio.';
    else if (!/\S+@\S+\.\S+/.test(participant.email.trim())) newErrors.email = 'Correo electrónico inválido.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onReserve(ticket.number, participant);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2 text-center">Reservar Boleto #{ticket.number}</h2>
        <p className="text-center text-neutral mb-6">Estás a punto de reservar el boleto para la rifa: <strong className="text-accent">{raffle.title}</strong>.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                value={participant.name}
                onChange={handleChange}
                className={`mt-1 block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Ej: Ana Pérez"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Número de Celular</label>
             <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={participant.phone}
                onChange={handleChange}
                className={`mt-1 block w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Ej: 3001234567"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={participant.email}
                onChange={handleChange}
                className={`mt-1 block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                placeholder="Ej: ana.perez@correo.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto flex-1 justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral transition duration-150"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex-1 justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150"
            >
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
