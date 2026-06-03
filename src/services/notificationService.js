import { formatCurrency } from '../utils/dateUtils';

export const notificationService = {
  sendConfirmationEmail: async (resId, bookingData, hotel) => {
    const templateParams = {
      to_name: bookingData.nombre,
      to_email: bookingData.email,
      hotel_name: hotel.nombre,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      reservation_id: resId.slice(-8).toUpperCase(),
      total_formatted: formatCurrency(bookingData.total || 0),
      event_name: "Abastur 2026"
    };

    console.log("Simulando envío de correo:", templateParams);
    return Promise.resolve({ success: true });
  }
};