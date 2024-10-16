import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  correo: string = '';
  nombre: string = '';
  contrasena: string = '';
  apellido: string = '';

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras?.state) {
      this.correo = extras?.state['correo']
      this.contrasena = extras?.state['contrasena']

      console.log("Correo recibido: " + this.correo)
      console.log("Contrasena recibido: " + this.contrasena)
    } else {
      console.log("No se recibieron parámetros")
    }

    this.infoUsuario();
  }

  infoUsuario() {
    this.db.infoUsuario(this.correo, this.contrasena)
      .then(data => {
        this.nombre = data.nombre;
        this.apellido = data.apellido;
      })
  }

  cerrarSesion() {
    this.router.navigate(['login'])
  }

  irPerfil() {
    this.router.navigate(['profile'])
  }
}
