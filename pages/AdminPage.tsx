
import React from 'react';
import { Raffle, RaffleCreationData, TicketStatus, Ticket } from '../types';
import AdminRaffleForm from '../components/AdminRaffleForm';
import RaffleGrid from '../components/RaffleGrid';
import RaffleDetailsCard from '../components/RaffleDetailsCard';
import { generateGridScreenshot, generateTicketPdf } from '../services/captureService';
import { CameraIcon, DownloadIcon } from '../components/icons';
import { DEFAULT_GRID_SIZE_PRESET } from '../constants';

interface AdminPageProps {
  activeRaffle?: Raffle;
  onCreateRaffle: (raffleData: RaffleCreationData) => void;
  onUpdateRaffle: (raffleData: RaffleCreationData) => void;
  onMarkTicketAsPaid: (ticketNumber: string) => void;
}

const GRID_SCREENSHOT_ID = 'admin-raffle-grid-screenshot';

const AdminPage: React.FC<AdminPageProps> = ({ activeRaffle, onCreateRaffle, onUpdateRaffle, onMarkTicketAsPaid }) => {
  
  const handleScreenshot = async () => {
    if (activeRaffle) {
      await generateGridScreenshot(GRID_SCREENSHOT_ID, activeRaffle.title);
    } else {
      alert("No hay rifa activa para generar la imagen.");
    }
  };

  const handleMarkAsPaidAndDownload = async (ticket: Ticket) => {
    if (!activeRaffle || !ticket.participant) {
      alert("Error: No se puede procesar el pago sin datos de la rifa o del participante.");
      return;
    }
    onMarkTicketAsPaid(ticket.number);
    // Generate PDF with the current raffle details and participant info from the ticket
    // The state update for the ticket status (PAID) will be reflected in the next render,
    // but for PDF generation, we use the ticket object as it is when clicked.
    // We assume activeRaffle contains the latest general raffle details.
    try {
      await generateTicketPdf(activeRaffle, ticket, ticket.participant);
    } catch (error) {
      console.error("Error generating PDF for paid ticket:", error);
      alert("Hubo un error al generar el PDF del boleto pagado.");
    }
  };

  const reservedCount = activeRaffle?.tickets.filter(t => t.status === TicketStatus.RESERVED).length || 0;
  const availableCount = activeRaffle?.tickets.filter(t => t.status === TicketStatus.AVAILABLE).length || 0;
  const paidCount = activeRaffle?.tickets.filter(t => t.status === TicketStatus.PAID).length || 0;

  const participantTickets = activeRaffle?.tickets.filter(
    t => t.status === TicketStatus.RESERVED || t.status === TicketStatus.PAID
  ) || [];


  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Panel de Administración de Rifas</h1>
        <p className="text-lg text-neutral mt-2">Gestiona los detalles de la rifa y visualiza el estado de los boletos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <AdminRaffleForm 
            onSubmit={activeRaffle ? onUpdateRaffle : onCreateRaffle} 
            initialData={activeRaffle} 
          />
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          {activeRaffle ? (
            <>
             <RaffleDetailsCard raffle={activeRaffle} />
             <div className="p-6 bg-white rounded-xl shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Estado General de Boletos</h3>
                 <p className="text-sm text-gray-600">Disponibles: <span className="font-bold text-green-600">{availableCount}</span></p>
                 <p className="text-sm text-gray-600">Reservados: <span className="font-bold text-red-600">{reservedCount}</span></p>
                 <p className="text-sm text-gray-600">Pagados: <span className="font-bold text-purple-600">{paidCount}</span></p>
                <button
                    onClick={handleScreenshot}
                    className="mt-6 w-full inline-flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-150"
                >
                    <CameraIcon className="w-5 h-5 mr-2"/>
                    Generar Imagen de Cuadrícula
                </button>
                <div className="mt-4 p-2 border border-dashed border-gray-300 rounded-md">
                    <p className="text-xs text-center text-gray-500">La imagen se generará a partir de la cuadrícula de abajo.</p>
                </div>
              </div>
            </>
          ) : (
             <div className="p-6 bg-white rounded-xl shadow-xl text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay rifa activa</h3>
                <p className="text-gray-500">Crea una nueva rifa usando el formulario de la izquierda.</p>
            </div>
          )}
        </div>
      </div>
      
      {activeRaffle && (
        <div className="mt-8 p-4 sm:p-6 bg-white rounded-xl shadow-2xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Reporte de Participantes y Pagos</h3>
          {participantTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Boleto</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celular</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participantTickets.sort((a, b) => parseInt(a.number) - parseInt(b.number)).map(ticket => (
                    <tr key={ticket.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.number}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ticket.participant?.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ticket.participant?.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{ticket.participant?.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === TicketStatus.PAID ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ticket.status === TicketStatus.PAID ? 'Pagado' : 'Reservado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {ticket.status === TicketStatus.RESERVED && (
                          <button
                            onClick={() => handleMarkAsPaidAndDownload(ticket)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                            <DownloadIcon className="w-4 h-4 mr-1.5"/>
                            Marcar Pagado y Descargar
                          </button>
                        )}
                         {ticket.status === TicketStatus.PAID && (
                           <span className="text-green-600 font-semibold">✓ Pagado</span>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No hay boletos reservados o pagados aún.</p>
          )}
        </div>
      )}
        
      {activeRaffle && (
        <div className="mt-12 p-4 sm:p-6 bg-white rounded-xl shadow-2xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Visualización de la Cuadrícula (Admin)</h3>
          <RaffleGrid 
            tickets={activeRaffle.tickets} 
            onSelectTicket={() => {}} 
            id={GRID_SCREENSHOT_ID} 
            gridSizePreset={activeRaffle.gridSizePreset || DEFAULT_GRID_SIZE_PRESET}
          />
           <div className="mt-6 p-4 bg-sky-50 rounded-lg shadow">
                <h4 className="font-semibold text-neutral-700 mb-2">Leyenda:</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center"><span className="w-4 h-4 bg-green-100 border border-gray-300 rounded mr-2"></span><span className="text-gray-700">Disponible</span></div>
                    <div className="flex items-center"><span className="w-4 h-4 bg-red-600 border border-gray-300 rounded mr-2"></span><span className="text-gray-700">Reservado</span></div>
                    <div className="flex items-center"><span className="w-4 h-4 bg-purple-700 border border-gray-300 rounded mr-2"></span><span className="text-gray-700">Pagado</span></div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;