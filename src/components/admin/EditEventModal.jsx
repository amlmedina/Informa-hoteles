import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore'; // Cambiado a setDoc para mayor seguridad
import { db, storage } from '../../config/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, Settings, Loader2, Save, Calendar, MapPin, Image as ImageIcon, Upload, Trash2, Link } from 'lucide-react';

const EditEventModal = ({ evento, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const quality = mimeType === 'image/jpeg' ? 0.8 : undefined;
          resolve(canvas.toDataURL(mimeType, quality));
        };
        img.onerror = () => resolve(null);
      };
      reader.onerror = () => resolve(null);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Intentamos subir a Firebase Storage
      const fileName = `logos/logo_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setFormData(prev => ({ ...prev, logoUrl: downloadURL }));
    } catch (error) {
      console.warn("Storage upload failed, falling back to base64 compression:", error);
      // Fallback a Base64 comprimido
      try {
        const base64Data = await compressImage(file);
        if (base64Data) {
          setFormData(prev => ({ ...prev, logoUrl: base64Data }));
        } else {
          alert("No se pudo procesar la imagen.");
        }
      } catch (err) {
        console.error("Error compressing image:", err);
        alert("Error al procesar el archivo.");
      }
    } finally {
      setUploading(false);
    }
  };
  
  const [formData, setFormData] = useState({
    nombre: evento?.nombre || '',
    logoUrl: evento?.logoUrl || '',
    fechaInicio: evento?.fechaInicio || '',
    fechaFin: evento?.fechaFin || '',
    direccion: evento?.direccion || '',
    lat: evento?.lat || '', 
    lng: evento?.lng || '', 
    banner1Url: evento?.banner1Url || '',
    banner2Url: evento?.banner2Url || '',
    linkPublicidad1: evento?.linkPublicidad1 || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🚀 RUTA VALIDADA: Colección "configuracion", Documento "evento_actual"
      const eventRef = doc(db, "artifacts/indipris-eventos-v1/public/data/configuracion", "evento_actual");
      
      // 🚀 CAMBIO CLAVE: Enviamos TODO el formData y usamos setDoc con merge
      // Esto asegura que banner1Url, linkPublicidad1, etc., SÍ se guarden.
      await setDoc(eventRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setLoading(false);
      alert("¡Configuración guardada exitosamente!");
      onClose();
    } catch (error) {
      console.error("Error al editar evento:", error);
      alert("Error al guardar. Verifica que la ruta en Firebase sea correcta.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* HEADER DEL MODAL (Sin cambios) */}
        <div className="bg-[#111] p-8 flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-[#E91E63] p-2 rounded-xl text-white">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Datos del Evento</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Configuración Global</p>
            </div>
          </div>
          <button onClick={onClose} className="relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* IDENTIDAD */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre Oficial del Evento</label>
              <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} placeholder="Ej. Abastur 2026" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-black text-lg text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            {/* LOGOTIPO DEL EVENTO CON CARGA DE ARCHIVOS */}
            <div className="md:col-span-2 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Logotipo del Evento
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* PREVIEW */}
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-36">
                  {formData.logoUrl ? (
                    <div className="relative group w-full h-full flex items-center justify-center">
                      <img 
                        src={formData.logoUrl} 
                        alt="Vista Previa Logo" 
                        className="max-w-full max-h-full object-contain" 
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-transform group-hover:scale-110"
                        title="Eliminar Logotipo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-300 flex flex-col items-center">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Sin Logo</span>
                    </div>
                  )}
                </div>

                {/* FILE UPLOAD DROPZONE */}
                <div className="md:col-span-2">
                  <label 
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl h-36 cursor-pointer transition-all ${
                      uploading 
                        ? 'border-[#E91E63] bg-[#E91E63]/5' 
                        : 'border-gray-200 bg-white hover:border-[#E91E63] hover:bg-gray-50/50'
                    }`}
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      disabled={uploading} 
                      className="hidden" 
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center text-[#E91E63]">
                        <Loader2 className="animate-spin mb-2" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Procesando...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                        <Upload className="mb-2 text-gray-300" size={24} />
                        <span className="text-xs font-bold text-[#111]">Selecciona una imagen</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Arrastra el archivo aquí</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* URL INPUT OPTION */}
              <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl text-gray-400 border border-gray-100 flex-shrink-0">
                  <Link size={14} />
                </div>
                <input 
                  type="url" 
                  name="logoUrl" 
                  value={formData.logoUrl} 
                  onChange={handleChange} 
                  placeholder="O ingresa una URL de imagen directa (https://...)" 
                  className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-xs text-[#111] shadow-sm outline-none focus:ring-2 focus:ring-[#E91E63]/20" 
                />
              </div>
            </div>

            {/* FECHAS */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar size={12}/> Fecha de Inicio</label>
              <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar size={12}/> Fecha Final</label>
              <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            {/* UBICACIÓN */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={12}/> Sede / Dirección</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Ej. Centro Citibanamex, CDMX" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            {/* COORDENADAS */}
            <div className="bg-pink-50/50 p-6 rounded-[2rem] md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border border-pink-100">
              <div className="md:col-span-2">
                <p className="text-[10px] font-black text-[#E91E63] uppercase tracking-widest">Coordenadas de la Sede</p>
                <p className="text-xs text-gray-500 mb-2">Para centrar el mapa interactivo.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Latitud</label>
                <input type="text" name="lat" value={formData.lat} onChange={handleChange} placeholder="Ej. 19.4382" className="w-full bg-white border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Longitud</label>
                <input type="text" name="lng" value={formData.lng} onChange={handleChange} placeholder="Ej. -99.2185" className="w-full bg-white border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none shadow-sm" />
              </div>
            </div>

            {/* PUBLICIDAD (Banners) */}
            <div className="bg-blue-50/50 p-6 rounded-[2rem] md:col-span-2 border border-blue-100">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Espacios Publicitarios (Banners)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Banner Principal (URL)</label>
                  <input type="url" name="banner1Url" value={formData.banner1Url} onChange={handleChange} placeholder="https://..." className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Link de Destino</label>
                  <input type="url" name="linkPublicidad1" value={formData.linkPublicidad1} onChange={handleChange} placeholder="https://marca.com" className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold outline-none shadow-sm" />
                </div>
              </div>
            </div>

          </div>

          {/* ACCIONES */}
          <div className="flex gap-4 pt-6 border-t border-gray-50">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-200">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              {loading ? 'Guardando...' : 'Actualizar Evento'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditEventModal;