import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
  contrasena2: string = '';

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras?.state) {
      this.correo = extras?.state['correo']
      this.contrasena = extras?.state['contrasena']
    } else {
      console.log("PLF: No se recibieron parámetros")
    }

    if(this.contrasena == '') {
      this.db.obtenerSesion().then(data => {
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        this.infoUsuario();
      })
    } else {
      this.infoUsuario();
    }
  }

  infoUsuario() {
    this.db.infoUsuario(this.correo, this.contrasena)
      .then(data => {
        this.correo = data.correo;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.contrasena2 = data.contrasena;
      })
  }

  cerrarSesion() {
    this.router.navigate(['login'])
  }

  irPerfil() {
    this.router.navigate(['profile'])
  }

  navegarCambiarContrasena() {
    let extras: NavigationExtras = {
      state: {
        correo: this.correo,
        contrasena: this.contrasena
      }, replaceUrl: true
    }
    this.router.navigate(['cambiar-contrasena'], extras)
  }
}
