import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  mdl_correo: string = '';
  mdl_contrasena: string = '';
  mdl_contrasena_conf: string = '';
  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_carrera: string = '';
  mdl_sede: string = '';

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
  }

  inicio() {
    this.router.navigate(['login'])
  }

  registrar() {
    this.db.almacenarUsuario(
      this.mdl_correo,
      this.mdl_contrasena,
      this.mdl_nombre,
      this.mdl_apellido,
      this.mdl_carrera,
      this.mdl_sede
    );
    console.log("Correo: " + this.mdl_correo)
    console.log("Contrasena: " + this.mdl_contrasena)
    console.log("Nombre: " + this.mdl_nombre)
    console.log("Apellido: " + this.mdl_apellido)
    console.log("Carrera: " + this.mdl_carrera)
    console.log("Sede: " + this.mdl_sede)
    this.router.navigate(['login']);
  }

}
