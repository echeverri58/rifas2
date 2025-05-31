
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Raffle, Ticket, Participant, TicketStatus, RaffleCreationData } from './types';
import { TOTAL_TICKETS, DEFAULT_RAFFLE_DETAILS, APP_TITLE, DEFAULT_GRID_SIZE_PRESET } from './constants';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import { AdminIcon, UserIcon } from './components/icons';

// Helper to initialize tickets for a raffle
const initializeTickets = (): Ticket[] => {
  return Array.from({ length: TOTAL_TICKETS }, (_, i) => {
    const number = i.toString().padStart(2, '0');
    return {
      id: `ticket-${number}`,
      number,
      status: TicketStatus.AVAILABLE,
    };
  });
};

const App: React.FC = () => {
  const [activeRaffle, setActiveRaffle] = useState<Raffle | undefined>(() => {
    const savedRaffle = localStorage.getItem('activeRaffle');
    if (savedRaffle) {
      try {
        const parsedRaffle = JSON.parse(savedRaffle) as Raffle;
        if (!parsedRaffle.tickets || parsedRaffle.tickets.length !== TOTAL_TICKETS) {
          parsedRaffle.tickets = initializeTickets();
        }
        parsedRaffle.tickets.forEach(ticket => {
          if (!Object.values(TicketStatus).includes(ticket.status)) {
            ticket.status = TicketStatus.AVAILABLE; // Reset invalid status
            delete ticket.participant;
          }
          // Ensure tickets that are not AVAILABLE but lack participant are reset
          if (ticket.status !== TicketStatus.AVAILABLE && !ticket.participant) {
             ticket.status = TicketStatus.AVAILABLE;
          }
        });
        parsedRaffle.gridSizePreset = parsedRaffle.gridSizePreset || DEFAULT_GRID_SIZE_PRESET;
        return parsedRaffle;
      } catch (e) {
        console.error("Failed to parse saved raffle, using default:", e);
      }
    }
    return {
      ...DEFAULT_RAFFLE_DETAILS, 
      tickets: initializeTickets(),
    };
  });

  useEffect(() => {
    if (activeRaffle) {
      localStorage.setItem('activeRaffle', JSON.stringify(activeRaffle));
    } else {
      localStorage.removeItem('activeRaffle');
    }
  }, [activeRaffle]);

  const handleCreateRaffle = (raffleData: RaffleCreationData) => {
    const newRaffle: Raffle = {
      id: `raffle-${Date.now()}`,
      title: raffleData.title,
      description: raffleData.description,
      itemImageBase64: raffleData.itemImageBase64,
      ticketPrice: parseFloat(raffleData.ticketPrice),
      raffleDate: raffleData.raffleDate,
      lotteryName: raffleData.lotteryName,
      tickets: initializeTickets(),
      gridSizePreset: raffleData.gridSizePreset || DEFAULT_GRID_SIZE_PRESET,
    };
    setActiveRaffle(newRaffle);
     alert(`Rifa "${newRaffle.title}" creada exitosamente!`);
  };
  
  const handleUpdateRaffle = (raffleData: RaffleCreationData) => {
    if (!activeRaffle) {
        alert("No hay rifa activa para actualizar.");
        return;
    }
    const updatedRaffle: Raffle = {
        ...activeRaffle, 
        title: raffleData.title,
        description: raffleData.description,
        itemImageBase64: raffleData.itemImageBase64,
        ticketPrice: parseFloat(raffleData.ticketPrice),
        raffleDate: raffleData.raffleDate,
        lotteryName: raffleData.lotteryName,
        gridSizePreset: raffleData.gridSizePreset || activeRaffle.gridSizePreset || DEFAULT_GRID_SIZE_PRESET,
    };
    setActiveRaffle(updatedRaffle);
    alert(`Rifa "${updatedRaffle.title}" actualizada exitosamente!`);
  };

  const handleReserveTicket = (ticketNumber: string, participant: Participant) => {
    setActiveRaffle(prevRaffle => {
      if (!prevRaffle) return undefined;
      return {
        ...prevRaffle,
        tickets: prevRaffle.tickets.map(ticket =>
          ticket.number === ticketNumber
            ? { ...ticket, status: TicketStatus.RESERVED, participant }
            : ticket
        ),
      };
    });
  };

  const handleMarkTicketAsPaid = (ticketNumber: string) => {
    setActiveRaffle(prevRaffle => {
      if (!prevRaffle) return undefined;
      return {
        ...prevRaffle,
        tickets: prevRaffle.tickets.map(ticket =>
          ticket.number === ticketNumber && ticket.status === TicketStatus.RESERVED
            ? { ...ticket, status: TicketStatus.PAID } // Participant info is preserved
            : ticket
        ),
      };
    });
  };

  const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out text-sm font-medium
         ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-blue-100 hover:text-primary'}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <HashRouter>
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-emerald-100 to-violet-100 flex flex-col">
        <nav className="bg-white shadow-md sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <NavLink to="/" className="flex-shrink-0">
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    {APP_TITLE}
                  </span>
                </NavLink>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <NavItem to="/" icon={<UserIcon className="w-5 h-5" />} label="Participar" />
                <NavItem to="/admin" icon={<AdminIcon className="w-5 h-5" />} label="Administrar" />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<UserPage activeRaffle={activeRaffle} onReserveTicket={handleReserveTicket} />} />
            <Route 
              path="/admin" 
              element={
                <AdminPage 
                  activeRaffle={activeRaffle} 
                  onCreateRaffle={handleCreateRaffle} 
                  onUpdateRaffle={handleUpdateRaffle}
                  onMarkTicketAsPaid={handleMarkTicketAsPaid} 
                />
              } 
            />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
          <p>&copy; {new Date().getFullYear()} {APP_TITLE}. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-400 mt-1">Creado con ❤️ para la comunidad.</p>
        </footer>
      </div>
      <div id="pdf-ticket-render-area" style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -1, width:'1px', height:'1px', overflow:'hidden' }}></div>
    </HashRouter>
  );
};

export default App;