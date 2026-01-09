/**
 * Componente que representa el pie de página de la web.
 * Muestra información de contacto de la clínica, como nombre, dirección, teléfono,
 * email y horario de atención. Usa template y estilos externos.
 * 
 * @author : Raisa Julia Ochoa Domínguez
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',          
  standalone: true,                 
  imports: [CommonModule],          
  templateUrl: './footer.component.html',  
  styleUrls: ['./footer.component.scss']  
})
export class FooterComponent {
  
  // Datos de contacto de la clínica para mostrar en el footer
  clinica = {
    nombre: '🏥 Clínica Dental DavanteDent',   
    direccion: 'C/ Estrella Canopus, 12<br>41015 Sevilla, Sevilla, Andalucía (ES)', 
    telefono: '+34 956 000 000',                      
    email: 'info@clinicasdavantedent.es',                    
    horario: 'L-V: 9:00-21:00 | Sáb: 10:00-14:00'   
  };
}
