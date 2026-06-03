import { useState } from "react";
import Calendar from "./Calendar";
import { getNights } from "../utils/dateUtils";

export default function ReservationPanel({
  hotel,
  onConfirm
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const stock = hotel.stock_por_dia || {};

  const handleSelect = (date) => {
    if (!startDate) {
      setStartDate(date);
      return;
    }

    if (!endDate) {
      if (date <= startDate) {
        setStartDate(date);
        return;
      }

      const rangeDates = Object.keys(stock)
        .sort((a, b) => new Date(a) - new Date(b))
        .filter(d => d >= startDate && d < date);

      const invalid = rangeDates.some(
        d => stock[d]?.disponible <= 0
      );

      if (invalid) {
        alert("Hay días sin disponibilidad en ese rango");
        return;
      }

      setEndDate(date);
      return;
    }

    setStartDate(date);
    setEndDate("");
  };

  const nights =
    startDate && endDate
      ? getNights(startDate, endDate)
      : 0;

  return (
    <div className="mt-6 p-6 bg-white rounded-3xl shadow-xl border">
      <h3 className="font-bold mb-4 text-gray-800">
        Selecciona fechas
      </h3>

      <Calendar
        stock={stock}
        startDate={startDate}
        endDate={endDate}
        onSelect={handleSelect}
      />

      {nights > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-gray-700 font-bold">
            {nights} noches
          </div>

          <button
            onClick={() =>
              onConfirm(startDate, endDate)
            }
            className="bg-[#E91E63] text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition"
          >
            Confirmar reserva
          </button>
        </div>
      )}
    </div>
  );
}
