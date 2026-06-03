import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, BASE_PATH } from '../../config/firebase';
import { notificationService } from '../../services/notificationService';
import { formatCurrency } from '../../utils/dateUtils';

const PaymentCard = ({ bookingData, hotel, onComplete }) => {
  const [loading, setLoading] = useState(false);

  // El total debería venir calculado o lo calculamos aquí
  const totalDisplay = bookingData.total || (hotel.basePrice || 0);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      // 1. Guardar la reserva en Firestore
      const docRef = await addDoc(collection(db, `${BASE_PATH}/reservas`), {
        ...bookingData,
        hotelId: hotel.id,
        hotelNombre: hotel.nombre,
        total: totalDisplay,
        createdAt: new Date().toISOString(),
        status: 'confirmado'
      });
      
      // 2. Disparar confirmación por correo (Service)
      await notificationService.sendConfirmationEmail(docRef.id, bookingData, hotel);
      
      // 3. Notificar éxito al componente padre (BookingPage)
      onComplete(docRef.id);
    } catch (error) {
      console.error("Error en transacción:", error);
      alert("Error al procesar la reserva. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in zoom-in duration-300">
      {/* Tarjeta Visual Premium */}
      <div className="relative h-56 w-full bg-gradient-to-br from-[#111] to-[#333] rounded-[2.5rem] p-8 text-white shadow-2xl mb-8 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#E91E63] rounded-full blur-3xl opacity-30"></div>
        <div className="flex justify-between items-start">
          <CreditCard size={32} />
          <span className="text-xs font-bold tracking-[0.2em]">PREMIUM MEMBER</span>
        </div>
        <div className="mt-12">
          <p className="text-lg tracking-[0.3em] font-mono">**** **** **** 2026</p>
          <div className="flex justify-between mt-6 items-end">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Huésped</p>
              <p className="text-sm font-bold uppercase truncate max-w-[180px]">
                {bookingData.nombre || "NOMBRE APELLIDO"}
              </p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8" alt="mastercard" />
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl">
        <div className="flex items-center gap-2 text-green-500 mb-6 font-bold justify-center">
          <Lock size={14} /> 
          <span className="text-xs uppercase tracking-widest">Pago Seguro Encriptado</span>
        </div>
        
        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Hotel seleccionado</span>
            <span className="font-bold text-[#111] truncate max-w-[150px]">{hotel.nombre}</span>
          </div>
          <div className="flex justify-between text-lg border-t pt-3">
            <span className="font-black">Total a pagar</span>
            <span className="font-black text-[#E91E63]">
              {formatCurrency(totalDisplay)}
            </span>
          </div>
        </div>

        <button
          onClick={handleFinalize}
          disabled={loading}
          className="w-full bg-[#111] hover:bg-[#E91E63] text-white py-5 rounded-3xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Confirmar Reserva Ahora"
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentCard;