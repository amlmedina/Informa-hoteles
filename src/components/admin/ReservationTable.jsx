import React from 'react';
import { Download, ExternalLink, User, Calendar as CalendarIcon } from 'lucide-react';

const ReservationTable = ({ reservations, loading }) => {
  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse font-bold">Cargando base de datos...</div>;

  return (
    <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-2xl font-black text-[#111]">Reservas Recientes</h3>
        <span className="bg-[#FFD600] text-[#111] px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          {reservations.length} Registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <th className="px-8 py-4">Huésped</th>
              <th className="px-8 py-4">Hotel</th>
              <th className="px-8 py-4">Estancia</th>
              <th className="px-8 py-4">Estatus</th>
              <th className="px-8 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#E91E63]">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-[#111]">{res.nombre}</p>
                      <p className="text-xs text-gray-400">{res.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-semibold text-sm">{res.hotelNombre}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <CalendarIcon size={14} className="text-[#E91E63]" />
                    {res.checkIn} — {res.checkOut}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                    {res.status || 'Confirmado'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-gray-300 hover:text-[#111] transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;