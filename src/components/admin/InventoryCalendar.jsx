import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

const InventoryCalendar = ({ inventario, selectedDate, onDateClick, basePrice }) => {
  
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    const datosDia = inventario[dateStr];

    // SOLO mostramos el precio si existe el registro en Firebase
    if (!datosDia) return <div className="h-4 w-4 bg-gray-50 rounded-full mt-2 mx-auto opacity-20" />;

    return (
      <div className="flex flex-col items-center mt-1">
        <span className="text-[10px] font-black text-[#E91E63]">
          ${Number(datosDia.precioSencilla).toLocaleString()}
        </span>
        <div className="w-1 h-1 bg-green-400 rounded-full mt-0.5" />
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const dateStr = format(date, 'yyyy-MM-dd');
    return selectedDate === dateStr ? 'selected-tile' : '';
  };

  return (
    <div className="bg-white p-6 rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
      <Calendar
        locale="es-MX"
        onClickDay={(date) => {
          const formattedDate = format(date, 'yyyy-MM-dd');
          onDateClick(formattedDate); 
        }}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="admin-calendar-custom"
      />
      <style>{`
        .admin-calendar-custom { border: none !important; width: 100% !important; }
        .react-calendar__tile { height: 85px !important; border-radius: 20px; transition: all 0.2s; }
        .selected-tile { background: #fff1f5 !important; ring: 2px inset #E91E63; }
        .react-calendar__tile--active { background: #E91E63 !important; color: white !important; border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default InventoryCalendar;