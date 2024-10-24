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
  v_visible = false;
  v_mensaje = '';
  isToastOpen = false;
  duration: number = 3000;

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

  async login() {
    console.log("PLF: Credenciales de acceso: ")
    console.log("PLF: Correo: " + this.mdl_correo)
    console.log("PLF: Contraseña: " + this.mdl_contrasena)

    try {
      // Login API
      let datos = this.api.loginUsuario(
      this.mdl_correo, this.mdl_contrasena
      );
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);

      if(json.status == "success") {
        this.v_mensaje = "Iniciando Sesión, espere un momento";
        this.isToastOpen = true;
        setTimeout(() => {
          this.isToastOpen = false;
          this.router.navigate(['principal'], { replaceUrl: true});
        }, 3000)
        console.log("PLF API: Inicio de Sesión exitoso")
        // Almacenar Sesión
        await this.db.almacenarSesion(this.mdl_correo, this.mdl_contrasena);
        console.log("PLF: Datos recuperados de API: ")
        console.log("PLF: Correo: " + json.usuario.correo)
        console.log("PLF: Nombre: " + json.usuario.nombre)
        console.log("PLF: Apellido: " + json.usuario.apellido)
        console.log("PLF: Carrera: " + json.usuario.carrera)
        // Login desde BD para almacenar usuario
        /*this.db.loginUsuario(this.mdl_correo, this.mdl_contrasena)
        .then(data => {
          if (data == 1) {
            this.db.almacenarSesion(this.mdl_correo, this.mdl_contrasena);
          } else {
            console.log('PLF BD: Credenciales inválidas')
          }
        })
        .catch(e => console.log('PLF: Error al Iniciar Sesión' + JSON.stringify(e)));*/

        // Actualizar la base de datos local con los datos recuperados de la API
        /*this.db.actualizarUsuario(
          json.usuario.correo,
          this.mdl_contrasena,
          json.usuario.nombre,
          json.usuario.apellido,
          json.usuario.carrera,
          json.usuario.sede
        )*/
        //this.router.navigate(['principal'], { replaceUrl: true });
      } else {
        console.log("PLF API: Error al Iniciar Sesión: " + json.message )
        this.v_visible = true;
        this.v_mensaje = json.message;
      }
    }
    catch (error) {
      console.error("PLF: Error al consumir API", error)
    } 
  }

  signUp() {
    this.router.navigate(['signup'], { replaceUrl: true })
  }

  // Función para abrir Toast
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
