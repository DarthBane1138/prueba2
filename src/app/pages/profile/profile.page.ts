import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import JsBarcode from 'jsbarcode';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';
import { PreferenciaService } from 'src/app/services/preferencia.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  paletteToggle = false;
  // Variables desde BD
  correo: string = '';
  nombre: string = '';
  apellido: string = ''
  contrasena: string = '';
  carrera: string = '';
  sede: string = '';
  // Variables para obtención de Sede
  listaSedes: any [] = [];
  sedeNombre: string = '';
  sedeApi: string = 'Sede no encontrada'
  sedeApiNombre: string = 'No encontrada'; 
  sedeApiDireccion: string = ''; 
  sedeApiTelefono: string = ''; 
  sedeApiHorarioAtencion: string = ''; 
  sedeApiImagen: string = ''; 

  constructor(private router: Router, private db: DbService, private api: ApisService, private preferencia: PreferenciaService) { }

  ngOnInit() {
    console.log("Perfil")
    this.db.obtenerSesion().then(data => {
      this.correo = data.correo;
      this.contrasena = data.contrasena;
      console.log("PLF: Perfil Correo: " + this.correo)
      this.infoUsuario()
      // this.infoUsuarioApi()
      this.preferencia.isDarkMode$.subscribe(isDark => {
        this.paletteToggle = isDark;
      });
    })
  }

  toggleChange(ev: any) {
    this.preferencia.toggleDarkMode(); // Llamar al servicio para cambiar el tema
  }

  // Obtención de datos desde BD
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

        this.generarCodigoDeBarras();
      } else {
        console.log('PLF: No se encontraron datos para las credenciales proporcionadas.');
      }
    } catch (error) {
      console.error('PLF: Error al recuperar información del usuario:', error);
    }
  }

  generarCodigoDeBarras() {
    let barcodeData = `${this.correo}`;

    barcodeData = barcodeData.replace(/[\r\n]+/g, ' ');
    barcodeData = barcodeData.replace(/\s+/g, ' ').trim();
   
    if (barcodeData.trim() !== '') {
       
      JsBarcode('#barcode', barcodeData, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 18,
        height: 100,
        width: 3,
        margin: 10,
      });
    }}

    // Selección de Sede
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
      // Bloque if para seleccionar sede de acuerdo a lo guardado en la BD
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
}
