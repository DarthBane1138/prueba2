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

  // Variables rescatadas de API
  correo: string = '';
  nombre: string = '';
  contrasena: string = '';
  apellido: string = '';
  carrera: string = '';
  // Variables de sede usuario
  sedeNombre: string = '';
  sedeApi: string = 'Sede no encontrada'
  sedeAsignada: string = 'Sede no encontrada';
  // Para listar sedes
  listaSedes: any [] = [];
  sedeApiNombre: string = ''; 
  sedeApiDireccion: string = ''; 
  sedeApiTelefono: string = ''; 
  sedeApiHorarioAtencion: string = ''; 
  sedeApiImagen: string = '';
  // Varibales para alerta
  isAlertOpen = false;
  v_mensaje: string = '';
  alertButtons = ['OK'];
  // Confirm Buttons para alerta de cierre de sesión
  confirmButtons = [
    {
      text: 'No',
      role: 'cancel',
      handler: () => {
        console.log("PLF alerta: Alerta Cancelada");
      },
    },
    {
      text: 'Sí',
      role: 'confirm',
      handler: () => {
        console.log('PLF alerta: Alerta Confirmada');
        this.cerrarSesion(); // Se llama a función cerrar sesión al confirmar
      },
    },
  ]

  constructor(private router: Router, private db: DbService, private api: ApisService) { }

  ngOnInit() {
      this.db.obtenerSesion().then(async (data) => {
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        await this.infoUsuario();
        await this.infoUsuarioApi();
        setTimeout(() => {
          this.solicitudActualizarSede();
        }, 2000);
      })
  }
  
  // Obtención de datos por API
  async infoUsuarioApi() {
    let datos = this.api.loginUsuario(
      this.correo, this.contrasena
    )
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    if(json.status == "success") {
      // Asignación de variables
      this.correo = json.usuario.correo;
      this.nombre = json.usuario.nombre;
      this.apellido = json.usuario.apellido;
      this.carrera = json.usuario.carrera;
      // Verificación de usuario en Base de Datos
      let usuarioExiste = await this.db.verificarUsuario(this.correo);
      if (usuarioExiste) {
        // Si existe, se actualiza
        await this.db.actualizarUsuario(
          this.correo, this.contrasena, this.nombre,
          this.apellido, this.carrera, this.sedeNombre
        );
        console.log("PLF: Usuario actualizado correctamente.");
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

  // Obtención de información desde Base de Datos
  async infoUsuario() {
    try {
      const data = await this.db.infoUsuario(this.correo, this.contrasena);
      if (data) {
        // Se obtienen datos
        this.correo = data.correo;
        this.contrasena = data.contrasena;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.carrera = data.carrera;
        this.sedeNombre = data.sede;
        // Selección de sede con nombre de sede
        this.seleccionarSede();
        // console.log para depuración
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

  // Función para seleccionar sede actual de usuario
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
  
  // Función para cerrar Sesión
  cerrarSesion() {
    this.db.eliminarSesion()
    this.router.navigate(['login'], { replaceUrl: true })
  }

  // Navegación a página de cambio de contraseña
  navegarCambiarContrasena() {
    this.router.navigate(['cambiar-contrasena'], { replaceUrl: true })
  }

  // Navegación para actualizar sede
  irActualizarSede() {
    this.router.navigate(['actualizar-sede'], { replaceUrl: true })
  }

  // Recordatorio para actualizar sede
  solicitudActualizarSede() {
    if (this.sedeNombre == '') {
      this.isAlertOpen = true;
      this.v_mensaje = "No tienes una sede asignada, te invitamos a actualizarla"
    } else {
      console.log("PLF: Sede ya asignada")
    }
  }

  // Función para controlar alerta
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

}
