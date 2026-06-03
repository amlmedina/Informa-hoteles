import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, BASE_PATH } from '../config/firebase';
import { Save, Users, Bed, CheckCircle2 } from 'lucide-react';

const InventoryEditor = ({ hotel, selectedDate }) => {
  const [data, setData] = useState({
    disponible: 0,
    precioSencilla: 0,
    precioDoble: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Cargar datos del día seleccionado
  useEffect(() => {
    const fetchDayData = async () => {
      setLoading(true);
      setSuccess(false);
      try {
        const docRef = doc(db, `${BASE_PATH}/hoteles/${hotel.id}/inventario`, selectedDate);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          setData(snap.data());
        } else {
          setData({ disponible: 0, precioSencilla: hotel.basePrice || 0, precioDoble: hotel.basePrice || 0 });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate && hotel.id) fetchDayData();
  }, [selectedDate, hotel.id, hotel.basePrice]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, `${BASE_PATH}/hoteles/${hotel.id}/inventario`, selectedDate);
      await setDoc(docRef, {
        ...data,
        disponible: Number(data.disponible),
        precioSencilla: Number(data.precioSencilla),
        precioDoble: Number(data.precioDoble),
        lastUpdate: new Date().toISOString()
      }, { merge: true });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse font-black text-gray-300">CARGANDO DÍA...</div>;

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] font-black uppercase text-[#E91E63] tracking-widest">Editor de Inventario</p>
          <h3 className="text-2xl font-black text-[#111]">{selectedDate}</h3>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase animate-bounce">
            <CheckCircle2 size={16} /> Actualizado
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Habitaciones Disponibles */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-2">
            <Bed size={14} /> Habitaciones Disponibles
          </label>
          <input 
            type="number"
            value={data.disponible}
            onChange={e => setData({...data, disponible: e.target.value})}
            className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#E91E63]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-2">
              <Users size={14} /> Precio Sencilla
            </label>
            <input 
              type="number"
              value={data.precioSencilla}
              onChange={e => setData({...data, precioSencilla: e.target.value})}
              className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-2">
              <Users size={14} /> Precio Doble
            </label>
            <input 
              type="number"
              value={data.precioDoble}
              onChange={e => setData({...data, precioDoble: e.target.value})}
              className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-4 bg-[#111] hover:bg-[#E91E63] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : <><Save size={18} /> Guardar Cambios del Día</>}
        </button>
      </div>
    </div>
  );
};

export default InventoryEditor;