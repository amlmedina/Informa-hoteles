import { useReservas } from "../hooks/useReservas";

export default function AdminPanel({ onBack }) {
  const reservas = useReservas();

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-3xl font-bold mb-8">
        Panel Administrativo
      </h1>

      <button
        onClick={onBack}
        className="mb-6 bg-black text-white px-4 py-2 rounded-xl"
      >
        Regresar
      </button>

      <div className="space-y-4">
        {reservas.length === 0 && (
          <p>No hay reservas todavía.</p>
        )}

        {reservas.map((r) => (
          <div
            key={r.id}
            className="border p-4 rounded-xl shadow-sm"
          >
            <div className="font-bold text-[#E91E63]">
              {r.confirmacion}
            </div>

            <div className="text-sm">
              Hotel: {r.hotelId}
            </div>

            <div className="text-sm">
              {r.fechaEntrada} → {r.fechaSalida}
            </div>

            <div className="text-sm">
              Noches: {r.noches}
            </div>

            <div className="text-sm font-bold">
              Total: ${r.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
