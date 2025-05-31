
import React from 'react';
import { Raffle, Ticket, Participant } from '../types';

interface PdfTicketProps {
  raffle: Raffle;
  ticket: Ticket;
  participant: Participant;
}

// This component is designed to be rendered and captured by html2canvas.
// Styles are inline or simple classes that html2canvas can handle.
const PdfTicket: React.FC<PdfTicketProps> = ({ raffle, ticket, participant }) => {
  return (
    <div id="pdf-ticket-content" style={{ width: '400px', padding: '20px', border: '2px solid #333', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', color: '#000' }}>
      <h1 style={{ textAlign: 'center', color: '#1D4ED8', fontSize: '24px', margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>¡BOLETO DE RIFA!</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        {raffle.itemImageBase64 && (
          <img src={raffle.itemImageBase64} alt={raffle.title} style={{ maxWidth: '100%', height: '150px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px' }} />
        )}
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '18px', color: '#10B981', margin: '10px 0' }}>{raffle.title}</h2>
      <p style={{ fontSize: '12px', textAlign: 'center', color: '#555', marginBottom: '15px' }}>{raffle.description}</p>

      <div style={{ border: '2px dashed #FBBF24', padding: '10px', textAlign: 'center', marginBottom: '15px', backgroundColor: '#FFFBEB' }}>
        <p style={{ fontSize: '14px', margin: '0 0 5px 0' }}>Número Elegido:</p>
        <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#1D4ED8', margin: '0' }}>{ticket.number}</p>
      </div>

      <div style={{ fontSize: '12px', marginBottom: '10px' }}>
        <p><strong>Comprador/a:</strong> {participant.name}</p>
        <p><strong>Celular:</strong> {participant.phone}</p>
        <p><strong>Correo:</strong> {participant.email}</p>
      </div>
      
      <div style={{ fontSize: '12px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <p><strong>Precio del Boleto:</strong> ${raffle.ticketPrice}</p>
        <p><strong>Fecha del Sorteo:</strong> {new Date(raffle.raffleDate + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Juega con:</strong> {raffle.lotteryName}</p>
      </div>

      <p style={{ fontSize: '10px', textAlign: 'center', marginTop: '15px', color: '#777' }}>
        ¡Mucha suerte! Conserva este boleto.
      </p>
    </div>
  );
};

export default PdfTicket;
