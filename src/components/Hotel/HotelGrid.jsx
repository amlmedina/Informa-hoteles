import React from 'react';
import HotelCard from './HotelCard';
import { useEventManager } from '../../hooks/useEventManager';
import { MapPin, Calendar, Trophy, Map as MapIcon } from 'lucide-react';

const HomePage = ({ hoteles, loading, onSelectHotel }) => {
  const { evento, loading: eventLoading } = useEventManager();

  if (loading || eventLoading) return (
    <div className="min-h-screen flex items-center justify-center font-black text-[#E91E63] animate-pulse">
      CARGANDO EXPERIENCIA...
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100-80px)]">
      
      {/* 1. SECCIÓN SUPERIOR: INFORMACIÓN DEL EVENTO */}
      <section className="bg-white border-b border-gray-100 p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Logo del Evento */}
          {evento?.logoUrl && (
            <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
              <img src={evento.logoUrl} alt="Logo Evento" className="w-full h-full object-contain p-2" />
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="bg-[#E91E63] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Sede Oficial
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#111] uppercase italic tracking-tighter">
              {evento?.nombre || "Cargando Evento..."}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-gray-500 font-bold text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#E91E63]" />
                {evento?.fechaInicio} al {evento?.fechaFin}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#E91E63]" />
                {evento?.direccion}
              </div>
            </div>
          </div>

          <div className="hidden lg:block text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Organizado por</p>
            <p className="font-black text-xl italic text-[#111]">Indipris <span className="text-[#E91E63]">Travel</span></p>
          </div>
        </div>
      </section>

      {/* 2. CONTENIDO PRINCIPAL: 60% LISTA / 40% MAPA */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-250px)]">
        
        {/* LADO IZQUIERDO: LISTA DE HOTELES (60%) */}
        <section className="w-full lg:w-[60%] overflow-y-auto p-8 scrollbar-hide">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black italic">Hoteles <span className="text-[#E91E63]">Disponibles</span></h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tarifas preferenciales para asistentes</p>
            </div>
            <p className="text-sm font-black text-gray-500">{hoteles?.length} opciones encontradas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hoteles.map((hotel) => (
              <HotelCard 
                key={hotel.id} 
                hotel={hotel} 
                onClick={() => onSelectHotel(hotel)} 
              />
            ))}
          </div>
        </section>

        {/* LADO DERECHO: RESERVADO PARA EL MAPA (40%) */}
        <section className="hidden lg:flex w-[40%] bg-gray-100 border-l border-gray-200 relative items-center justify-center overflow-hidden">
          {/* Fondo decorativo que simula un mapa */}
          <div className="absolute inset-0 opacity-20 pointer-events-none grayscale">
            <div className="w-full h-full bg-[url('https://www.google.com/maps/d/u/0/thumbnail?mid=1_f7_oA8e6_t_P1UeA4J-I0z_F0E')] bg-cover"></div>
          </div>
          
          <div className="relative z-10 text-center p-10 bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white mx-10">
            <div className="bg-[#111] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MapIcon size={30} />
            </div>
            <h3 className="font-black uppercase tracking-tighter text-xl mb-2">Mapa Interactivo</h3>
            <p className="text-gray-500 text-xs font-bold leading-relaxed">
              Estamos integrando la vista geográfica para que visualices la cercanía de los hoteles a 
              <span className="text-[#E91E63]"> {evento?.nombre}</span>.
            </p>
            <div className="mt-6 inline-block px-6 py-2 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-200">
              Próximamente
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;