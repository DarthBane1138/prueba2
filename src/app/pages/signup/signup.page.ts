import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
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

  constructor(private router: Router, private db: DbService, private api: ApisService) { }

  ngOnInit() {
  }

  inicio() {
    this.router.navigate(['login'])
  }

  /*registrar() {
    this.db.almacenarUsuario(
      this.mdl_correo,
      this.mdl_contrasena,
      this.mdl_nombre,
      this.mdl_apellido,
      this.mdl_carrera,
      this.mdl_sede
    );
    this.router.navigate(['login'], { replaceUrl: true });
  }*/

  async registrar() {
    let datos = this.api.creacionUsuario(
      this.mdl_correo, this.mdl_contrasena,
      this.mdl_nombre, this.mdl_apellido,
      this.mdl_carrera
    )

    this.db.almacenarUsuario(
      this.mdl_correo,
      this.mdl_contrasena,
      this.mdl_nombre,
      this.mdl_apellido,
      this.mdl_carrera,
      this.mdl_sede
    );

    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    if(json.status == "success") {
      console.log("PLF: Usuario Creado")
      console.log("PLF: Correo: " + this.mdl_correo)
      console.log("PLF: Contraseña: " + this.mdl_contrasena)
      console.log("PLF: Nombre: " + this.mdl_nombre)
      console.log("PLF: Apellido: " + this.mdl_apellido)
      console.log("PLF: Carrera: " + this.mdl_carrera)
      console.log("PLF: Sede: " + this.mdl_sede)
      this.router.navigate(['login'], { replaceUrl: true })
    } else {
      console.log("PLF: Error al Crear Usuario: " + json.message)
    }
  }

}
