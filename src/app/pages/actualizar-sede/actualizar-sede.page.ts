import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-actualizar-sede',
  templateUrl: './actualizar-sede.page.html',
  styleUrls: ['./actualizar-sede.page.scss'],
})
export class ActualizarSedePage implements OnInit {

  // Variables para inputs
  mdl_contrasena_actual: string = '';
  mdl_sede_nueva:string = '';
  // Estados alertas
  v_visible = false;
  v_mensaje: string = '';
  // datos desde Siesión
  correo: string = '';
  contrasena: string = '';
  spinnervisible: boolean = false;

  constructor(private db: DbService, private router: Router) { }

  ngOnInit() {
    this.db.obtenerSesion().then(data => {
      this.correo = data.correo;
      this.contrasena = data.contrasena;
    })
  }

  // Se rescata información de usuario desde la Base de Datos
  async infoUsuario() {
    try {
      const data = await this.db.infoUsuario(this.correo, this.contrasena);
      if (data) {
        this.correo = data.correo;
        this.contrasena = data.contrasena;
      } else {
        console.log('PLF: No se encontraron datos para las credenciales proporcionadas.');
      }
    } catch (error) {
      console.error('PLF: Error al recuperar información del usuario:', error);
    }
  }

  // Función para actualización de sede
  async actualizarSede() {
    if (this.contrasena !== this.mdl_contrasena_actual) {
      this.v_visible = true;
      this.v_mensaje = 'Contraseña Incorrecta, intentelo denuevo';
      this.spinnervisible = false;
      console.log("PLF: Contraseña Incorrecta, inténtelo de nuevo");
      return;
    }
    if (this.mdl_sede_nueva === '') {
      this.v_visible = true;
      this.v_mensaje = 'Ingrese una sede para actualizar';
      this.spinnervisible = false;
      return;
    }
    this.spinnervisible = true;
    this.v_visible = false;
    await this.db.actualizarSede(this.mdl_sede_nueva, this.correo, this.mdl_contrasena_actual);
    console.log("Sede actualizada, estás en:");
    console.log(this.mdl_sede_nueva);
    setTimeout(() => {
      this.spinnervisible = false;
      this.router.navigate(['principal'], { replaceUrl: true });
    }, 2000);
  }
  
}
