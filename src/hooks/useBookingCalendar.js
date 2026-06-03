import { useState } from 'react';
import { getLocalYMD } from '../utils/dateUtils';

export const useBookingCalendar = (minDate, maxDate) => {
  const [range, setRange] = useState({ start: null, end: null });

  const handleDateClick = (dateStr) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: dateStr, end: null });
    } else {
      if (new Date(dateStr) < new Date(range.start)) {
        setRange({ start: dateStr, end: null });
      } else {
        setRange({ ...range, end: dateStr });
      }
    }
  };

  return { range, handleDateClick };
};