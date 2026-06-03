import React, { useState } from 'react';
import { Zap, Calendar, Save, X } from 'lucide-react';

const InitInventoryForm = ({ hotelNombre, onSave, onCancel, processing }) => {
  const [config, setConfig] = useState({
    fechaInicio: '',
    fechaFin: '',
    disponible: 10,
    precioSencilla: '',
    precioDoble: ''
  });

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-t-8 border-yellow-400 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Configuración <span className="text-yellow-500">Global</span></h3>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{hotelNombre}</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Inicio</label>
            <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl font-black text-xs" onChange={e => setConfig({...config, fechaInicio: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Fin</label>
            <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl font-black text-xs" onChange={e => setConfig({...config, fechaFin: e.target.value})} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">Habitaciones Disponibles</label>
          <input type="number" placeholder="10" className="w-full p-4 bg-gray-50 rounded-2xl font-black text-xs" onChange={e => setConfig({...config, disponible: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="PRECIO SENC." className="w-full p-4 bg-gray-50 rounded-2xl font-black text-xs" onChange={e => setConfig({...config, precioSencilla: e.target.value})} />
          <input type="number" placeholder="PRECIO DOBLE" className="w-full p-4 bg-gray-50 rounded-2xl font-black text-xs" onChange={e => setConfig({...config, precioDoble: e.target.value})} />
        </div>

        <button 
          onClick={() => onSave(config)}
          disabled={processing}
          className="w-full bg-[#111] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-400 hover:text-black transition-all"
        >
          {processing ? 'Generando...' : <><Zap size={16} fill="currentColor"/> Aplicar a Rango</>}
        </button>
      </div>
    </div>
  );
};

export default InitInventoryForm;