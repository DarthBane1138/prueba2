import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  correo: string = 'Predeterminado';
  nombre: string = 'Predeterminado';
  contrasena: string = 'Predeterminado';
  apellido: string = 'Predeterminado';
  carrera: string = 'Predeterminado';
  sedeNombre: string = 'Predeterminado';
  sedeApi: string = 'Sede no encontrada'
  sedeAsignada: string = 'Sede no encontrada';
  listaSedes: any [] = [];
  sedeApiNombre: string = ''; 
  sedeApiDireccion: string = ''; 
  sedeApiTelefono: string = ''; 
  sedeApiHorarioAtencion: string = ''; 
  sedeApiImagen: string = ''; 
  

  constructor(private router: Router, private db: DbService, private api: ApisService) { }

  ngOnInit() {
      console.log("PLF: No se recibieron parámetros")
      this.db.obtenerSesion().then(data => {
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        this.infoUsuario();
      })
  }

  infoUsuario() {
    this.db.infoUsuario(this.correo, this.contrasena)
      .then(data => {
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.carrera = data.carrera;
        this.sedeNombre = data.sede;
      })
    this.seleccionarSede();
  }

  async infoUsuarioApi() {
    let datos = this.api.loginUsuario(
      this.correo, this.contrasena
    )
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    if(json.status == "success") {
      this.correo = json.usuario.correo;
      this.nombre = json.usuario.nombre;
      this.apellido = json.usuario.apellido;
      this.carrera = json.usuario.carrera;
      console.log("PLF: Datos rescatados desde API: ")
      console.log("PLF: Correo: " + json.usuario.correo)
      console.log("PLF: Nombre: " + json.usuario.nombre)
      console.log("PLF: Apellido: " + json.usuario.apellido)
      console.log("PLF: Carrea: " + json.usuario.carrera)
    }
  }

  cerrarSesion() {
    this.db.eliminarSesion()
    this.router.navigate(['login'], { replaceUrl: true })
  }

  irPerfil() {
    this.router.navigate(['profile'], { replaceUrl: true })
  }

  navegarCambiarContrasena() {
    let extras: NavigationExtras = {
      state: {
        correo: this.correo,
        contrasena: this.contrasena
      }, replaceUrl: true
    }
    this.router.navigate(['cambiar-contrasena'], extras)
  }

  irSedes() {
    this.router.navigate(['sedes'], { replaceUrl: true })
  }

  async seleccionarSede(){
    this.listaSedes = [];
    let datos = this.api.obtencionSedes();
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    for(let x=0; x< json[0].length; x++) {
      let sede: any = {}
      sede.nombre = json[0][x].NOMBRE;
      sede.direccion = json[0][x].DIRECCION;
      sede.telefono = json[0][x].TELEFONO;
      sede.horario_atencion = json[0][x].HORARIO_ATENCION;
      sede.imagen = json[0][x].IMAGEN;

      if(sede.nombre == this.sedeNombre) {
        this.sedeApiNombre = json[0][x].NOMBRE;
        this.sedeApiDireccion = json[0][x].DIRECCION;
        this.sedeApiTelefono = json[0][x].TELEFONO;
        this.sedeApiHorarioAtencion = json[0][x].HORARIO_ATENCION;
        this.sedeApiImagen = json[0][x].IMAGEN;
      }

      this.listaSedes.push(sede);
    }
    if (this.sedeApi) {
      console.log("PLF Nombre Sede Asignada :" + this.sedeApiNombre)
    } else {
      console.log("PLF: No se encontró una sede con ese nombre.");
    }
  }

  actualizarSede() {
    this.router.navigate(['actualizar-sede'], { replaceUrl: true })
  }

}
