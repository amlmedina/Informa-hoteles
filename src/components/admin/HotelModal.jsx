import React, { useState, useEffect } from 'react';
import { X, Hotel, Star, MapPin } from 'lucide-react';

const HotelModal = ({ onSave, onCancel, processing, hotelToEdit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    basePrice: '',
    estrellas: '5',
    distanciaTexto: '',
    imageUrl: '',
    direccion: '',
    lat: 19.4326,
    lng: -99.1332
  });

  useEffect(() => {
    if (hotelToEdit) setFormData(hotelToEdit);
  }, [hotelToEdit]);

  const handleSubmit = () => {
    if (!formData.nombre || !formData.basePrice) return alert("Nombre y Precio son obligatorios");
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-[#111]/90 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#E91E63] p-3 rounded-2xl text-white"><Hotel size={20} /></div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              {hotelToEdit ? 'Editar' : 'Nueva'} <span className="text-[#E91E63]">Propiedad</span>
            </h2>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto">
          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nombre</label>
            <input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#E91E63]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Precio Base</label>
            <input type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Estrellas</label>
            <select value={formData.estrellas} onChange={e => setFormData({...formData, estrellas: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none">
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Estrellas</option>)}
            </select>
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-[#E91E63] ml-2">Texto de Distancia (Línea en tarjeta)</label>
            <input value={formData.distanciaTexto} onChange={e => setFormData({...formData, distanciaTexto: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" placeholder="Ej: A 5 min de la sede" />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">URL Imagen</label>
            <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" />
          </div>
        </div>

        <div className="p-8 bg-gray-50 flex gap-4">
          <button onClick={onCancel} className="flex-1 py-4 font-black text-gray-400 uppercase text-xs">Cancelar</button>
          <button disabled={processing} onClick={handleSubmit} className="flex-[2] bg-[#111] text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-[#E91E63] transition-all">
            {processing ? 'Guardando...' : 'Confirmar Datos'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelModal;