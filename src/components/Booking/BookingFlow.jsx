import React from 'react';
import CustomCalendar from './CustomCalendar';
import { useBookingCalendar } from '../../hooks/useBookingCalendar';

const BookingFlow = ({ hotel, onNext }) => {
  const { range, handleDateClick } = useBookingCalendar();

  const canContinue = range.start && range.end;

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start animate-in fade-in duration-500">
      <div className="flex-1 w-full">
        <CustomCalendar 
          hotel={hotel} 
          range={range} 
          onDateClick={handleDateClick} 
        />
      </div>

      <div className="w-full lg:w-96 bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 sticky top-32">
        <h4 className="text-sm font-black uppercase tracking-widest text-[#E91E63] mb-2">Resumen</h4>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-400">Check-in</span>
            <span className="font-bold">{range.start || "—"}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-400">Check-out</span>
            <span className="font-bold">{range.end || "—"}</span>
          </div>
        </div>

        <button 
          disabled={!canContinue}
          onClick={() => onNext(range)}
          className={`w-full py-5 rounded-[2rem] font-black transition-all shadow-lg ${
            canContinue 
            ? "bg-[#111] hover:bg-[#E91E63] text-white" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {canContinue ? "Confirmar Fechas" : "Selecciona Rango"}
        </button>
      </div>
    </div>
  );
};

export default BookingFlow;