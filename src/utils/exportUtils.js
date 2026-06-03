/**
 * Transforma un array de objetos de reserva en un archivo CSV 
 * y dispara la descarga automáticamente.
 */
export const exportToCSV = (data, fileName = 'reservas_indipris.csv') => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
  
    // Definir los encabezados del CSV
    const headers = ["ID", "Huésped", "Email", "Hotel", "Check-In", "Check-Out", "Estatus", "Fecha Creación"];
    
    // Mapear los datos a filas
    const rows = data.map(res => [
      res.id.slice(-6),
      res.nombre,
      res.email,
      res.hotelNombre,
      res.checkIn,
      res.checkOut,
      res.status,
      new Date(res.createdAt).toLocaleDateString()
    ]);
  
    // Unir todo con comas y saltos de línea
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");
  
    // Crear el blob y disparar descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };