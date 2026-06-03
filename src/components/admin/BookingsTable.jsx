import React, { useState, useMemo } from 'react';
import { useBookings } from '../../hooks/useBookings';
// 🚀 Añadimos el icono Download
import { ClipboardList, Search, Loader2, Users, Filter, Download } from 'lucide-react';

const BookingsTable = () => {
  const { reservas, loading } = useBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [hotelFilter, setHotelFilter] = useState("TODOS");

  // Extraer lista única de hoteles
  const hotelesDisponibles = useMemo(() => {
    if (!reservas) return [];
    const lista = reservas.map(r => r.hotelNombre || 'Hotel Oficial');
    return [...new Set(lista)];
  }, [reservas]);

  // 🚀 FUNCIÓN DE EXPORTACIÓN CSV (Usa los datos filtrados actuales)
  const exportToCSV = (datos) => {
    const headers = ["Folio", "Huesped", "Email", "Telefono", "Hotel", "Check-In", "Check-Out", "Monto Total"];
    
    const rows = datos.map(r => [
      r.folio || r.id,
      r.cliente?.nombre || r.huespedNombre || 'Sin nombre',
      r.cliente?.email || 'N/A',
      r.cliente?.telefono || 'N/A',
      r.hotelNombre || 'N/A',
      r.reserva?.range?.start || r.checkIn || 'N/A',
      r.reserva?.range?.end || r.checkOut || 'N/A',
      `$${r.reserva?.total || r.total || 0}`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Reservas_Indipris_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="bg-white p-20 rounded-[3rem] text-center border border-gray-100 flex flex-col items-center">
        <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Sincronizando registros...</p>
      </div>
    );
  }

  // Lógica del buscador con soporte para datos anidados
  const reservasFiltradas = reservas.filter(reserva => {
    const term = searchTerm.toLowerCase();
    // 🚀 Buscamos tanto en el objeto cliente como en el campo directo
    const nombre = (reserva.cliente?.nombre || reserva.huespedNombre || "").toLowerCase();
    const folio = (reserva.id || reserva.folio || "").toLowerCase();
    const nombreHotel = reserva.hotelNombre || 'Hotel Oficial';
    
    const coincideTexto = nombre.includes(term) || folio.includes(term) || nombreHotel.toLowerCase().includes(term);
    const coincideHotel = hotelFilter === "TODOS" || nombreHotel === hotelFilter;

    return coincideTexto && coincideHotel;
  });

  return (
    <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 animate-in fade-in">
      
      {/* CABECERA Y CONTROLES */}
      <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center bg-gray-50/30">
        <h3 className="text-xl font-black uppercase italic flex items-center gap-2 text-[#111] whitespace-nowrap">
          <ClipboardList className="text-[#E91E63]" /> Registro de Huéspedes
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-center">
          {/* FILTRO POR HOTEL */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={hotelFilter}
              onChange={(e) => setHotelFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold text-[#111] uppercase focus:ring-2 focus:ring-[#E91E63] outline-none appearance-none cursor-pointer"
            >
              <option value="TODOS">Todos los Hoteles</option>
              {hotelesDisponibles.map((hotel, index) => (
                <option key={index} value={hotel}>{hotel}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* BUSCADOR DE TEXTO */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="BUSCAR NOMBRE O FOLIO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold focus:ring-2 focus:ring-[#E91E63] outline-none"
            />
          </div>

          {/* 🚀 NUEVO: BOTÓN DE EXPORTACIÓN */}
          <button 
            onClick={() => exportToCSV(reservasFiltradas)}
            className="bg-[#111] text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#E91E63] transition-all shadow-lg active:scale-95"
          >
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* TABLA DE DATOS */}
      <div className="overflow-x-auto">
        {reservasFiltradas.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Huésped</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Hotel / Tipo</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Check-in / Out</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservasFiltradas.map((reserva) => (
                <tr key={reserva.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    {/* 🚀 CORRECCIÓN: Usamos cliente.nombre */}
                    <p className="font-black text-[#111]">{reserva.cliente?.nombre || reserva.huespedNombre || 'Sin nombre'}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mt-1">Folio: {(reserva.folio || reserva.id).slice(0,8)}</p>
                  </td>
                  <td className="p-6 text-[11px] font-bold uppercase">
                    {reserva.hotelNombre || 'Hotel Oficial'} <br/> 
                    <span className="text-gray-400 text-[9px]">{reserva.reserva?.roomType || reserva.tipoHabitacion || 'Habitación'}</span>
                  </td>
                  <td className="p-6 text-[11px] font-bold">
                    {/* 🚀 CORRECCIÓN: Usamos reserva.range */}
                    {reserva.reserva?.range?.start || reserva.checkIn || '--'} al {reserva.reserva?.range?.end || reserva.checkOut || '--'} <br/>
                    <span className="text-green-500 text-[9px] uppercase tracking-widest font-black">PAGO CONFIRMADO</span>
                  </td>
                  <td className="p-6 text-right font-black text-lg text-[#E91E63]">
                    {/* 🚀 CORRECCIÓN: Usamos reserva.total */}
                    ${Number(reserva.reserva?.total || reserva.total || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center">
            <Users size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              {hotelFilter !== "TODOS" ? `No hay reservas en ${hotelFilter}` : 'No se encontraron reservaciones'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsTable;