import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';
import { BedDouble, MapPin } from 'lucide-react';

// Icono Azul Clásico (Para los Hoteles)
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// 🚀 NUEVO: Icono Estrella VIP (Para la Sede del Evento)
const eventIcon = new L.divIcon({
  className: 'custom-event-pin',
  html: `<div style="background-color: #111; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 3px solid white; shadow: 0 10px 15px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

// 🚀 Ahora recibimos el "evento" como prop
const HotelsMap = ({ hoteles, evento, onSelectHotel }) => {
  
  // 1. Buscamos primero centrar el mapa en el EVENTO
  // Si no tiene coordenadas, buscamos el primer hotel. Si no, usamos CDMX por defecto.
  const defaultCenter = evento?.lat && evento?.lng
    ? [Number(evento.lat), Number(evento.lng)]
    : hoteles?.length > 0 && hoteles[0].lat && hoteles[0].lng
      ? [Number(hoteles[0].lat), Number(hoteles[0].lng)]
      : [19.4382, -99.2185]; 

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={14} // Un zoom un poco más cerca (de 13 a 14)
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🚀 DIBUJAMOS EL PIN DEL EVENTO */}
        {evento?.lat && evento?.lng && (
          <Marker position={[Number(evento.lat), Number(evento.lng)]} icon={eventIcon}>
            <Popup className="rounded-xl overflow-hidden">
              <div className="text-center p-2">
                <span className="bg-[#111] text-white text-[8px] uppercase tracking-widest px-2 py-1 rounded-full mb-2 inline-block">Sede Oficial</span>
                <h4 className="font-black text-[#E91E63] uppercase tracking-tighter mb-1">
                  {evento.nombre || "Evento"}
                </h4>
                <p className="text-gray-500 font-bold text-[10px] uppercase">{evento.direccion}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dibujamos los pines de los hoteles */}
        {hoteles.map((hotel) => {
          if (!hotel.lat || !hotel.lng) return null; 

          return (
            <Marker 
              key={hotel.id} 
              position={[Number(hotel.lat), Number(hotel.lng)]} 
              icon={customIcon}
            >
              <Popup className="rounded-xl overflow-hidden">
                <div className="text-center p-1">
                  <h4 className="font-black text-[#111] uppercase tracking-tighter mb-1">
                    {hotel.nombre}
                  </h4>
                  <p className="text-[#E91E63] font-bold text-xs mb-3">
                    Desde ${Number(hotel.precioSencilla || hotel.precio || 0).toLocaleString()}
                  </p>
                  <button 
                    onClick={() => onSelectHotel(hotel)}
                    className="w-full bg-[#111] text-white py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E91E63] transition-colors"
                  >
                    Ver Hotel
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 pointer-events-none">
        <MapPin size={16} className="text-[#E91E63]" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#111]">
          Explora la Zona
        </span>
      </div>
    </div>
  );
};

export default HotelsMap;