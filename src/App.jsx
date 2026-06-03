import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useHotels } from './hooks/useHotels';
import { useEventManager } from './hooks/useEventManager';

// Importación de Vistas
import HomePage from './components/hotel/HomePage'; 
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';

// Iconos
import { ShieldCheck, Layout, PlaneTakeoff } from 'lucide-react';

const App = () => {
  const { loading: authLoading } = useAuth();
  const { hotels: hoteles = [], loading: hotelsLoading } = useHotels() || {};
  const { evento, loading: eventLoading } = useEventManager();

  const [view, setView] = useState('client');
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleAdminAccess = () => {
    if (view === 'admin') {
      setView('client');
    } else {
      const pass = prompt("Introduce la clave del panel:");
      if (pass === "indipris2026") {
        setView('admin');
        setSelectedHotel(null); 
      } else {
        alert("Clave incorrecta");
      }
    }
  };

  const handleHotelSelection = (hotel) => {
    setSelectedHotel(hotel);
  };

  const hotelesParaClientes = hoteles
    .filter(hotel => hotel.ventasPausadas !== true)
    .sort((a, b) => (Number(a.orden) || 99) - (Number(b.orden) || 99));

  if (authLoading || hotelsLoading || eventLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
        <div className="w-16 h-16 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Indipris Travel Engine</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111] font-sans selection:bg-[#E91E63] selection:text-white">
      
      <nav className="bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b border-gray-100 sticky top-0 z-[100] h-20">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => { setSelectedHotel(null); setView('client'); }}
        >
          {evento?.logoUrl ? (
            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1.5 border border-gray-100 shadow-sm transition-transform group-hover:scale-105 duration-300">
              <img src={evento.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="bg-[#111] p-2 rounded-xl group-hover:bg-[#E91E63] transition-colors">
              <PlaneTakeoff className="text-white" size={20} />
            </div>
          )}
          <span className="font-black text-2xl italic uppercase tracking-tighter">
            Indipris <span className="text-[#E91E63]">Travel</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleAdminAccess} 
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
              view === 'admin' ? 'bg-yellow-400 text-[#111]' : 'bg-[#111] text-white hover:bg-[#E91E63]'
            }`}
          >
            {view === 'client' ? <ShieldCheck size={16}/> : <Layout size={16}/>}
            {view === 'client' ? 'Acceso Admin' : 'Panel de Control'}
          </button>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-80px)]">
        {view === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            {selectedHotel ? (
              <BookingPage 
                hotelSelected={selectedHotel} 
                onBack={() => setSelectedHotel(null)} 
              />
            ) : (
              <HomePage 
                hoteles={hotelesParaClientes} 
                loading={hotelsLoading} 
                evento={evento} // 🚀 Pasamos el evento para la cabecera y el mapa
                onSelectHotel={handleHotelSelection} 
              />
            )}
          </>
        )}
      </main>

      {view === 'client' && !selectedHotel && (
        <footer className="bg-white border-t border-gray-100 py-6 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            powered by orbix
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;