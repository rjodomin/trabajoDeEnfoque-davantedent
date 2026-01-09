/**
 * Componenete que representa el encabezado de la web.
 * Muestra el nombre y el slogan de la clínica.
 * 
 * @author : Raisa Julia Ochoa Domínguez
 */
  

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',          
  standalone: true,                 
  imports: [CommonModule],          
  templateUrl: './header.component.html', 
  styleUrls: ['./header.component.scss']  
})
export class HeaderComponent {

  // Datos de la clínica para mostrar en el header
  clinica = {
    nombre: '🏥 Clínica Dental DavanteDent', 
    slogan: 'Gestión local de citas - Sucursal Sevilla Norte', 
  };
}
