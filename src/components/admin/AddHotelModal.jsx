import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; 
import { X, Save, Loader2, MapPin, Hash, Star } from 'lucide-react';

const EditHotelModal = ({ hotel, onClose }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: hotel?.nombre || '',
    precioSencilla: hotel?.precioSencilla || 0,
    precioDoble: hotel?.precioDoble || 0,
    estrellas: hotel?.estrellas || '5 Estrellas', // 🚀 Aseguramos que cargue el valor actual
    direccion: hotel?.direccion || '',
    imagen: hotel?.imagen || '',
    lat: hotel?.lat || '', 
    lng: hotel?.lng || '', 
    orden: hotel?.orden || 99
  });

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const hotelRef = doc(db, "artifacts/indipris-eventos-v1/public/data/hoteles", hotel.id);
      
      // 🚀 Enviamos TODOS los campos incluyendo estrellas
      await updateDoc(hotelRef, {
        nombre: formData.nombre,
        precioSencilla: Number(formData.precioSencilla),
        precioDoble: Number(formData.precioDoble),
        estrellas: formData.estrellas, // <-- AQUÍ SE CORRIGE EL ERROR
        direccion: formData.direccion,
        imagen: formData.imagen,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        orden: Number(formData.orden)
      });

      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al guardar cambios");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <div className="bg-[#111] p-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <Star className="text-[#E91E63]" size={24} />
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Editar Perfil</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Nombre del Hotel</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-gray-50 rounded-2xl py-4 px-5 font-bold outline-none" />
            </div>

            {/* PRECIOS */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Precio Sencilla ($)</label>
              <input type="number" name="precioSencilla" value={formData.precioSencilla} onChange={handleChange} className="w-full bg-gray-50 rounded-2xl py-4 px-5 font-bold outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Precio Doble ($)</label>
              <input type="number" name="precioDoble" value={formData.precioDoble} onChange={handleChange} className="w-full bg-gray-50 rounded-2xl py-4 px-5 font-bold outline-none" />
            </div>

            {/* 🚀 SELECTOR DE ESTRELLAS (Agregado a edición) */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Categoría de Estrellas</label>
              <select name="estrellas" value={formData.estrellas} onChange={handleChange} className="w-full bg-gray-50 rounded-2xl py-4 px-5 font-bold outline-none">
                <option value="5 Estrellas">5 Estrellas</option>
                <option value="4 Estrellas">4 Estrellas</option>
                <option value="3 Estrellas">3 Estrellas</option>
                <option value="Boutique">Boutique</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">URL Imagen</label>
              <input type="url" name="imagen" value={formData.imagen} onChange={handleChange} className="w-full bg-gray-50 rounded-2xl py-4 px-5 font-bold outline-none" />
            </div>

            {/* UBICACIÓN Y COORDENADAS */}
            <div className="md:col-span-2 bg-gray-50 p-6 rounded-[2rem] space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block flex items-center gap-1"><MapPin size={12}/> Ubicación y Mapa</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección completa" className="w-full bg-white rounded-xl py-3 px-4 font-bold outline-none shadow-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="lat" value={formData.lat} onChange={handleChange} placeholder="Latitud" className="w-full bg-white rounded-xl py-3 px-4 font-bold outline-none shadow-sm" />
                <input type="text" name="lng" value={formData.lng} onChange={handleChange} placeholder="Longitud" className="w-full bg-white rounded-xl py-3 px-4 font-bold outline-none shadow-sm" />
              </div>
            </div>

            {/* PRIORIDAD */}
            <div className="md:col-span-2 bg-pink-50/50 p-6 rounded-[2rem] border border-pink-100">
              <label className="text-[10px] font-black text-[#E91E63] uppercase mb-2 block flex items-center gap-1"><Hash size={12}/> Orden de Prioridad</label>
              <input type="number" name="orden" value={formData.orden} onChange={handleChange} className="w-full bg-white rounded-xl py-3 px-4 font-bold outline-none shadow-sm" />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-[10px] uppercase text-gray-400">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase text-white bg-[#E91E63] flex items-center justify-center gap-2 shadow-lg">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotelModal;