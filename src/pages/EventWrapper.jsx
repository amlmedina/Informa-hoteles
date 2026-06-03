import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useHotels } from '../hooks/useHotels';
import { useEventManager } from '../hooks/useEventManager';

// Importación de Vistas
import HomePage from '../components/hotel/HomePage'; 
import BookingPage from './BookingPage';

import { ShieldCheck, PlaneTakeoff } from 'lucide-react';

const EventWrapper = () => {
  // 🚀 LA MAGIA: Extraemos el ID del evento desde la URL (ej: "abastur-2026")
  const { eventId } = useParams();
  const navigate = useNavigate();

  // HOOKS DE DATOS (En el siguiente paso les enseñaremos a usar el eventId)
  const { loading: authLoading } = useAuth();
  const { hotels: hoteles = [], loading: hotelsLoading } = useHotels() || {};
  const { evento, loading: eventLoading } = useEventManager();

  const [selectedHotel, setSelectedHotel] = useState(null);

  const hotelesParaClientes = hoteles
    .filter(hotel => hotel.ventasPausadas !== true)
    .sort((a, b) => (Number(a.orden) || 99) - (Number(b.orden) || 99));

  if (authLoading || hotelsLoading || eventLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
        <div className="w-16 h-16 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Cargando Evento {eventId}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111] font-sans selection:bg-[#E91E63] selection:text-white">
      
      {/* BARRA DE NAVEGACIÓN GLOBAL */}
      <nav className="bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b border-gray-100 sticky top-0 z-[100] h-20">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => setSelectedHotel(null)}
        >
          <div className="bg-[#111] p-2 rounded-xl group-hover:bg-[#E91E63] transition-colors">
            <PlaneTakeoff className="text-white" size={20} />
          </div>
          <span className="font-black text-2xl italic uppercase tracking-tighter">
            Indipris <span className="text-[#E91E63]">Travel</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')} 
            className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all bg-[#111] text-white hover:bg-[#E91E63]"
          >
            <ShieldCheck size={16}/> Acceso Admin
          </button>
        </div>
      </nav>

      {/* RENDERIZADO DE VISTAS */}
      <main className="min-h-[calc(100vh-80px)]">
        {selectedHotel ? (
          <BookingPage 
            hotelSelected={selectedHotel} 
            onBack={() => setSelectedHotel(null)} 
            eventId={eventId} // Le pasamos el evento a la página de reservas
          />
        ) : (
          <HomePage 
            hoteles={hotelesParaClientes} 
            loading={hotelsLoading} 
            evento={evento}
            onSelectHotel={(hotel) => setSelectedHotel(hotel)} 
          />
        )}
      </main>

      {/* FOOTER */}
      {!selectedHotel && (
        <footer className="bg-white border-t border-gray-100 py-6 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            © 2026 Indipris Travel - Todos los derechos reservados
          </p>
        </footer>
      )}
    </div>
  );
};

export default EventWrapper;