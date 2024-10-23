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
      this.correo,
      this.mdl_contrasena_nueva,
      this.mdl_carrera_nueva
    );
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    console.log("PLF ******: Resultado modificación: " + json.message)

    if(json.status == "success") {
      console.log("PLF: Usuario Modificado exitosamente")
      console.log("PLF: Correo: " + this.correo)
      console.log("PLF: Contraseña: " + this.mdl_contrasena_nueva)
      console.log("PLF: Carrera: " + this.mdl_carrera_nueva)
      let usuarioExiste = await this.db.verificarUsuario(this.correo);
      this.db.actualizarDatos(this.mdl_contrasena_nueva, this.mdl_carrera_nueva, this.correo, this.mdl_actual)
      console.log("Datos actualizados en la base de datos")
      this.cerrarSesion();
    }
  }

  cerrarSesion() {
    this.db.eliminarSesion()
    this.router.navigate(['login'], { replaceUrl: true })
  }

}
