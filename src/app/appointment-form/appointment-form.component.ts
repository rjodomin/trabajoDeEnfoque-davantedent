/**
 * Componente encargado de gestionar el formulario de creación de citas.
 * Permite introducir los datos del paciente, validar la información
 * introducida y enviar la cita al servicio correspondiente para su
 * almacenamiento.
 * 
 * @author : Raisa Julia Ochoa Domínguez
 * 
 */

// Importaciones de Angular así como de los modulos y servicios necesarios
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { Cita } from '../models/cita';

@Component({
  selector: 'app-appointment-form',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})

/**
 * Creación de la clase para el formulario. 
 */
export class AppointmentFormComponent {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  form: FormGroup;

  errores: { [key: string]: string } = {};

  get erroresCount(): number {
    return Object.keys(this.errores).length;
  }

  // Fecha mínima permitida para el input datetime-local
  // Evita seleccionar fechas anteriores al momento actual
  minFechaHora: string;

  constructor() {
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
    const dd = String(ahora.getDate()).padStart(2, '0');
    const hh = String(ahora.getHours()).padStart(2, '0');
    const mi = String(ahora.getMinutes()).padStart(2, '0');

    // Formato requerido por el input datetime-local
    this.minFechaHora = `${dd}-${mm}-${yyyy}T${hh}:${mi}`;

    // Formulario y validadores básicos
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      fechaHora: ['', [Validators.required]],
      nacimiento: ['', [Validators.required]],
      tratamiento: [''],
      observaciones: ['']
    });
  }

  /**
   * Valida un DNI o NIE español
   * Comprueba formato y letra de control
   */
  validarDNI(dniInput: string): boolean {
    const dni = dniInput.toUpperCase().trim().replace(/\s/g, '');

    const regexDNI = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    const regexNIE = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

    if (!regexDNI.test(dni) && !regexNIE.test(dni)) {
      this.errores['dni'] = '❌ Formato inválido (12345678Z o X1234567R)';
      return false;
    }
  
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let numero = dni.slice(0, -1);

    if (dni.startsWith('X')) numero = '0' + numero.slice(1);
    else if (dni.startsWith('Y')) numero = '1' + numero.slice(1);
    else if (dni.startsWith('Z')) numero = '2' + numero.slice(1);

    const num = parseInt(numero, 10);
    const letraEsperada = letras[num % 23];
    const letraDNI = dni.slice(-1);

    if (letraEsperada !== letraDNI) {
      this.errores['dni'] = `❌ Letra incorrecta. Debería ser: ${letraEsperada}`;
      return false;
    }

    return true;
  }

  /**
   * Validación manual completa del formulario
   */
  validarFormulario(): boolean {
    // Reinicio de los errores
    this.errores = {};
    const formValue = this.form.value;

    // Sólo letras en nombre y apellidos
    if (!formValue['nombre'] || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formValue['nombre'])) {
      this.errores['nombre'] = '❌ Solo letras en nombre (mínimo 2 caracteres)';
    }

    if (!formValue['apellidos'] || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formValue['apellidos'])) {
      this.errores['apellidos'] = '❌ Solo letras en apellidos (mínimo 2 caracteres)';
    }

    // Llamada a la función validarDNI para la validación de este
    if (!formValue['dni']) {
      this.errores['dni'] = '❌ DNI/NIE obligatorio';
    } else {
      this.validarDNI(formValue['dni']);
    }

    // Teléfono sólo 9 numeros
    if (!/^\d{9}$/.test(formValue['telefono'] || '')) {
      this.errores['telefono'] = '❌ Teléfono: 9 dígitos (612345678)';
    }

    // Comprobación de selección de fecha y hora
    if (!formValue['fechaHora']) {
      this.errores['fechaHora'] = '❌ Debe seleccionar fecha y hora de la cita';
    } else {
      const seleccionada = new Date(formValue['fechaHora']);
      const ahora = new Date();
      if (isNaN(seleccionada.getTime()) || seleccionada < ahora) {
        this.errores['fechaHora'] = '❌ La fecha/hora debe ser posterior al momento actual';
      }
    }

    // Fecha de nacimiento obligatoria
    if (!formValue['nacimiento']) {
      this.errores['nacimiento'] = '❌ Fecha de nacimiento obligatoria';
    }

    // Tratamiento obligatorio
    if (!formValue['tratamiento']) {
      this.errores['tratamiento'] = '❌ Debe seleccionar un tratamiento a recibir';
    }

    // Si hubiese errores se muestra un alert informativo con los mensajes pertinentes a cada error
    if (Object.keys(this.errores).length > 0) {
      const erroresLista = Object.values(this.errores).join('\n');
      alert(
        '🚫 NO SE PUDO RESERVAR LA CITA\n\n' +
        erroresLista +
        '\n\nPor favor corrige los campos marcados.'
      );
      return false;
    }

    return true;
  }

  /**
   * Envío del formulario
   * Crea el objeto Cita y lo envía al servicio
   */
  onSubmit(): void {
    if (this.validarFormulario()) {
      const formValue = this.form.value;
      const fecha = new Date(formValue['fechaHora']);

      const datos: Cita = {
        nombre: formValue['nombre'],
        apellidos: formValue['apellidos'],
        dni: formValue['dni'].toUpperCase(),
        telefono: formValue['telefono'],
        nacimiento: formValue['nacimiento'],

        dia: fecha.getDate(),
        mes: fecha.getMonth() + 1,
        año: fecha.getFullYear(),
        hora: fecha.getHours(),
        minuto: fecha.getMinutes(),

        tratamiento: formValue['tratamiento'],
        observaciones: formValue['observaciones'],
        createdAt: new Date() 
      };

      // Alert de confirmación
      alert(
        '✅ ¡CITA RESERVADA CORRECTAMENTE!\n\n' +
        `Paciente: ${datos.nombre} ${datos.apellidos}\n` +
        `DNI: ${datos.dni}\n` +
        `Fecha: ${datos.dia}/${datos.mes}/${datos.año} ` +
        `${datos.hora.toString().padStart(2,'0')}:${datos.minuto.toString().padStart(2,'0')}h`
      );

      // Se guarda la cita usando el servicio
      this.appointmentService.addCita(datos);

      // Reinicio del formulario
      this.form.reset();
    }
  }

  /**
   * Devuelve el mensaje de error de un campo concreto
   * Se utiliza en la plantilla HTML
   */
  getError(campo: string): string {
    return this.errores[campo] || '';
  }
}
