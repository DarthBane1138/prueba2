import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-actualizar-sede',
  templateUrl: './actualizar-sede.page.html',
  styleUrls: ['./actualizar-sede.page.scss'],
})
export class ActualizarSedePage implements OnInit {

  mdl_contrasena_actual: string = '';
  v_visible = false;
  v_mensaje: string = '';
  mdl_sede: string = '';
  mdl_sede_nueva:string = '';
  mdl_carrera_nueva: string = '';
  correo: string = '';
  contrasena: string = '';
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';
  sedeNombre: string = '';

  constructor(private db: DbService, private api: ApisService, private router: Router) { }

  ngOnInit() {
    this.db.obtenerSesion().then(data => {
      this.correo = data.correo;
      this.contrasena = data.contrasena;
      /*console.log("PLF: Credenciales Obtenidas de de tabla usuario: ")
      console.log("PLF: Correo:  " + this.correo)
      console.log("PLF: Contraseña: " + this.contrasena)*/
    })
  }

  async infoUsuario() {
    try {
      const data = await this.db.infoUsuario(this.correo, this.contrasena);
      if (data) {
        
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.carrera = data.carrera;
        this.sedeNombre = data.sede;

        /*console.log("PLF: Datos rescatados desde Base de Datos:");
        console.log("PLF: Correo: " + this.correo);
        console.log("PLF: Contraseña : " + this.contrasena);
        console.log("PLF: Nombre: " + this.nombre);
        console.log("PLF: Apellido: " + this.apellido);
        console.log("PLF: Carrera: " + this.carrera);
        console.log("PLF: Sede: " + this.sedeNombre);*/
        
      } else {
        console.log('PLF: No se encontraron datos para las credenciales proporcionadas.');
      }
    } catch (error) {
      console.error('PLF: Error al recuperar información del usuario:', error);
    }
  }

  async actualizarSede() {
    if(this.contrasena == this.mdl_contrasena_actual) {
      await this.db.actualizarSede(this.mdl_sede_nueva, this.correo, this.mdl_contrasena_actual);
      console.log("Sede actualizada, estás en:");
      console.log(this.mdl_sede_nueva);
      this.router.navigate(['principal'], { replaceUrl: true })
    } else {
      this.v_visible = true;
      this.v_mensaje = 'Contraseña Incorrecta, intentelo denuevo';
      console.log("PLF: Contraseña Incorrecta, inténtelo de nuevo")
    }
  }
}
