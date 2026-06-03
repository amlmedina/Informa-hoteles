
import { useMemo } from "react";

const formatYMD = (date) =>
  date.toISOString().split("T")[0];

export default function CalendarPro({
  stock,
  startDate,
  endDate,
  onSelectStart,
  onSelectEnd
}) {

  const dates = useMemo(() => {
    return Object.keys(stock)
      .sort()
      .map(d => ({
        date: d,
        ...stock[d]
      }));
  }, [stock]);

  const handleClick = (date) => {
    if (!startDate) {
      onSelectStart(date);
      return;
    }

    if (!endDate) {
      if (date <= startDate) {
        onSelectStart(date);
        return;
      }

      onSelectEnd(date);
      return;
    }

    onSelectStart(date);
    onSelectEnd("");
  };

  return (
    <div className="grid grid-cols-7 gap-3">

      {dates.map(day => {

        const disabled =
          day.disponible <= 0;

        const selected =
          day.date === startDate ||
          day.date === endDate;

        const inRange =
          startDate &&
          endDate &&
          day.date > startDate &&
          day.date < endDate;

        return (
          <div
            key={day.date}
            onClick={() =>
              !disabled && handleClick(day.date)
            }
            className={`
              p-3 rounded-2xl cursor-pointer text-center
              ${disabled && "bg-gray-200 text-gray-400 cursor-not-allowed"}
              ${selected && "bg-[#E91E63] text-black font-bold"}
              ${inRange && "bg-pink-100 text-black"}
              ${!disabled && !selected && "hover:bg-gray-100"}
            `}
          >
            <div className="text-sm font-semibold">
              {day.date.split("-")[2]}
            </div>

            <div className="text-xs mt-1">
              ${day.precioSencilla}
            </div>
          </div>
        );
      })}
    </div>
  );
}
