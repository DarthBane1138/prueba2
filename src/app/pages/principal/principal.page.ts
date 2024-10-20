import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  correo: string = 'Predeterminado';
  nombre: string = 'Predeterminado';
  contrasena: string = 'Predeterminado';
  apellido: string = 'Predeterminado';
  carrera: string = 'Predeterminado';
  sede: string = 'Predeterminado';

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras?.state) {
      this.correo = extras?.state['correo']
      this.contrasena = extras?.state['contrasena']
      this.infoUsuario();
    } else {
      console.log("PLF: No se recibieron parámetros")
      this.db.obtenerSesion().then(data => {
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        this.infoUsuario();
      })
    }
  }

  infoUsuario() {
    this.db.infoUsuario(this.correo, this.contrasena)
      .then(data => {
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.carrera = data.carrera;
        this.sede = data.sede;
      })
  }

  cerrarSesion() {
    this.db.eliminarSesion()
    this.router.navigate(['login'], { replaceUrl: true })
  }

  irPerfil() {
    this.router.navigate(['profile'], { replaceUrl: true })
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

  irSedes() {
    this.router.navigate(['sedes'], { replaceUrl: true })
  }
}
