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
  v_visible = false;
  v_mensaje = '';
  isToastOpen = false;
  duration: number = 3000;
  spinnervisible: boolean = false;

  constructor(private router: Router, private db: DbService, private api: ApisService) { }

  ngOnInit() {
    console.log("PLF: Login")
  }

  // Función para login desde API
  async login() {
    try {
      // Login API
      let datos = this.api.loginUsuario(
      this.mdl_correo, this.mdl_contrasena
      );
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      if(json.status == "success") {
        this.spinnervisible = true;
        this.v_visible = false;
        this.v_mensaje = "Iniciando Sesión, espere un momento";
        this.isToastOpen = true;
        setTimeout(() => {
          this.spinnervisible = false;
          this.isToastOpen = false;
          this.router.navigate(['principal'], { replaceUrl: true});
        }, 3000)
        // Almacenar Sesión, para mantener usuario activo al cerrar aplicación
        await this.db.almacenarSesion(this.mdl_correo, this.mdl_contrasena);
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

  // Función para navegar a Registro de Usuario
  signUp() {
    this.router.navigate(['signup'], { replaceUrl: true })
  }

  // Función para abrir Toast
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
