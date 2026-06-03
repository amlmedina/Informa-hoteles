import React, { useState } from 'react';
import { useHotels } from '../hooks/useHotels';
// 🚀 1. IMPORTAMOS EL HOOK Y MODAL DEL EVENTO
import { useEventManager } from '../hooks/useEventManager'; 
import MasterStockCard from '../components/admin/MasterStockCard';
import AddHotelModal from '../components/admin/AddHotelModal'; 
import BookingsTable from '../components/admin/BookingsTable'; 
// Agregamos el icono de "Settings" para el botón
import { Layout, Users, Plus, Search, Loader2, Database, TrendingUp, Settings } from 'lucide-react';
import EditHotelModal from '../components/admin/EditHotelModal';
import EditEventModal from '../components/admin/EditEventModal'; 

const AdminDashboard = () => {
  const { hotels: hoteles = [], loading } = useHotels() || {};
  // 🚀 2. EXTRAEMOS LOS DATOS DEL EVENTO
  const { evento, loading: eventLoading } = useEventManager(); 

  const [activeTab, setActiveTab] = useState('inventario');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false); // <-- Estado para el nuevo modal
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHotel, setEditingHotel] = useState(null);

  // 🚀 3. PROTECCIÓN: Esperamos a que carguen tanto hoteles como el evento
  if (loading || eventLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#E91E63] mb-4" size={48} />
      <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Sincronizando Panel...</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-700 relative">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-[#111] leading-none">
            CONTROL <span className="text-[#E91E63]">CENTER</span>
          </h2>
          <div className="flex gap-3 mt-4">
            <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={12} />
              {hoteles?.length || 0} Hoteles Activos
            </span>
          </div>
        </div>

        {/* 🚀 4. BOTONES DE ACCIÓN (EVENTO Y NUEVO HOTEL) */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* BOTÓN CONFIGURAR EVENTO */}
          <button 
            onClick={() => setShowEventModal(true)} 
            className="bg-white text-[#111] border-2 border-gray-100 px-6 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:border-[#111] transition-all flex items-center justify-center gap-3 flex-1 lg:flex-none"
          >
            <Settings size={20} />
            <span className="hidden md:inline">Evento</span>
          </button>

          {/* BOTÓN CREAR NUEVO HOTEL */}
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-[#111] text-white px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#E91E63] transition-all shadow-2xl flex items-center justify-center gap-3 group flex-[2] lg:flex-none"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Añadir Nuevo Hotel
          </button>
        </div>
      </div>

      {/* BARRA DE NAVEGACIÓN Y BUSQUEDA */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-white p-3 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex bg-gray-100 p-1.5 rounded-[2rem] w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('inventario')}
            className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'inventario' ? 'bg-white text-[#111] shadow-md' : 'text-gray-400 hover:text-[#111]'
            }`}
          >
            <Layout size={14}/> Inventario
          </button>
          <button 
            onClick={() => setActiveTab('reservas')}
            className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'reservas' ? 'bg-white text-[#111] shadow-md' : 'text-gray-400 hover:text-[#111]'
            }`}
          >
            <Users size={14}/> Reservas
          </button>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E91E63] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="BUSCAR HOTEL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-[11px] font-bold focus:ring-2 focus:ring-[#E91E63]/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* CONTENIDO: INVENTARIO */}
      {activeTab === 'inventario' && (
        <div className="grid grid-cols-1 gap-8">
          {hoteles?.length > 0 ? (
            hoteles
              .filter(h => h.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
              .sort((a, b) => (Number(a.orden) || 99) - (Number(b.orden) || 99))
              .map((hotel) => (
              <MasterStockCard 
                key={hotel.id} 
                hotel={{...hotel, onEdit: setEditingHotel}} 
              />
            ))
          ) : (
            <div className="py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <Database size={60} className="text-gray-200 mb-6" />
              <h3 className="text-gray-400 font-black uppercase text-xl italic tracking-tighter">No hay inventario</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Usa el botón superior para crear tu primer hotel</p>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO: RESERVAS */}
      {activeTab === 'reservas' && (
        <BookingsTable />
      )}

      {/* RENDERIZADO DEL MODAL SOBREPUESTO (AÑADIR HOTEL) */}
      {showAddModal && (
        <AddHotelModal onClose={() => setShowAddModal(false)} />
      )}

      {/* RENDERIZADO DEL MODAL SOBREPUESTO (EDITAR HOTEL) */}
      {editingHotel && (
        <EditHotelModal 
          hotel={editingHotel} 
          onClose={() => setEditingHotel(null)} 
        />
      )}

      {/* 🚀 5. RENDERIZADO DEL MODAL SOBREPUESTO (EDITAR EVENTO) */}
      {showEventModal && (
        <EditEventModal 
          evento={evento} 
          onClose={() => setShowEventModal(false)} 
        />
      )}

    </div>
  );
};

export default AdminDashboard;