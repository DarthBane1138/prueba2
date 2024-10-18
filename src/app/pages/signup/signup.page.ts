import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    this.db.almacenarUsuario(
      this.mdl_correo,
      this.mdl_contrasena,
      this.mdl_nombre,
      this.mdl_apellido,
      this.mdl_carrera,
      this.mdl_sede
    );
    this.router.navigate(['login'], extras);
  }

}
