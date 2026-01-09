
import { Component } from '@angular/core';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { ListaCitasComponent } from './lista-citas/lista-citas.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppointmentFormComponent,
    ListaCitasComponent,
    FooterComponent,
    HeaderComponent          
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'davante-dent';
}
