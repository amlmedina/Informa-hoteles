// src/components/hotel/HotelCard.jsx
import { BedDouble, Users, CheckCircle2, XCircle } from 'lucide-react';

const HotelCard = ({ hotel, selectedDate }) => {
  // Verificamos stock para la fecha seleccionada (formato YYYY-MM-DD)
  const dayData = hotel.stock_por_dia?.[selectedDate] || { disponible: 0, precioSencilla: 0 };
  const isAvailable = dayData.disponible > 0;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 transition-all hover:scale-[1.02]">
      <div className="relative h-64">
        <img 
          src={hotel.imagen || "/api/placeholder/400/300"} 
          alt={hotel.nombre}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-6 right-6 px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 ${
          isAvailable ? 'bg-[#FFD600] text-black' : 'bg-gray-200 text-gray-500'
        }`}>
          {isAvailable ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
          {isAvailable ? `${dayData.disponible} DISPONIBLES` : 'AGOTADO'}
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-bold text-[#111] mb-2 uppercase tracking-tight">{hotel.nombre}</h3>
        <p className="text-gray-500 mb-6 flex items-center gap-2 italic">
          <BedDouble size={18} /> Tarifas preferenciales Abastur
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-3xl">
            <span className="block text-xs text-gray-400 font-bold uppercase">Sencilla</span>
            <span className="text-xl font-black text-[#E91E63]">${dayData.precioSencilla}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-3xl">
            <span className="block text-xs text-gray-400 font-bold uppercase">Doble</span>
            <span className="text-xl font-black text-[#E91E63]">${dayData.precioDoble}</span>
          </div>
        </div>

        <button 
          disabled={!isAvailable}
          className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all ${
            isAvailable 
            ? 'bg-[#111] text-white hover:bg-[#E91E63] active:scale-95' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'RESERVAR AHORA' : 'SIN DISPONIBILIDAD'}
        </button>
      </div>
    </div>
  );
};

export default HotelCard;