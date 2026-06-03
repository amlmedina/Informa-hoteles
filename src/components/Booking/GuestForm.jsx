import React from 'react';
import { User, Mail, Phone, Briefcase, ChevronLeft } from 'lucide-react';

const GuestForm = ({ onBack, onNext, onChange, formData }) => {
  const inputGroupClass = "relative flex flex-col gap-2";
  const iconClass = "absolute left-4 top-[3.2rem] text-gray-400";
  const inputClass = "w-full bg-gray-50 border-none p-5 pl-12 rounded-2xl focus:ring-2 focus:ring-[#E91E63] transition-all outline-none text-[#111] font-medium";

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-[#E91E63] transition-colors mb-4 font-bold text-sm"
        >
          <ChevronLeft size={16} /> Volver al calendario
        </button>
        <h2 className="text-3xl font-black text-[#111]">Datos del Huésped</h2>
        <p className="text-gray-400">Completa la información para tu registro oficial en Abastur 2026.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={inputGroupClass}>
          <label className="text-sm font-bold ml-2">Nombre Completo</label>
          <User size={18} className={iconClass} />
          <input 
            type="text" 
            placeholder="Ej. Juan Pérez"
            className={inputClass}
            value={formData.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
          />
        </div>

        <div className={inputGroupClass}>
          <label className="text-sm font-bold ml-2">Correo Electrónico</label>
          <Mail size={18} className={iconClass} />
          <input 
            type="email" 
            placeholder="juan@empresa.com"
            className={inputClass}
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>

        <div className={inputGroupClass}>
          <label className="text-sm font-bold ml-2">Teléfono</label>
          <Phone size={18} className={iconClass} />
          <input 
            type="tel" 
            placeholder="+52 55..."
            className={inputClass}
            value={formData.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
          />
        </div>

        <div className={inputGroupClass}>
          <label className="text-sm font-bold ml-2">Empresa / Cargo</label>
          <Briefcase size={18} className={iconClass} />
          <input 
            type="text" 
            placeholder="Director Comercial"
            className={inputClass}
            value={formData.empresa}
            onChange={(e) => onChange('empresa', e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full mt-10 bg-[#E91E63] hover:bg-[#C2185B] text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#E91E63]/20 active:scale-95"
      >
        Proceder al Pago
      </button>
    </div>
  );
};

export default GuestForm;