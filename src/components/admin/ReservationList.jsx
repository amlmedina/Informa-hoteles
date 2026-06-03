import React, { useState, useEffect } from 'react';
import { db, BASE_PATH } from '../../config/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { User, Calendar, Hash, Search, CheckCircle2, Loader2 } from 'lucide-react';

const ReservationList = ({ hotelId }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);

    // Consulta simple: filtramos solo por el hotel actual
    const resRef = collection(db, `${BASE_PATH}/reservas`);
    const q = query(resRef, where("hotelId", "==", hotelId));

    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = [];
      snap.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      
      // Ordenamos localmente por fecha para evitar problemas de índices en Firebase
      docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReservas(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error cargando reservas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [hotelId]);

  // Filtro de búsqueda en tiempo real
  const filtered = reservas.filter(res => 
    res.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.folio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-[#E91E63]" size={40} />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* BÚSQUEDA */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center px-8">
        <Search className="text-gray-300 mr-4" size={20} />
        <input 
          placeholder="Buscar por nombre o folio..." 
          className="flex-1 py-4 font-black text-xs uppercase outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Huésped</th>
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Estancia</th>
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Habitación</th>
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Pago</th>
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-[#E91E63]"><User size={18}/></div>
                      <div>
                        <p className="font-black text-xs uppercase tracking-tighter">{res.cliente?.nombre || 'Sin nombre'}</p>
                        <p className="text-[9px] font-bold text-gray-400">{res.folio}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 font-bold text-[10px] text-gray-500 uppercase">
                    {res.reserva?.range?.start || '---'} <span className="mx-1">/</span> {res.reserva?.range?.end || '---'}
                  </td>
                  <td className="p-8">
                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg font-black text-[9px] uppercase">
                      {res.reserva?.roomType || 'Sencilla'}
                    </span>
                  </td>
                  <td className="p-8 font-black text-xs text-[#111]">
                    ${res.reserva?.total?.toLocaleString() || '0'}
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase">
                      <CheckCircle2 size={16} /> <span>Confirmada</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-20 text-center opacity-20 flex flex-col items-center">
            <Hash size={48} className="mb-4" />
            <p className="font-black uppercase text-xs tracking-widest">No hay reservas para este hotel</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationList;