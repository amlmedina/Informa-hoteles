/**
 * Genera una fecha en formato YYYY-MM-DD sin desfases de zona horaria
 */
export const getLocalYMD = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Genera un array de strings YYYY-MM-DD entre dos fechas
 */
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let [y, m, d] = startDate.split('-').map(Number);
  let curr = new Date(y, m - 1, d);
  
  let [ey, em, ed] = endDate.split('-').map(Number);
  const end = new Date(ey, em - 1, ed);

  while (curr < end) {
    dates.push(getLocalYMD(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};