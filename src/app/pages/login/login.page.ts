import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mdl_correo: string = '';
  mdl_contrasena: string = '';
  correo: string = '';
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';

  constructor(private router: Router, private db: DbService, private api: ApisService) { }

  ngOnInit() {
    console.log("PLF: Login")
  }

  /*login() {
    let extras: NavigationExtras = {
      state: {
        "correo": this.mdl_correo,
        "contrasena": this.mdl_contrasena
      }, replaceUrl: true
    }

    this.db.loginUsuario(this.mdl_correo, this.mdl_contrasena)
      .then(data => {
        if (data == 1) {
          this.db.almacenarSesion(this.mdl_correo, this.mdl_contrasena);
          this.router.navigate(['principal'], extras);
        } else {
          console.log('PLF: Credenciales inválidas')
        }
      })
      .catch(e => console.log('PLF: Error al Iniciar Sesión' + JSON.stringify(e)));
  }*/

      // Me da error, pero el de la API :) vuelvo después de obtener el error de registro
  async login() {
    try {
      let datos = this.api.loginUsuario(
      this.mdl_correo, this.mdl_contrasena
      );
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);

      if(json.status == "success") {
        console.log("PLF: Inicio de Sesión exitoso")
        // Almacenar Sesión
        await this.db.almacenarSesion(this.mdl_correo, this.mdl_contrasena);
        console.log("Datos recuperados de API: ")
        console.log("PLF: Correo: " + json.usuario.correo)
        console.log("PLF: Nombre: " + json.usuario.nombre)
        console.log("PLF: Apellido: " + json.usuario.apellido)
        console.log("PLF: Carrera: " + json.usuario.carrera)
        // Actualizar la base de datos local con los datos recuperados de la API
        this.db.actualizarUsuario(
          json.usuario.correo,
          this.mdl_contrasena,
          json.usuario.nombre,
          json.usuario.apellido,
          json.usuario.carrera,
          json.usuario.sede
        )
        this.router.navigate(['principal'], { replaceUrl: true });
      } else {
        console.log("PLF: else")
        console.log("PLF API: Error al Iniciar Sesión: " + json.message )
      }
    }
    catch (error) {
      console.error("PLF: Error al consumir API", error)
    }
  }

  signUp() {
    this.router.navigate(['signup'], { replaceUrl: true })
  }

}
