/**
 * Componente que muestra la lista de citas registradas.
 * Permite ver el nombre, apellidos, fecha, teléfono y DNI de cada cita, 
 * y borrar citas mediante el servicio AppointmentService.
 * 
 * @author : Raisa Julia Ochoa Domínguez
*/

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../services/appointment.service';
import { Cita, formatFechaCita } from '../models/cita';

@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lista-container">
      <h2>📋 Citas ({{citas.length}})</h2>
      <div *ngIf="citas.length === 0" class="empty-state">
        <p>📭 No hay citas. ¡Reserva la primera arriba!</p>
      </div>
      <div *ngFor="let cita of citas" class="cita-card">
        <h3>{{cita.nombre}} {{cita.apellidos}}</h3>
        <p>{{formatFechaCita(cita)}}</p>
        <p>☎️ {{cita.telefono}} | {{cita.dni}}</p>
        <button (click)="borrarCita(cita.id!)">🗑️ Borrar</button>
      </div>
    </div>
  `,
  styles: [`
    .lista-container { margin-top: 2rem; }
    .cita-card {
      border: 1px solid #ddd; padding: 1rem; margin: 1rem 0;
      border-radius: 8px; background: #f8f9fa;
    }
  `]
})
export class ListaCitasComponent {
  appointmentService = inject(AppointmentService);
  citas: Cita[] = [];

  constructor() {
    this.appointmentService.citas$.subscribe(citas => {
      this.citas = citas;
    });
  }

  /**
   * Borra una cita dado su id
   * @param id - ID de la cita a borrar
   * Muestra un confirm dialog antes de eliminar.
  */

  borrarCita(id: string): void {
    if (confirm('¿Borrar cita?')) {
      this.appointmentService.deleteCita(id);
    }
  }

  formatFechaCita = formatFechaCita;
}

