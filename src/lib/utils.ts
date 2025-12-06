import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parseia uma string de data do banco (YYYY-MM-DD) como hora local
 * Adiciona T12:00:00 para evitar que timezone faça a data "pular" para o dia anterior
 */
export function parseDateLocal(dateString: string): Date {
  if (dateString && dateString.length === 10) {
    return new Date(dateString + 'T12:00:00');
  }
  return new Date(dateString);
}
