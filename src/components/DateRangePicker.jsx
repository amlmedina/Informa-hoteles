import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Ban } from "lucide-react";

const toYMD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function DateRangePicker({
  hotelData,
  eventStart,
  eventEnd,
  onSelect
}) {

  const initialDate = eventStart
    ? new Date(eventStart + "T12:00:00")
    : new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    )
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const totalDays = lastDay.getDate();
    const startWeekDay = firstDay.getDay();

    const result = [];

    for (let i = 0; i < startWeekDay; i++) {
      result.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      result.push(new Date(year, month, d));
    }

    return result;
  }, [currentMonth]);

  const handleClick = (dateObj) => {
    const ymd = toYMD(dateObj);
    const stockInfo = hotelData?.stock_por_dia?.[ymd];

    if (!stockInfo || stockInfo.disponible <= 0) return;

    if (!startDate) {
      setStartDate(ymd);
      setEndDate("");
      onSelect(ymd, "");
      return;
    }

    if (!endDate) {
      if (ymd <= startDate) {
        setStartDate(ymd);
        onSelect(ymd, "");
        return;
      }

      setEndDate(ymd);
      onSelect(startDate, ymd);
      return;
    }

    setStartDate(ymd);
    setEndDate("");
    onSelect(ymd, "");
  };

  const isSelected = (ymd) =>
    ymd === startDate || ymd === endDate;

  const isInRange = (ymd) =>
    startDate &&
    endDate &&
    ymd > startDate &&
    ymd < endDate;

  const isEventDay = (ymd) =>
    eventStart &&
    eventEnd &&
    ymd >= eventStart &&
    ymd <= eventEnd;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-3xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
              )
            )
          }
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="font-bold text-lg capitalize">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric"
          })}
        </h2>

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
              )
            )
          }
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>

      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 mb-2 text-xs font-bold text-gray-400 text-center">
        {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => {
          return <div key={i}>{d}</div>;
        })}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">

        {days.map((dateObj, idx) => {

          if (!dateObj) {
            return <div key={idx}></div>;
          }

          const ymd = toYMD(dateObj);
          const stockInfo = hotelData?.stock_por_dia?.[ymd];

          const disabled =
            !stockInfo ||
            stockInfo.disponible <= 0;

          const selected = isSelected(ymd);
          const inRange = isInRange(ymd);
          const eventDay = isEventDay(ymd);

          return (
            <div
              key={ymd}
              onClick={() => {
                if (!disabled) handleClick(dateObj);
              }}
              className={`
                relative p-3 rounded-2xl text-center cursor-pointer transition-all
                ${disabled ? "bg-slate-50 text-slate-300 cursor-not-allowed" : ""}
                ${selected ? "bg-[#E91E63] text-white font-bold" : ""}
                ${inRange ? "bg-[#E91E63]/10 text-[#E91E63]" : ""}
                ${!disabled && !selected && !inRange ? "hover:bg-gray-100" : ""}
              `}
            >

              {eventDay && !disabled && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
              )}

              <div className="text-sm">
                {dateObj.getDate()}
              </div>

              {!disabled && stockInfo && (
                <div className={`text-[10px] mt-1 ${selected ? "text-white/80" : "text-gray-500"}`}>
                  ${stockInfo.precioSencilla}
                </div>
              )}

              {disabled && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <Ban size={14} />
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}
