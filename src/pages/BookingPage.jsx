import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  runTransaction, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, BASE_PATH } from '../config/firebase';
import CustomCalendar from '../components/booking/CustomCalendar';
import { 
  ChevronLeft, Users, Bed, CreditCard, 
  Loader2, Lock, ShieldCheck, PartyPopper 
} from 'lucide-react';

const BookingPage = ({ hotelSelected, onBack }) => {
  const [step, setStep] = useState(1); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [folio, setFolio] = useState('');
  
  // 🚀 ESTADO HÍBRIDO DE INVENTARIO
  const [inventarioDinamico, setInventarioDinamico] = useState({});

  const [roomType, setRoomType] = useState('sencilla');
  const [range, setRange] = useState({ start: null, end: null });
  const [nights, setNights] = useState(0);
  const [total, setTotal] = useState(0);

  const [cliente, setCliente] = useState({ nombre: '', email: '', telefono: '' });
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' });

  // 1. 🛠️ CARGA DE DATOS: Detecta si los datos están en el mapa o en la sub-colección
  useEffect(() => {
    if (!hotelSelected?.id) return;

    // A. Prioridad 1: Revisamos si ya trae el mapa 'stock_por_dia' (Caso Atizapán)
    if (hotelSelected.stock_por_dia) {
      setInventarioDinamico(hotelSelected.stock_por_dia);
    }

    // B. Prioridad 2: Escuchamos la sub-colección 'inventario' por si acaso (Caso Camino Real)
    const invRef = collection(db, `${BASE_PATH}/hoteles/${hotelSelected.id}/inventario`);
    const unsubscribe = onSnapshot(invRef, (snapshot) => {
      if (!snapshot.empty) {
        const dataSubCol = {};
        snapshot.forEach(doc => { dataSubCol[doc.id] = doc.data(); });
        // Mezclamos ambos por si hay datos en ambos lugares
        setInventarioDinamico(prev => ({ ...prev, ...dataSubCol }));
      }
    });

    return () => unsubscribe();
  }, [hotelSelected]);

  // 2. 🧮 CÁLCULO DE PRECIO: Adaptado a ambos nombres de campos (disponible e inventarioTotal)
  useEffect(() => {
    if (range.start && range.end) {
      const start = new Date(range.start + 'T00:00:00');
      const end = new Date(range.end + 'T00:00:00');
      let sumaTotal = 0;
      let contadorNoches = 0;

      let current = new Date(start);
      while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        const diaData = inventarioDinamico[dateStr];

        // 🚀 Verificamos stock usando cualquiera de los dos nombres que existan en la DB
        const stock = diaData?.disponible ?? diaData?.inventarioTotal ?? 0;

        if (Number(stock) > 0) {
          let precioNoche = roomType === 'sencilla' 
            ? (diaData?.precioSencilla || hotelSelected.precioSencilla || 0)
            : (diaData?.precioDoble || hotelSelected.precioDoble || 0);

          sumaTotal += Number(precioNoche);
          contadorNoches++;
        }
        current.setDate(current.getDate() + 1);
      }
      setNights(contadorNoches);
      setTotal(sumaTotal);
    }
  }, [range, roomType, inventarioDinamico, hotelSelected]);

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    setCard({ ...card, expiry: val });
  };

  // 🚀 3. PROCESAR RESERVA Y RESTAR STOCK DÍA POR DÍA
  const handleProcessOrder = async () => {
    if (step === 1) return setStep(2);
    if (step === 2) {
      if (!cliente.nombre || !cliente.email) return alert("Faltan datos de contacto");
      return setStep(3);
    }
    
    setIsProcessing(true);
    const nuevoFolio = `IND-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
    setFolio(nuevoFolio);

    try {
      const hotelRef = doc(db, `${BASE_PATH}/hoteles`, hotelSelected.id);
      const reservasRef = collection(db, `${BASE_PATH}/reservas`);

      await runTransaction(db, async (transaction) => {
        const hotelDoc = await transaction.get(hotelRef);
        if (!hotelDoc.exists()) throw "El hotel no existe.";

        // A. Verificamos cómo guarda la info este hotel
        const isMapBased = !!hotelDoc.data().stock_por_dia;
        let nuevoStockPorDia = isMapBased ? { ...hotelDoc.data().stock_por_dia } : null;

        // B. Obtenemos las fechas exactas que el cliente eligió
        const start = new Date(range.start + 'T00:00:00');
        const end = new Date(range.end + 'T00:00:00');
        let current = new Date(start);
        const fechasARestar = [];

        while (current < end) {
          const year = current.getFullYear();
          const month = String(current.getMonth() + 1).padStart(2, '0');
          const date = String(current.getDate()).padStart(2, '0');
          fechasARestar.push(`${year}-${month}-${date}`);
          current.setDate(current.getDate() + 1);
        }

        // C. Restamos el stock DÍA por DÍA
        for (const fecha of fechasARestar) {
          if (isMapBased) {
            // Si es un mapa (Como Hotel Atizapán)
            const diaData = nuevoStockPorDia[fecha];
            if (!diaData) throw `No hay disponibilidad configurada para el ${fecha}.`;

            const stockDia = diaData.disponible ?? diaData.inventarioTotal ?? 0;
            if (Number(stockDia) <= 0) throw `Lo sentimos, la fecha ${fecha} acaba de agotarse.`;

            // Restamos preservando el nombre del campo original
            if (diaData.disponible !== undefined) {
              nuevoStockPorDia[fecha] = { ...diaData, disponible: Number(stockDia) - 1 };
            } else {
              nuevoStockPorDia[fecha] = { ...diaData, inventarioTotal: Number(stockDia) - 1 };
            }
          } else {
            // Si es sub-colección (Como Hotel Camino Real)
            const dayRef = doc(db, `${BASE_PATH}/hoteles/${hotelSelected.id}/inventario`, fecha);
            const dayDoc = await transaction.get(dayRef);
            if (!dayDoc.exists()) throw `No hay disponibilidad configurada para el ${fecha}.`;

            const stockDia = dayDoc.data().inventarioTotal ?? dayDoc.data().disponible ?? 0;
            if (Number(stockDia) <= 0) throw `Lo sentimos, la fecha ${fecha} acaba de agotarse.`;

            if (dayDoc.data().inventarioTotal !== undefined) {
              transaction.update(dayRef, { inventarioTotal: Number(stockDia) - 1 });
            } else {
              transaction.update(dayRef, { disponible: Number(stockDia) - 1 });
            }
          }
        }

        // D. Guardamos el stock actualizado (Si era de tipo Mapa)
        if (isMapBased) {
          transaction.update(hotelRef, { stock_por_dia: nuevoStockPorDia });
        }

        // E. Creamos la Reserva Oficial
        const newReservaRef = doc(reservasRef);
        transaction.set(newReservaRef, {
          hotelId: hotelSelected.id,
          hotelNombre: hotelSelected.nombre,
          cliente,
          reserva: { range, nights, roomType, total },
          folio: nuevoFolio,
          status: 'paid',
          createdAt: serverTimestamp()
        });
      });

      // Si la transacción no lanzó errores, mostramos éxito
      setTimeout(() => {
        setIsProcessing(false);
        setIsFinished(true);
      }, 2500);

    } catch (e) {
      console.error("Error Transacción: ", e);
      alert(typeof e === 'string' ? e : "Hubo un error al procesar tu reserva. Intenta de nuevo.");
      setIsProcessing(false);
    }
  };

  // --- EL RESTO DEL CÓDIGO VISUAL QUEDA EXACTAMENTE IGUAL ---
  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-700">
        <div className="bg-yellow-400 text-white p-6 rounded-full mb-8 shadow-2xl animate-bounce">
            <PartyPopper size={60} />
        </div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">¡Hecho!</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-10">Reserva confirmada con el folio:</p>
        <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-dashed border-gray-200 w-full max-w-sm mb-10 text-center">
            <p className="text-4xl font-black tracking-[0.1em] text-[#E91E63]">{folio}</p>
        </div>
        <button onClick={onBack} className="w-full max-w-xs bg-[#111] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest">FINALIZAR</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <header className="bg-white border-b border-gray-100 p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-gray-400">
            <ChevronLeft size={20} /> REGRESAR
          </button>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#E91E63]' : 'bg-gray-100'}`} />)}
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-left duration-500">
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50">
                <h3 className="font-black uppercase text-[10px] text-gray-400 mb-6 tracking-widest">1. Selección de fechas</h3>
                <CustomCalendar 
                  hotel={hotelSelected} 
                  inventario={inventarioDinamico} 
                  range={range} 
                  setRange={setRange} 
                  roomType={roomType} 
                />
              </div>
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50">
                 <h3 className="font-black uppercase text-[10px] text-gray-400 mb-6 tracking-widest">2. Tipo de Habitación</h3>
                 {['sencilla', 'doble'].map(t => (
                   <button key={t} onClick={() => setRoomType(t)} className={`w-full p-6 mb-4 rounded-2xl border-2 flex items-center justify-between transition-all ${roomType === t ? 'border-[#E91E63] bg-pink-50' : 'border-gray-50 hover:bg-gray-50'}`}>
                     <div className="flex items-center gap-4 text-left">
                        <div className={`p-3 rounded-xl ${roomType === t ? 'bg-[#E91E63] text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {t === 'sencilla' ? <Users size={20} /> : <Bed size={20} />}
                        </div>
                        <span className="font-black uppercase text-xs">Habitación {t}</span>
                     </div>
                     {roomType === t && <div className="w-3 h-3 bg-[#E91E63] rounded-full" />}
                   </button>
                 ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl max-w-lg mx-auto animate-in zoom-in">
              <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter text-[#111]">Tus <span className="text-[#E91E63]">Datos</span></h2>
              <div className="space-y-4">
                <input placeholder="NOMBRE COMPLETO" className="w-full p-5 bg-gray-50 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-[#E91E63]" onChange={e => setCliente({...cliente, nombre: e.target.value})} />
                <input placeholder="CORREO" className="w-full p-5 bg-gray-50 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-[#E91E63]" onChange={e => setCliente({...cliente, email: e.target.value})} />
                <input placeholder="TELÉFONO" className="w-full p-5 bg-gray-50 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-[#E91E63]" onChange={e => setCliente({...cliente, telefono: e.target.value})} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl max-w-lg mx-auto animate-in zoom-in">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-blue-500">Detalles de Pago</h2>
                <Lock size={20} className="text-blue-500" />
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#222] to-[#111] p-8 rounded-3xl text-white mb-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><CreditCard size={120} /></div>
                    <p className="font-mono tracking-[0.2em] text-lg mb-6">{card.number || '•••• •••• •••• ••••'}</p>
                    <div className="flex justify-between text-[10px] font-mono uppercase opacity-50">
                        <span>{card.name || 'TITULAR'}</span>
                        <span>{card.expiry || 'MM/YY'}</span>
                    </div>
                </div>
                <input placeholder="NÚMERO TARJETA" maxLength="16" className="w-full p-5 bg-gray-50 rounded-2xl font-black text-xs outline-none" onChange={e => setCard({...card, number: e.target.value})} />
                <input placeholder="NOMBRE EN TARJETA" className="w-full p-5 bg-gray-50 rounded-2xl font-black text-xs outline-none uppercase" onChange={e => setCard({...card, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="MM/YY" maxLength="5" value={card.expiry} className="p-5 bg-gray-50 rounded-2xl font-black text-xs outline-none" onChange={handleExpiryChange} />
                    <input placeholder="CVV" maxLength="3" className="p-5 bg-gray-50 rounded-2xl font-black text-xs outline-none" onChange={e => setCard({...card, cvc: e.target.value})} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#111] text-white p-10 rounded-[3.5rem] sticky top-32 shadow-2xl border border-white/5">
            <h4 className="font-black text-xl mb-6 border-b border-white/10 pb-4 italic tracking-tighter uppercase">Resumen</h4>
            <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500"><span>Noches</span><span>{nights}</span></div>
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500"><span>Ocupación</span><span>{roomType}</span></div>
                <div className="flex justify-between pt-6 border-t border-white/10 items-end">
                    <span className="font-black text-[10px] uppercase text-gray-500">Monto Total</span>
                    <span className="font-black text-3xl text-[#E91E63] italic tracking-tighter">${total.toLocaleString()}</span>
                </div>
            </div>
            <button 
                disabled={isProcessing || (step === 1 && !range.end)}
                onClick={handleProcessOrder}
                className={`w-full py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl ${step === 3 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#E91E63] hover:bg-white hover:text-[#111]'} disabled:opacity-20`}
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
              {isProcessing ? 'PROCESANDO...' : step === 3 ? `PAGAR $${total.toLocaleString()}` : 'CONTINUAR'}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                <ShieldCheck size={14} />
                <span className="text-[8px] font-black uppercase tracking-widest">Pago Cifrado Seguro</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;