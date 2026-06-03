import React, { useState, useEffect } from 'react';
// IMPORTANTE: Agregamos deleteDoc
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; 
// IMPORTANTE: Agregamos el icono Eraser (Borrador)
import { Settings, Save, Power, CalendarDays, Layers, ChevronDown, ChevronUp, Loader2, CalendarRange, ChevronLeft, ChevronRight, Trash2, Eraser } from 'lucide-react';

const MasterStockCard = ({ hotel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editMode, setEditMode] = useState('masiva'); 
  const [loading, setLoading] = useState(false);

  // --- ESTADOS: MODIFICACIÓN MASIVA ---
  const [masivaStart, setMasivaStart] = useState("");
  const [masivaEnd, setMasivaEnd] = useState("");
  const [masivaData, setMasivaData] = useState({
    disponible: hotel.disponible || 0,
    precioSencilla: hotel.precioSencilla || 0,
    precioDoble: hotel.precioDoble || 0,
  });

  // --- ESTADOS: MODIFICACIÓN DIARIA ---
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarView, setCalendarView] = useState(new Date(selectedDate)); 
  const [diariaData, setDiariaData] = useState({
    disponible: 0,
    precioSencilla: 0,
    precioDoble: 0
  });

  useEffect(() => {
    if (hotel.stock_por_dia && hotel.stock_por_dia[selectedDate]) {
      const day = hotel.stock_por_dia[selectedDate];
      setDiariaData({
        disponible: day.disponible || 0,
        precioSencilla: day.precioSencilla || 0,
        precioDoble: day.precioDoble || 0
      });
    } else {
      setDiariaData({ disponible: '', precioSencilla: '', precioDoble: '' });
    }
  }, [selectedDate, hotel]);

  // --- LÓGICA DE FIREBASE ---

  const handlePausaMasiva = async () => {
    try {
      const hotelRef = doc(db, "artifacts/indipris-eventos-v1/public/data/hoteles", hotel.id);
      await updateDoc(hotelRef, { ventasPausadas: !hotel.ventasPausadas });
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // 🧹 FUNCIÓN 1: LIMPIAR CALENDARIO (Borrador)
  const handleClearStock = async () => {
    const isConfirmed = window.confirm(
      `🧹 ¿Estás seguro de LIMPIAR el inventario de "${hotel.nombre}"?\n\nEsto pondrá todo en 0, pero el hotel seguirá existiendo.`
    );
    if (!isConfirmed) return;

    setLoading(true);
    try {
      const hotelRef = doc(db, "artifacts/indipris-eventos-v1/public/data/hoteles", hotel.id);
      await updateDoc(hotelRef, {
        disponible: 0,
        stock_por_dia: {} 
      });
      setMasivaData({ ...masivaData, disponible: 0 });
      alert("Inventario formateado a cero correctamente.");
    } catch (error) {
      alert("Error al limpiar inventario: " + error.message);
    }
    setLoading(false);
  };

  // 🚨 FUNCIÓN 2: ELIMINAR HOTEL (Basurero)
  const handleDeleteHotel = async () => {
    const isConfirmed = window.confirm(
      `⚠️ ¡ALERTA CRÍTICA!\n\nEstás a punto de ELIMINAR por completo el hotel "${hotel.nombre}".\n\n¿Estás absolutamente seguro? Esta acción NO se puede deshacer.`
    );
    if (!isConfirmed) return;

    setLoading(true);
    try {
      const hotelRef = doc(db, "artifacts/indipris-eventos-v1/public/data/hoteles", hotel.id);
      await deleteDoc(hotelRef);
      // No necesitamos alertar de éxito, la tarjeta desaparecerá sola mágicamente
    } catch (error) {
      alert("Error al eliminar el hotel: " + error.message);
      setLoading(false);
    }
  };

  const handleSaveRangoMasivo = async () => {
    if (!masivaStart || !masivaEnd) return alert("Selecciona fecha de inicio y final.");
    setLoading(true);
    try {
      const hotelRef = doc(db, "artifacts/indipris-eventos-v1/public/data/hoteles", hotel.id);
      const dates = [];
      let currentDate = new Date(masivaStart);
      currentDate.setUTCHours(0,0,0,0);
      const endDateObj = new Date(masivaEnd);
      endDateObj.setUTCHours(0,0,0,0);

      while (currentDate <= endDateObj) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }

      const updates = {};
      dates.forEach(date => {
        updates[`stock_por_dia.${date}`] = {
          disponible: Number(masivaData.disponible),
          precioSencilla: Number(masivaData.precioSencilla),
          precioDoble: Number(masivaData.precioDoble)
        };
      });

      await updateDoc(hotelRef, updates);
      alert(`¡Éxito! Tarifas actualizadas para ${dates.length} días.`);
    } catch (error) {
      alert("Error al guardar rango: " + error.message);
    }
    setLoading(false);
  };

  const handleSaveDiaria = async () => {
    setLoading(true);
    try {
      const hotelRef = doc(db, "artifacts/indipris-eventos-v1/public/data/hoteles", hotel.id);
      await updateDoc(hotelRef, {
        [`stock_por_dia.${selectedDate}`]: {
          disponible: Number(diariaData.disponible),
          precioSencilla: Number(diariaData.precioSencilla),
          precioDoble: Number(diariaData.precioDoble)
        }
      });
      alert(`Tarifas del ${selectedDate} guardadas.`);
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const generateCalendarDays = () => {
    const year = calendarView.getFullYear();
    const month = calendarView.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(null); 
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(dateStr);
    }
    return days;
  };

  const isPausado = hotel.ventasPausadas;

  return (
    <div className={`bg-white rounded-[2.5rem] shadow-xl border-2 transition-all duration-300 overflow-hidden ${
      isPausado ? 'border-red-100' : 'border-transparent'
    }`}>
      
      {/* CABECERA */}
      <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => hotel.onEdit && hotel.onEdit(hotel)} 
            title="Editar información del hotel"
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105 hover:shadow-lg ${isPausado ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-100 text-[#111] hover:bg-[#111] hover:text-white'}`}
          >
            <Settings size={24} />
          </button>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">{hotel.nombre}</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
              <span className={`w-2 h-2 rounded-full ${isPausado ? 'bg-red-500' : 'bg-green-500'}`}></span>
              {isPausado ? 'VENTAS CONGELADAS' : 'ACTIVO EN PLATAFORMA'}
            </span>
          </div>
        </div>

        {/* CONTROLES DE ACCIÓN RÁPIDA */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 md:flex-none bg-[#111] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E91E63] transition-colors flex items-center justify-center gap-2"
          >
            {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            {isExpanded ? 'CERRAR PANEL' : 'GESTIONAR INVENTARIO'}
          </button>
          
          <button 
            onClick={handlePausaMasiva}
            title="Pausar / Reactivar ventas"
            className={`p-3 rounded-2xl transition-colors ${isPausado ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
          >
            <Power size={20} />
          </button>

          {/* BOTÓN: LIMPIAR STOCK (Borrador Naranja) */}
          <button 
            onClick={handleClearStock}
            title="Limpiar todo el stock y calendario (Dejar en cero)"
            className="p-3 rounded-2xl transition-colors bg-gray-100 text-gray-400 hover:text-orange-500 hover:bg-orange-50"
          >
            <Eraser size={20} />
          </button>

          {/* BOTÓN: ELIMINAR HOTEL (Basurero Rojo) */}
          <button 
            onClick={handleDeleteHotel}
            title="Eliminar este hotel permanentemente"
            className="p-3 rounded-2xl transition-colors bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* PANEL EXPANDIBLE */}
      {isExpanded && (
        <div className="border-t border-gray-50 bg-gray-50/30 p-8 animate-in slide-in-from-top-4 duration-300">
          
          {/* TABS DE MODO */}
          <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem] max-w-md mx-auto mb-10">
            <button 
              onClick={() => setEditMode('masiva')}
              className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex justify-center items-center gap-2 ${editMode === 'masiva' ? 'bg-white text-[#111] shadow-sm' : 'text-gray-400'}`}
            >
              <CalendarRange size={14}/> Rango Masivo
            </button>
            <button 
              onClick={() => setEditMode('diaria')}
              className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex justify-center items-center gap-2 ${editMode === 'diaria' ? 'bg-[#E91E63] text-white shadow-sm shadow-pink-200' : 'text-gray-400'}`}
            >
              <CalendarDays size={14}/> Por Día
            </button>
          </div>

          {/* MODO 1: RANGO MASIVO */}
          {editMode === 'masiva' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-[#E91E63] uppercase tracking-widest mb-2">Fecha Inicio</label>
                  <input type="date" value={masivaStart} onChange={e => setMasivaStart(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-black text-[#111] outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-[#E91E63] uppercase tracking-widest mb-2">Fecha Final</label>
                  <input type="date" value={masivaEnd} onChange={e => setMasivaEnd(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-black text-[#111] outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stock a Inyectar</label>
                  <input type="number" value={masivaData.disponible} onChange={e => setMasivaData({...masivaData, disponible: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#111] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio Sencilla</label>
                  <input type="number" value={masivaData.precioSencilla} onChange={e => setMasivaData({...masivaData, precioSencilla: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#E91E63] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio Doble</label>
                  <input type="number" value={masivaData.precioDoble} onChange={e => setMasivaData({...masivaData, precioDoble: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#E91E63] outline-none" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={handleSaveRangoMasivo} disabled={loading} className="bg-[#111] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E91E63] transition-all flex items-center gap-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Layers size={16} />}
                  Aplicar a todo el rango
                </button>
              </div>
            </div>
          )}

          {/* MODO 2: CALENDARIO INTERACTIVO */}
          {editMode === 'diaria' && (
            <div className="flex flex-col lg:flex-row gap-10 animate-in fade-in">
              <div className="w-full lg:w-[45%] bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <button onClick={() => setCalendarView(new Date(calendarView.getFullYear(), calendarView.getMonth() - 1))} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-600"><ChevronLeft size={16}/></button>
                  <span className="font-black text-sm uppercase tracking-widest text-[#111]">
                    {calendarView.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => setCalendarView(new Date(calendarView.getFullYear(), calendarView.getMonth() + 1))} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-600"><ChevronRight size={16}/></button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                  {['Do','Lu','Ma','Mi','Ju','Vi','Sa'].map(d => <div key={d} className="text-[9px] font-black text-gray-400 uppercase">{d}</div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays().map((dateStr, i) => {
                    if (!dateStr) return <div key={`empty-${i}`} className="p-2"></div>;
                    const isSelected = dateStr === selectedDate;
                    const hasData = hotel.stock_por_dia && hotel.stock_por_dia[dateStr];
                    
                    return (
                      <button 
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all relative ${
                          isSelected ? 'bg-[#E91E63] text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {parseInt(dateStr.split('-')[2])}
                        {hasData && !isSelected && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full lg:w-[55%] space-y-6">
                <div className="bg-[#111] p-5 rounded-2xl text-white flex items-center gap-3">
                  <CalendarDays size={20} className="text-[#E91E63]" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Editando Fecha</p>
                    <p className="font-black text-lg">{selectedDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Habitaciones Disponibles</label>
                    <input type="number" value={diariaData.disponible} onChange={e => setDiariaData({...diariaData, disponible: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 font-bold text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio Sencilla</label>
                    <input type="number" value={diariaData.precioSencilla} onChange={e => setDiariaData({...diariaData, precioSencilla: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 font-bold text-[#E91E63] focus:ring-2 focus:ring-[#E91E63] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio Doble</label>
                    <input type="number" value={diariaData.precioDoble} onChange={e => setDiariaData({...diariaData, precioDoble: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 font-bold text-[#E91E63] focus:ring-2 focus:ring-[#E91E63] outline-none" />
                  </div>
                </div>

                <button onClick={handleSaveDiaria} disabled={loading} className="w-full bg-[#E91E63] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#D81B60] transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-200 mt-4">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Guardar Día Específico
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default MasterStockCard;