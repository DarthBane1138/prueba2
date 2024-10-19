import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  correo: string = '';
  nombre: string = '';
  apellido: string = ''
  contrasena: string = '';
  carrera: string = '';
  sede: string = '';

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
    console.log("Perfil")
    this.db.obtenerSesion().then(data => {
      this.correo = data.correo;
      this.contrasena = data.contrasena;
      console.log("PLF: Perfil Correo: " + this.correo)
      this.infoUsuario();
    })
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

  irSedes() {
    let extras: NavigationExtras ={
      replaceUrl: true
    }
    this.router.navigate(['sedes'], extras)
  }

  irHome(){
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    this.router.navigate(['principal'], extras)
  }
}
