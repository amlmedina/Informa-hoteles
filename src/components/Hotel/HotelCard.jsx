import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, MapPin, Star } from 'lucide-react';

const HotelCard = ({ hotel, selectedDate, onClick }) => {
  
  // 1. FILTRO DE IMAGEN
  let imagenSegura = hotel.imagen;
  if (!imagenSegura || !imagenSegura.startsWith('http')) {
    imagenSegura = "https://images.unsplash.com/photo-1551882547-ff40c0d509af?auto=format&fit=crop&w=800&q=80";
  }

  // 🚀 2. EXTRACCIÓN DE DATOS "INTELIGENTE"
  let dayData;
  
  // CASO A: Hay una fecha seleccionada y existe en el inventario
  if (selectedDate && hotel.stock_por_dia?.[selectedDate]) {
    dayData = hotel.stock_por_dia[selectedDate];
  } 
  // CASO B: No hay fecha (estamos en la Home) pero hay stock cargado en el calendario
  else if (hotel.stock_por_dia && Object.keys(hotel.stock_por_dia).length > 0) {
    // Tomamos la primera fecha disponible para mostrar el precio y stock inicial
    const fechasOrdenadas = Object.keys(hotel.stock_por_dia).sort();
    dayData = hotel.stock_por_dia[fechasOrdenadas[0]];
  }
  // CASO C: No hay nada en el calendario, usamos los datos base del hotel
  else {
    dayData = { 
      disponible: Number(hotel.disponible) || 0, 
      precioSencilla: Number(hotel.precioSencilla) || 0, 
      precioDoble: Number(hotel.precioDoble) || 0 
    };
  }

  const isPausado = hotel.ventasPausadas === true;
  const hasStock = Number(dayData.disponible) > 0;
  const canBook = hasStock && !isPausado;

  return (
    <div className={`bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-2 transition-all duration-300 flex flex-col ${
      canBook ? 'border-transparent hover:shadow-2xl' : 'border-gray-100 opacity-95'
    }`}>
      
      {/* Contenedor de Imagen */}
      <div className="relative h-64 bg-gray-100">
        <img src={imagenSegura} className="w-full h-full object-cover" alt={hotel.nombre} />
        
        {/* CATEGORÍA */}
        <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[9px] font-black text-white uppercase">{hotel.estrellas || '5 Estrellas'}</span>
        </div>

        {isPausado && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-[#FFD600] text-black px-6 py-2 rounded-full font-black flex items-center gap-2 shadow-2xl">
              <AlertTriangle size={16} /> VENTAS PAUSADAS
            </div>
          </div>
        )}

        {!isPausado && (
          <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 ${
            hasStock ? 'bg-white text-green-600' : 'bg-red-500 text-white'
          }`}>
            {hasStock ? (
              <><CheckCircle2 size={12}/> {dayData.disponible} DISPONIBLES</>
            ) : (
              <><XCircle size={12}/> AGOTADO</>
            )}
          </div>
        )}
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-3xl font-black text-[#111] uppercase tracking-tighter mb-1">
            {hotel.nombre || 'Hotel'}
          </h3>
          
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
            <MapPin size={12} className="text-[#E91E63]" /> 
            {hotel.direccion || hotel.ubicacion || 'Ubicación por definir'}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* HABITACIÓN SENCILLA */}
            <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100">
              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hab. Sencilla</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[12px] font-black text-[#E91E63]">$</span>
                <span className="text-2xl font-black text-[#E91E63]">{Number(dayData.precioSencilla).toLocaleString()}</span>
              </div>
            </div>

            {/* HABITACIÓN DOBLE */}
            <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100">
              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hab. Doble</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[12px] font-black text-[#E91E63]">$</span>
                <span className="text-2xl font-black text-[#E91E63]">{Number(dayData.precioDoble).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClick}
          disabled={!canBook}
          className={`w-full py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all transform active:scale-95 ${
            canBook 
              ? 'bg-[#111] text-white hover:bg-[#E91E63] shadow-lg shadow-pink-100' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isPausado ? 'PAUSADO POR ADMIN' : hasStock ? 'SELECCIONAR HOTEL' : 'SIN DISPONIBILIDAD'}
        </button>
      </div>
    </div>
  );
};

export default HotelCard;