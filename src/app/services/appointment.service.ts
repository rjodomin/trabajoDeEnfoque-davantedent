/**
 * Servicio Angular para gestionar citas (AppointmentService). 
 * Permite añadir, eliminar y obtener la lista de citas usando.
 * También persiste los datos en el localStorage para mantener las citas entre sesiones.
 * 
 * @author : Raisa Julia Ochoa Domínguez
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cita } from '../models/cita';

@Injectable({  providedIn: 'root' })

export class AppointmentService {
  private citasSubject = new BehaviorSubject<Cita[]>([]);
  citas$ = this.citasSubject.asObservable();
  private storageKey = 'davanteDentCitas';

  constructor() {
    this.loadCitas();
  }

  /**
   * Carga las citas desde el localStorage
  */

  private loadCitas(): void {
    const citas = localStorage.getItem(this.storageKey);
    if (citas) {
      this.citasSubject.next(JSON.parse(citas));
    }
  }

  /**
   * Guarda las citas actuales en el localStorage
  */

  private saveCitas(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.citasSubject.value));
  }

  /**
   * Añade una nueva cita al sistema
   * @param citaData - Datos de la cita sin id ni createdAt
  */

  addCita(citaData: Omit<Cita, 'id' | 'createdAt'>): void {
    const nuevaCita: Cita = {
      ...citaData,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date()
    };
    const citas = [...this.citasSubject.value, nuevaCita];
    this.citasSubject.next(citas);
    this.saveCitas();
  }

  /**
   * Elimina una cita dado su id
   * @param id - ID de la cita a eliminar
  */

  deleteCita(id: string): void {
    const citas = this.citasSubject.value.filter(cita => cita.id !== id);
    this.citasSubject.next(citas);
    this.saveCitas();
  }
}
