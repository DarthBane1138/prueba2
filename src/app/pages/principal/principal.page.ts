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
  sedeNombre: string = '';
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
      this.db.obtenerSesion().then(data => {
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        /*console.log("PLF Credenciales Obtenidas de tabla usuario:")
        console.log("PLF Correo: " + this.correo)
        console.log("PLF Contraseña: " + this.contrasena)*/
        this.infoUsuario();
        this.infoUsuarioApi();
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
        
        this.seleccionarSede();

        console.log("PLF: Datos rescatados desde Base de Datos:");
        console.log("PLF: Correo: " + this.correo);
        console.log("PLF: Contraseña : " + this.contrasena);
        console.log("PLF: Nombre: " + this.nombre);
        console.log("PLF: Apellido: " + this.apellido);
        console.log("PLF: Carrera: " + this.carrera);
        console.log("PLF: Sede: " + this.sedeNombre);
  
        
      } else {
        console.log('PLF: No se encontraron datos para las credenciales proporcionadas.');
      }
    } catch (error) {
      console.error('PLF: Error al recuperar información del usuario:', error);
    }
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
      let usuarioExiste = await this.db.verificarUsuario(this.correo);

      if (usuarioExiste) {
        // Si existe, se actualiza
        await this.db.actualizarUsuario(
          this.correo, this.contrasena, this.nombre,
          this.apellido, this.carrera, this.sedeNombre
        );
        /*console.log("PLF: Usuario actualizado correctamente.");*/
      } else {
        // Si no existe, se crea un nuevo usuario
        await this.db.almacenarUsuario(
          this.correo, this.contrasena, this.nombre,
          this.apellido, this.carrera, this.sedeNombre
        );
        console.log("PLF: Nuevo usuario almacenado en la base de datos.");
      }
    } else {
      console.log("PLF No se han podido recuperar los datos desde la API")
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

  irActualizarSede() {
    this.router.navigate(['actualizar-sede'], { replaceUrl: true })
  }

}
