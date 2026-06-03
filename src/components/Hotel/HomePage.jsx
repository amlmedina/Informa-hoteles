import React from 'react';
import HotelCard from './HotelCard';
import HotelsMap from './HotelsMap';
import { MapPin, Calendar, Loader2, ExternalLink } from 'lucide-react';

const HomePage = ({ hoteles, loading, evento, onSelectHotel }) => {

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-black text-[#E91E63]">
      <Loader2 className="animate-spin mb-4" size={40} />
      <span className="text-[10px] uppercase tracking-[0.4em]">Sincronizando...</span>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-gray-50/30 animate-in fade-in duration-500">
      
      {/* HEADER DEL EVENTO */}
      <section className="bg-white border-b border-gray-100 px-6 py-8 md:px-12 md:py-10 flex-shrink-0 relative z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-10">
          {evento?.logoUrl && (
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] shadow-xl overflow-hidden flex-shrink-0 border-4 border-gray-50 p-3">
              <img src={evento.logoUrl} alt="Logo Evento" className="w-full h-full object-contain" />
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <span className="bg-[#111] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.3em] mb-4 inline-block">Hospedaje Oficial</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] uppercase italic tracking-tighter leading-none mb-5">
              {evento?.nombre || "Evento Indipris"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#111] font-bold text-[10px] md:text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl">
                <Calendar size={16} className="text-[#E91E63]" />
                {evento?.fechaInicio} - {evento?.fechaFin}
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl">
                <MapPin size={16} className="text-[#E91E63]" />
                {evento?.direccion || "Sede por definir"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* COLUMNA IZQUIERDA: HOTELES Y PUBLICIDAD DINÁMICA */}
        <section className="w-full lg:w-[60%] overflow-y-auto p-6 md:p-10 custom-scrollbar">
          
          {/* 🚀 BANNER 1: TOTALMENTE DINÁMICO DESDE FIREBASE */}
          {evento?.banner1Url && (
            <div className="mb-10 animate-in slide-in-from-top duration-700">
              <a 
                href={evento?.linkPublicidad1 || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block group"
              >
                <div className="relative w-full h-32 md:h-44 rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-white bg-white flex items-center justify-center p-6">
                  <img 
                    src={evento.banner1Url} 
                    alt="Publicidad Oficial" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-6 bg-black/5 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-black/5">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Patrocinador Oficial</span>
                    <ExternalLink size={10} className="text-gray-400" />
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* GRID DE HOTELES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {hoteles.map((hotel) => (
              <HotelCard 
                key={hotel.id} 
                hotel={hotel} 
                onClick={() => onSelectHotel(hotel)} 
              />
            ))}
          </div>

          {/* 🚀 BANNER 2: DINÁMICO AL FINAL */}
          {evento?.banner2Url && (
            <div className="mt-10 mb-20 animate-in fade-in duration-1000">
              <div className="w-full h-24 md:h-32 rounded-[2rem] overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                <img 
                  src={evento.banner2Url} 
                  alt="Publicidad Secundaria" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <p className="text-center text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mt-4 italic">Espacio Publicitario</p>
            </div>
          )}
        </section>

        {/* COLUMNA DERECHA: MAPA */}
        <section className="hidden lg:block w-[40%] bg-gray-200 border-l border-gray-100 relative h-full">
          <HotelsMap 
            hoteles={hoteles} 
            evento={evento} 
            onSelectHotel={onSelectHotel} 
          />
        </section>
      </div>
    </div>
  );
};

export default HomePage;