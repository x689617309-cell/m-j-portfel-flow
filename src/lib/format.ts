export const formatCurrencyPLN = (value: number, opts?: { showSign?: boolean }) => {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs).replace(/\u00A0/g, " ");
  const sign = opts?.showSign ? (value > 0 ? "+ " : value < 0 ? "− " : "") : value < 0 ? "− " : "";
  return `${sign}${formatted} zł`;
};

export const formatAmountSimple = (value: number) => {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value)).replace(/\u00A0/g, " ") + " zł";
};

const MONTHS_PL = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];
const MONTHS_PL_SHORT = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
const DAYS_PL_FULL = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

export const monthName = (month: number) => MONTHS_PL[month];
export const monthShort = (month: number) => MONTHS_PL_SHORT[month];

export const formatDatePL = (date: Date) => {
  return `${date.getDate()} ${MONTHS_PL_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDayHeaderPL = (date: Date) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(date); d.setHours(0,0,0,0);
  const diff = (today.getTime() - d.getTime()) / 86400000;
  const dayName = DAYS_PL_FULL[d.getDay()].toUpperCase();
  const datePart = `${d.getDate()} ${MONTHS_PL_SHORT[d.getMonth()].toUpperCase()}`;
  if (diff === 0) return `DZISIAJ · ${datePart}`;
  if (diff === 1) return `WCZORAJ · ${datePart}`;
  return `${dayName}, ${datePart}`;
};

export const monthLabel = (year: number, month: number) => `${monthName(month)} ${year}`;

export const ymKey = (year: number, month: number) => `${year}-${String(month + 1).padStart(2, "0")}`;
