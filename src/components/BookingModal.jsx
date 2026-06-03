import { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import useEventConfig from "../hooks/useEventConfig";

export default function BookingModal({
  hotel,
  onClose,
  onConfirm
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const eventConfig = useEventConfig();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-white w-[900px] rounded-3xl p-8 relative shadow-2xl">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black"
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-6 text-black">
          {hotel.nombre}
        </h2>

        {/* Calendario dinámico */}
        {eventConfig ? (
          <DateRangePicker
            hotelData={hotel}
            eventStart={eventConfig.eventStart}
            eventEnd={eventConfig.eventEnd}
            onSelect={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        ) : (
          <div className="text-center py-10 text-gray-400">
            Cargando calendario...
          </div>
        )}

        {/* Footer selección */}
        {startDate && endDate && (
          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-black font-bold">
              {startDate} → {endDate}
            </span>

            <button
              onClick={() =>
                onConfirm(startDate, endDate)
              }
              className="bg-[#E91E63] text-white px-6 py-3 rounded-2xl hover:bg-black transition-all"
            >
              Continuar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
