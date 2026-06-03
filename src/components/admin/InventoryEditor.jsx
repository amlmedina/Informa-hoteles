import React, { useState, useEffect } from 'react';
import { Loader2, Save, X } from 'lucide-react';

const InventoryEditor = ({ selectedDate, hotelId, inventario, onSave, onClose }) => {
  const [localForm, setLocalForm] = useState({
    precioSencilla: '',
    precioDoble: '',
    inventarioTotal: ''
  });

  // Cada vez que seleccionas una fecha, actualizamos el formulario local
  useEffect(() => {
    if (selectedDate && inventario) {
      const diaData = inventario[selectedDate];
      setLocalForm({
        precioSencilla: diaData?.precioSencilla || '',
        precioDoble: diaData?.precioDoble || '',
        inventarioTotal: diaData?.inventarioTotal || ''
      });
    }
  }, [selectedDate, inventario]);

  if (!selectedDate) return null;

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black uppercase text-xs tracking-tighter">Editar <span className="text-[#E91E63]">{selectedDate}</span></h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={18}/></button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Sencilla ($)</label>
          <input 
            type="number" 
            value={localForm.precioSencilla} 
            className="w-full p-4 bg-gray-50 rounded-2xl font-black"
            onChange={e => setLocalForm({...localForm, precioSencilla: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Doble ($)</label>
          <input 
            type="number" 
            value={localForm.precioDoble} 
            className="w-full p-4 bg-gray-50 rounded-2xl font-black"
            onChange={e => setLocalForm({...localForm, precioDoble: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Disponibles</label>
          <input 
            type="number" 
            value={localForm.inventarioTotal} 
            className="w-full p-4 bg-gray-50 rounded-2xl font-black"
            onChange={e => setLocalForm({...localForm, inventarioTotal: e.target.value})}
          />
        </div>

        <button 
          onClick={() => onSave(selectedDate, localForm)}
          className="w-full bg-[#111] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4 flex items-center justify-center gap-2"
        >
          <Save size={16} /> Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default InventoryEditor;