import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage implements OnInit {

  correo: string = '';
  contrasena: string = '';
  mdl_actual: string = '';
  mdl_contrasena_nueva: string = '';
  mdl_confirmacion: string = '';
  v_visible = false;
  v_mensaje = '';
  mdl_carrera_nueva: string = '';
  mdl_correo_actual: string = '';
  isAlertOpen = false;
  alertButtons = ['OK'];

  constructor(private router: Router, private api: ApisService, private db: DbService) { }

  ngOnInit() {
    this.db.obtenerSesion().then(data => {
      this.correo = data.correo;
      this.contrasena = data.contrasena;
      console.log("PLF: Credenciales Obtenidas de de tabla usuario: ")
      console.log("PLF: Correo:  " + this.correo)
      console.log("PLF: Contraseña: " + this.contrasena)
    })
  }

  async actualizarUsuario() {
    let datos = this.api.modificacionUsuario(
      this.mdl_correo_actual,
      this.mdl_contrasena_nueva,
      this.mdl_carrera_nueva
    );
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    /*console.log("PLF : Resultado modificación API: " + json.message)*/

    if(json.status == "success") {
      this.v_visible = false;
      this.isAlertOpen = true;
      this.v_mensaje = json.message;
      /*console.log("PLF: Correo: " + this.correo)
      console.log("PLF: Correo Antiguo: " + this.correo)
      console.log("PLF: Contraseña: " + this.mdl_actual)
      console.log("PLF: Carrera: " + this.mdl_carrera_nueva)*/
      await this.db.verificarUsuario(this.correo);
      this.db.actualizarDatos(this.mdl_contrasena_nueva, this.mdl_carrera_nueva, this.correo, this.contrasena)
      /* console.log("Datos actualizados en la base de datos") */
      setTimeout(() => {
        // this.spinnervisible = false;
        this.isAlertOpen = false;
        this.router.navigate(['login'], { replaceUrl: true});
      }, 3000)
      this.cerrarSesion();
    } else {
      this.v_visible = true;
      this.v_mensaje = json.message;
      }
  }

  cerrarSesion() {
    this.db.eliminarSesion()
    this.router.navigate(['login'], { replaceUrl: true })
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

}
