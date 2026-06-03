export default function Calendar({
    stock,
    startDate,
    endDate,
    onSelect
  }) {
    if (!stock) return null;
  
    const dates = Object.keys(stock).sort(
      (a, b) => new Date(a) - new Date(b)
    );
  
    const isInRange = (date) => {
      if (!startDate || !endDate) return false;
      return date > startDate && date < endDate;
    };
  
    return (
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        
        {/* Días semana */}
        <div className="grid grid-cols-7 text-[10px] font-bold text-gray-400 mb-2 text-center">
          {["D","L","M","M","J","V","S"].map((d,i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
  
        <div className="grid grid-cols-7 gap-2">
          {dates.map((date) => {
            const data = stock[date];
            const disponible = data.disponible;
            const precio = data.precioSencilla;
  
            const isStart = date === startDate;
            const isEnd = date === endDate;
            const inRange = isInRange(date);
  
            return (
              <button
                key={date}
                disabled={disponible <= 0}
                onClick={() => onSelect(date)}
                className={`
                  relative h-16 rounded-xl text-center transition-all
                  border text-black
                  ${
                    disponible <= 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:border-[#E91E63]"
                  }
                  ${inRange ? "bg-pink-100" : ""}
                  ${isStart || isEnd ? "bg-[#E91E63]/20 border-[#E91E63]" : ""}
                `}
              >
                <div className="font-bold text-sm">
                  {date.split("-")[2]}
                </div>
  
                <div className="text-[10px] text-gray-500">
                  ${precio}
                </div>
  
                {disponible <= 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold bg-white/70 rounded-xl">
                    Agotado
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  