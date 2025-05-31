
import React, { useState, useEffect } from 'react';
import { Raffle, Ticket, Participant, TicketStatus } from '../types';
import RaffleGrid from '../components/RaffleGrid';
import RaffleDetailsCard from '../components/RaffleDetailsCard';
import ReservationModal from '../components/ReservationModal';
import { generateTicketPdf, generateFullPageScreenshot } from '../services/captureService';
import { DownloadIcon, CameraIcon } from '../components/icons';
import { DEFAULT_GRID_SIZE_PRESET } from '../constants';

interface UserPageProps {
  activeRaffle?: Raffle;
  onReserveTicket: (ticketNumber: string, participant: Participant) => void;
}

const UserPage: React.FC<UserPageProps> = ({ activeRaffle, onReserveTicket }) => {
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<Ticket | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [lastReservedTicket, setLastReservedTicket] = useState<{ ticket: Ticket, participant: Participant } | null>(null);
  const [selectedGridTicketNumber, setSelectedGridTicketNumber] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedTicketForModal) {
      setShowReservationModal(true);
    } else {
      setShowReservationModal(false);
    }
  }, [selectedTicketForModal]);

  const handleSelectTicket = (ticketNumber: string) => {
    if (!activeRaffle) return;
    const ticket = activeRaffle.tickets.find(t => t.number === ticketNumber);
    if (ticket && ticket.status === TicketStatus.AVAILABLE) {
      setSelectedTicketForModal(ticket);
      setSelectedGridTicketNumber(ticketNumber);
    }
  };

  const handleCloseModal = () => {
    setSelectedTicketForModal(null);
    setShowReservationModal(false);
    setSelectedGridTicketNumber(undefined); // Clear selection on modal close
  };

  const handleReserveTicket = (ticketNumber: string, participant: Participant) => {
    onReserveTicket(ticketNumber, participant);
    const reservedTicket = activeRaffle?.tickets.find(t => t.number === ticketNumber);
    if(reservedTicket && activeRaffle) {
      const updatedReservedTicket = { ...reservedTicket, participant, status: TicketStatus.RESERVED };
      setLastReservedTicket({ ticket: updatedReservedTicket, participant });
    }
    handleCloseModal();
  };

  const handleDownloadTicket = async () => {
    if (lastReservedTicket && activeRaffle) {
      try {
        await generateTicketPdf(activeRaffle, lastReservedTicket.ticket, lastReservedTicket.participant);
        setLastReservedTicket(null); 
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Hubo un error al generar el PDF del boleto.");
      }
    }
  };

  const handleFullPageScreenshot = async () => {
    try {
      await generateFullPageScreenshot(`vista_rifa_${activeRaffle?.title.replace(/\s+/g, '_') || 'general'}_`);
    } catch (error) {
      console.error("Error generating full page screenshot:", error);
      alert("Hubo un error al generar la captura de pantalla.");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Participa en Nuestra Rifa</h1>
        <p className="text-lg text-neutral mt-2">¡Elige tu número de la suerte y gana!</p>
      </header>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={handleFullPageScreenshot}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
          title="Capturar vista actual de la página como imagen PNG"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Capturar Vista Actual
        </button>
      </div>

      {activeRaffle ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Selecciona tus Números</h3>
            <RaffleGrid 
              tickets={activeRaffle.tickets} 
              onSelectTicket={handleSelectTicket}
              selectedTicketNumber={selectedGridTicketNumber}
              gridSizePreset={activeRaffle.gridSizePreset || DEFAULT_GRID_SIZE_PRESET}
            />
            <div className="mt-6 p-4 bg-sky-50 rounded-lg shadow">
                <h4 className="font-semibold text-neutral-700 mb-2">Leyenda:</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center"><span className="w-4 h-4 bg-green-100 border border-gray-300 rounded mr-2"></span><span className="text-gray-700">Disponible</span></div>
                    <div className="flex items-center"><span className="w-4 h-4 bg-blue-600 border border-gray-300 rounded mr-2"></span><span className="text-gray-700">Seleccionado</span></div>
                    <div className="flex items-center"><span className="w-4 h-4 bg-red-600 border border-gray-300 rounded mr-2"></span><span className="text-gray-700">Reservado</span></div>
                </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <RaffleDetailsCard raffle={activeRaffle} />
            {lastReservedTicket && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-accent rounded-xl shadow-lg text-center">
                <h4 className="text-xl font-semibold text-accent">¡Boleto #{lastReservedTicket.ticket.number} Reservado!</h4>
                <p className="text-gray-700 my-2">Gracias, {lastReservedTicket.participant.name}.</p>
                <button
                  onClick={handleDownloadTicket}
                  className="mt-2 inline-flex items-center justify-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Descargar Boleta
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Actualmente no hay ninguna rifa activa. Por favor, vuelve más tarde.</p>
        </div>
      )}

      {showReservationModal && selectedTicketForModal && activeRaffle && (
        <ReservationModal
          raffle={activeRaffle}
          ticket={selectedTicketForModal}
          onClose={handleCloseModal}
          onReserve={handleReserveTicket}
        />
      )}
    </div>
  );
};

export default UserPage;