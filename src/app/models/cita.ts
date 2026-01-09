/**
 * Define la estructura de un objeto "Cita" y una función para formatear
 * la fecha y hora de la cita de manera legible.
 * 
 * @author : Raisa Julia Ochoa Domínguez
*/

/**
 * Interfaz que representa una cita médica o de consulta.
*/

export interface Cita {
  id?: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  dia: number;
  mes: number;
  año: number;
  hora: number;
  minuto: number;
  nacimiento: string;
  tratamiento?: string;
  observaciones?: string;
  createdAt?: Date;
}

/**
 * Formatea la fecha y hora de una cita en un string legible.
 * @param cita - Objeto de tipo Cita
 * @returns String en formato "día/mes/año hh:mmh", ejemplo: "15/Feb/2026 09:30h"
 */
export function formatFechaCita(cita: Cita): string {
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${cita.dia}/${meses[cita.mes-1]}/${cita.año} ${cita.hora.toString().padStart(2,'0')}:${cita.minuto.toString().padStart(2,'0')}h`;
}
