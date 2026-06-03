import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 🚀 Recibimos 'inventario' como prop directamente (ya procesado por BookingPage)
const CustomCalendar = ({ hotel, inventario = {}, range, setRange, roomType }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1)); // Septiembre 2026

  // 1. Lógica para generar los días del calendario
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const startDay = days[0].getDay(); // Para el offset del inicio de semana

  // 2. Manejador de clics para el rango (Check-in / Check-out)
  const handleDateClick = (dateStr) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: dateStr, end: null });
    } else {
      if (new Date(dateStr) < new Date(range.start)) {
        setRange({ start: dateStr, end: null });
      } else if (dateStr !== range.start) {
        setRange({ ...range, end: dateStr });
      }
    }
  };

  const isSelected = (dateStr) => dateStr === range.start || dateStr === range.end;
  const isInRange = (dateStr) => {
    if (!range.start || !range.end) return false;
    return dateStr > range.start && dateStr < range.end;
  };

  return (
    <div className="select-none">
      {/* HEADER DEL MES */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={18} />
        </button>
        <h4 className="font-black uppercase text-[10px] tracking-widest">
          {currentMonth.toLocaleString('es-MX', { month: 'long', year: 'numeric' })}
        </h4>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* DÍAS DE LA SEMANA */}
      <div className="grid grid-cols-7 mb-2">
        {/* Tu excelente solución para la llave duplicada */}
        {['D', 'L', 'M', 'Mi', 'J', 'V', 'S'].map(d => (
          <div key={d} className="text-center text-[9px] font-black text-gray-300 py-2">{d}</div>
        ))}
      </div>

      {/* CUADRÍCULA DE DÍAS */}
      <div className="grid grid-cols-7 gap-1">
        {/* Espacios vacíos al inicio (llave única para evitar errores) */}
        {[...Array(startDay)].map((_, i) => <div key={`empty-${i}`} />)}

        {days.map(day => {
          // 🚀 TRUCO DE SENIOR: Formateo manual YYYY-MM-DD para evitar errores de Zona Horaria (México)
          const year = day.getFullYear();
          const month = String(day.getMonth() + 1).padStart(2, '0');
          const date = String(day.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${date}`;
          
          const dayData = inventario[dateStr];
          
          // 🚀 LÓGICA HÍBRIDA DE STOCK: Soporta ambos modelos de Firebase
          const stockReal = dayData?.disponible ?? dayData?.inventarioTotal ?? 0;
          const tieneInventario = Number(stockReal) > 0;

          // Lógica de precio dinámico según roomType
          const precio = roomType === 'sencilla' 
            ? (dayData?.precioSencilla || hotel.basePrice || 0) 
            : (dayData?.precioDoble || hotel.basePrice * 1.2 || 0);
            
          const selected = isSelected(dateStr);
          const activeRange = isInRange(dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => tieneInventario && handleDateClick(dateStr)}
              className={`
                relative h-14 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all
                ${!tieneInventario ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-105'}
                ${selected ? 'bg-[#E91E63] text-white shadow-lg z-10' : ''}
                ${activeRange ? 'bg-pink-50 text-[#E91E63] rounded-none' : ''}
                ${!selected && !activeRange ? 'hover:bg-gray-50' : ''}
              `}
            >
              <span className={`text-[11px] font-black ${selected ? 'text-white' : 'text-[#111]'}`}>
                {day.getDate()}
              </span>
              
              {tieneInventario && (
                <span className={`text-[7px] font-bold mt-1 ${selected ? 'text-white/80' : 'text-gray-400'}`}>
                  ${Number(precio).toLocaleString()}
                </span>
              )}

              {/* Indicador de "Pocas habitaciones" */}
              {tieneInventario && Number(stockReal) < 5 && !selected && (
                <div className="absolute top-1 right-1 w-1 h-1 bg-orange-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;