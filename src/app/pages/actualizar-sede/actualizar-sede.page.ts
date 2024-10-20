import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actualizar-sede',
  templateUrl: './actualizar-sede.page.html',
  styleUrls: ['./actualizar-sede.page.scss'],
})
export class ActualizarSedePage implements OnInit {

  mdl_contrasena: string = '';
  v_visible: string = '';
  v_mensaje: string = '';
  mdl_sede: string = '';

  constructor() { }

  ngOnInit() {
  }

  cambiarSede() {
    
  }

}
