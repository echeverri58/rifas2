
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Raffle, Ticket, Participant } from '../types';
import PdfTicket from '../components/PdfTicket'; // Assuming this is the component for ticket layout
import React from 'react';
import ReactDOM from 'react-dom/client';

export const generateTicketPdf = async (raffle: Raffle, ticket: Ticket, participant: Participant): Promise<void> => {
  const ticketElementId = 'pdf-ticket-render-area';
  let renderDiv = document.getElementById(ticketElementId);

  if (!renderDiv) {
    console.error('PDF render area not found. PDF generation might fail.');
    // Fallback: create it, though it should exist from App.tsx
    renderDiv = document.createElement('div');
    renderDiv.id = ticketElementId;
    renderDiv.style.position = 'absolute';
    renderDiv.style.left = '-9999px';
    renderDiv.style.top = '-9999px';
    document.body.appendChild(renderDiv);
  }
  
  const root = ReactDOM.createRoot(renderDiv);
  // Wrap PdfTicket in a fragment or div if it's the direct child for unmounting
  root.render(React.createElement('div', null, React.createElement(PdfTicket, { raffle, ticket, participant })));

  await new Promise(resolve => setTimeout(resolve, 500)); // Allow time for rendering

  const contentToCapture = renderDiv.querySelector('#pdf-ticket-content') as HTMLElement;

  if (!contentToCapture) {
    console.error('PDF ticket content not found within render area.');
    root.unmount(); // Clean up React root
    return;
  }

  try {
    const canvas = await html2canvas(contentToCapture, {
      scale: 2, 
      useCORS: true, 
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px', 
      format: [canvas.width, canvas.height] 
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`boleto_rifa_${raffle.title.replace(/\s+/g, '_')}_${ticket.number}.pdf`);
  } catch (error) {
    console.error("Error generating PDF: ", error);
    alert("Hubo un error al generar el PDF del boleto.");
  } finally {
    root.unmount(); // Clean up React root
    // Do not remove renderDiv if it's the static one from App.tsx
  }
};


export const generateGridScreenshot = async (gridElementId: string, raffleTitle: string): Promise<void> => {
  const gridElement = document.getElementById(gridElementId);
  if (!gridElement) {
    alert('No se pudo encontrar el elemento de la cuadrícula para capturar.');
    console.error('Grid element not found for screenshot:', gridElementId);
    return;
  }

  try {
    const canvas = await html2canvas(gridElement, { 
      scale: 2,
      backgroundColor: '#ffffff', 
      useCORS: true,
      logging: false,
    });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `estado_rifa_${raffleTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error al generar la captura de pantalla de la cuadrícula:', error);
    alert('Ocurrió un error al generar la imagen. Revisa la consola para más detalles.');
  }
};

export const generateFullPageScreenshot = async (filenamePrefix: string): Promise<void> => {
  try {
    const canvas = await html2canvas(document.documentElement, {
      scale: 1.5, // Adjust scale as needed for balance between quality and performance
      useCORS: true,
      logging: false,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${filenamePrefix}${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error al generar la captura de pantalla completa:', error);
    alert('Ocurrió un error al generar la imagen de la página. Revisa la consola para más detalles.');
  }
};