import React, { useState } from 'react';
import { Lock, Delete, ArrowRight } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleNumber = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => setPin(prev => prev.slice(0, -1));

  const handleSubmit = () => {
    if (pin === "1234") {
      onLoginSuccess();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 500); // Efecto de vibración
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-300">
      <div className={`p-6 rounded-[2.5rem] bg-white shadow-2xl border-2 transition-colors ${error ? 'border-red-500 animate-bounce' : 'border-gray-100'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#FFD600] p-4 rounded-full">
            <Lock className="text-[#111]" size={32} />
          </div>
          <h1 className="text-2xl font-black text-[#111]">ADMIN ACCESS</h1>
          
          {/* Visualización del PIN (Puntos) */}
          <div className="flex gap-4 my-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full transition-all duration-200 ${pin.length > i ? 'bg-[#E91E63] scale-125' : 'bg-gray-200'}`} 
              />
            ))}
          </div>
        </div>

        {/* PinPad */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="w-16 h-16 rounded-2xl bg-gray-50 text-xl font-bold hover:bg-gray-100 active:scale-90 transition-all"
            >
              {num}
            </button>
          ))}
          <button onClick={handleDelete} className="w-16 h-16 rounded-2xl flex items-center justify-center hover:bg-gray-100 text-gray-400">
            <Delete size={20} />
          </button>
          <button onClick={() => handleNumber("0")} className="w-16 h-16 rounded-2xl bg-gray-50 text-xl font-bold hover:bg-gray-100">0</button>
          <button 
            onClick={handleSubmit} 
            className="w-16 h-16 rounded-2xl bg-[#E91E63] text-white flex items-center justify-center shadow-lg shadow-[#E91E63]/30 hover:bg-[#C2185B]"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-sm font-medium tracking-widest">INDIPRIS EVENTOS V1</p>
    </div>
  );
};

export default AdminLogin;