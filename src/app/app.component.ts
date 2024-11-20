import { Component, OnInit } from '@angular/core';
import { PreferenciaService } from './services/preferencia.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  paletteToggle: boolean = false;

  constructor(private preferenciaService: PreferenciaService) {}

  ngOnInit(): void {
    // Sincroniza el valor inicial del tema con el interruptor
    this.preferenciaService.isDarkMode$.subscribe((isDark) => {
      this.paletteToggle = isDark;
    });
  }

  toggleChange(): void {
    // Cambia el modo oscuro mediante el servicio
    this.preferenciaService.toggleDarkMode();
  }
}
