import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Save, X } from 'lucide-react';

const EventForm = ({ currentEvento, onSave }) => {
  const [form, setForm] = useState(currentEvento || {
    nombre: '',
    direccion: '',
    lat: 19.3621,
    lng: -99.2736,
    logoUrl: '',
    fechaInicio: '2026-09-01',
    fechaFin: '2026-09-05'
  });

  return (
    <div className="bg-white p-10 rounded-[3rem] border-4 border-[#111] shadow-2xl animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-[#111] text-white rounded-2xl">
          <Trophy size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Evento Maestro</h2>
          <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase text-[#E91E63]">Configuración Global del Sitio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Nombre y Logo */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nombre del Evento</label>
          <input 
            value={form.nombre}
            onChange={e => setForm({...form, nombre: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-[#E91E63] outline-none"
            placeholder="Ej. ABASTUR 2026"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-2">URL del Logo</label>
          <input 
            value={form.logoUrl}
            onChange={e => setForm({...form, logoUrl: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-[#E91E63] outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Fechas del Evento */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Fecha Inicio del Evento</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-4 text-gray-300" size={18} />
            <input 
              type="date"
              value={form.fechaInicio}
              onChange={e => setForm({...form, fechaInicio: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-[#E91E63] outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Fecha Fin del Evento</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-4 text-gray-300" size={18} />
            <input 
              type="date"
              value={form.fechaFin}
              onChange={e => setForm({...form, fechaFin: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-[#E91E63] outline-none"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Dirección Sede</label>
          <input 
            value={form.direccion}
            onChange={e => setForm({...form, direccion: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-[#E91E63] outline-none"
            placeholder="Ej. Centro Citibanamex"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
           <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Latitud</label>
            <input 
              type="number" step="any" value={form.lat}
              onChange={e => setForm({...form, lat: e.target.value})}
              className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Longitud</label>
            <input 
              type="number" step="any" value={form.lng}
              onChange={e => setForm({...form, lng: e.target.value})}
              className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={() => onSave(form)}
        className="w-full mt-10 bg-[#111] hover:bg-[#E91E63] text-white py-6 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
      >
        <Save size={20} /> GUARDAR CONFIGURACIÓN DEL EVENTO
      </button>
    </div>
  );
};

export default EventForm;