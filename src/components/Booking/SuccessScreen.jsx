import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Home, Calendar } from 'lucide-react';

const SuccessScreen = ({ reservationId, bookingData, hotel, onReset }) => {
  
  useEffect(() => {
    const duration = 9 * 1000; // 9 segundos exactos
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#E91E63', '#FFD600', '#111']
      });
      confetti({
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#E91E63', '#FFD600', '#111']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-700">
      <div className="flex justify-center mb-8">
        <div className="bg-green-100 p-6 rounded-[2.5rem]">
          <CheckCircle2 size={60} className="text-green-500" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-[#111] mb-4">¡Reserva Confirmada!</h1>
      <p className="text-gray-500 mb-10 text-lg">
        Tu lugar en <span className="font-bold text-[#111]">{hotel?.nombre || "el hotel oficial"}</span> está asegurado.
      </p>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 mb-10 text-left">
        <div className="bg-[#111] p-8 text-white flex justify-between items-center">
          <div>
            <p className="text-xs opacity-60 uppercase tracking-widest mb-1">ID de Confirmación</p>
            <p className="text-xl font-mono font-bold tracking-tighter uppercase">
               {reservationId ? reservationId.slice(-8) : "PROCESANDO"}
            </p>
          </div>
          <div className="bg-[#E91E63] px-4 py-2 rounded-xl text-xs font-black italic">ABA2026</div>
        </div>

        <div className="p-8 space-y-6 text-[#111]">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Check-in</p>
              <div className="flex items-center gap-2 font-black italic">
                <Calendar size={16} className="text-[#E91E63]" /> {bookingData.checkIn}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Check-out</p>
              <div className="flex items-center gap-2 font-black italic">
                <Calendar size={16} className="text-[#E91E63]" /> {bookingData.checkOut}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onReset}
          className="flex-1 bg-[#111] hover:bg-[#E91E63] text-white font-black py-5 rounded-[2rem] transition-all shadow-xl"
        >
          <Home size={20} className="inline mr-2" /> Volver al Inicio
        </button>
      </div>
    </div>
  );
};

// LA EXPORTACIÓN QUE FALTA:
export default SuccessScreen;