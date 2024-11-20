import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'; //SCANNER plugin
import { AlertController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {

  // Arreglo para guardar datos de asistencia desde API
  asistencias: any [] = [];
  //variables para el qr
  isSupported = false;
  barcodes: Barcode[] = []; //lista para codigos
  //variables para la api
  curso_sigla: string = '';
  curso_nombre: string = '';
  //fechaClase: string = '11/11/2024';
  asistenciaActual: number = 4;
  totalClases: number = 10;
  //para botones de despliegue
  mostrarTodo: boolean = false;
  //para el scanner 1)
  txt: string = "";
  // Variables BD
  correo: string = '';
  porcentajeAsistencia: number = 0;
  texto: string = '';
  codigoClase: string = '';
  nombreClase: string = '';
  fechaClase: string = '';
  contrasena: string = '';
  isAlertOpen = false;
  v_mensaje: string = '';
  alertButtons = ['OK'];
  
  constructor(private alertController: AlertController, private db: DbService, private api: ApisService, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    const data = await this.db.obtenerSesion();
    this.correo = data.correo;
    this.contrasena = data.contrasena;
    this.infoAsistencia();
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.installGoogleBarcodeScannerModule; //instalacion de google barcode
    return;
  }

  // Imágenes para ramos
  asignaturasImagenes: { [key: string]: string } = {
    "PGY4121": "../../../assets/img/PGY4121.jpg",
    "PGY3121": "../../../assets/img/PGY3121.webp",
    "DSY2121": "../../../assets/img/DSY2121.avif",
    "A006121": "../../../assets/img/A006121.png",
  };

  // Función para obtener asistencia desde API
  async infoAsistencia() {
    this.asistencias = [];
    let datos = this.api.obtenerAsistencia(this.correo)
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    // console.log("PLF: Estructura de json[0]:", JSON.stringify(json[0], null, 2));
    for(let x=0; x< json[0].length; x++) {
      let asistencia: any = {}
      asistencia.curso_sigla = json[0][x].curso_sigla;
      asistencia.curso_nombre = json[0][x].curso_nombre;
      asistencia.presente = json[0][x].presente;
      asistencia.ausente = json[0][x].ausente;
      asistencia.porcentajeAsistencia = (asistencia.presente/(asistencia.presente+asistencia.ausente))*100
      const datos = await this.db.obtenerAsistencia(this.correo, asistencia.curso_sigla);
      asistencia.fechas = datos.map((clase: any) => {
        return {
          fecha: clase.fecha,
        };
      });
      asistencia.imagen = this.asignaturasImagenes[asistencia.curso_sigla] || "../../../assets/img/logo"; //imagen por asignatura
      this.asistencias.push(asistencia);
    }
    this.porcentajeAsistencia = this.asistencias[0]?.porcentajeAsistencia || 0;
    this.cdr.detectChanges(); // Forzar renderización
  }

  //barra de progresion, esquema ejemplo
  getColorBarra(porcAsistencia: number): string {
    //const porcentajeAsistencia = presente / (presente + ausente) * 100;
    if (porcAsistencia <= 50) {
      return 'danger';
    } else if (porcAsistencia < 70) {
      return 'warning';
    } else {
      return 'success';
    }
  }

  // Función del SCANNER con permiso en tiempo de ejecucion
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    } else {
      let resultado = await BarcodeScanner.scan();
      if (resultado.barcodes.length > 0) {
        this.texto = resultado.barcodes[0].displayValue;
        console.log("PLF, QR: " + this.texto);
        // Se separa el texto en base al carácter "|"
        const [codigoClase, nombreClase, fechaClase] = this.texto.split("|")
        let datos = this.api.marcarAsistencia(codigoClase, this.correo, fechaClase)
        let respuesta = await lastValueFrom(datos);
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
        console.log("PLF: " + json.message);
        this.v_mensaje = json.message;
        this.isAlertOpen = true;
        this.db.almacenarAsistencia(this.correo, codigoClase, fechaClase);
        setTimeout(() => {
          this.isAlertOpen = false;
          window.location.reload(); // Recarga completa
        }, 3000)
      }
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  //Botones de despliegue para registro de clases
  verMas() {
    this.mostrarTodo = true;
  }
  verMenos() {
    this.mostrarTodo = false;
  }
}
