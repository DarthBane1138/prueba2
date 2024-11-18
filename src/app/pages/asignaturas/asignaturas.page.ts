import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'; //SCANNER plugin
import { AlertController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {

  asistencias: any [] = [];
  //variables para el qr opcion 2
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
  
  constructor(private alertController: AlertController, private db: DbService, private api: ApisService) { }

  async ngOnInit() {

    const data = await this.db.obtenerSesion();
    this.correo = data.correo;
    this.contrasena = data.contrasena;

    console.log("PLF: Asistencia")
    console.log("PLF: Perfil Correo: " + this.correo)
    this.infoAsistencia();
    //})

    //2)
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    //1)
    BarcodeScanner.installGoogleBarcodeScannerModule; //instalacion de google barcode
    return;

  }

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
      this.porcentajeAsistencia = (asistencia.presente/(asistencia.presente+asistencia.ausente))*100
      console.log("PLF: Curso Sigla: " + asistencia.curso_sigla)
      console.log("PLF: Curso Nombre: " + asistencia.curso_nombre)
      this.asistencias.push(asistencia);
    }
  }

  //barra de progresion, esquema ejemplo
  get colorBarra() {
    return this.porcentajeAsistencia <= 0.5
      ? 'danger'
      : this.porcentajeAsistencia < 0.7
      ? 'warning'
     : 'success'; //> 0.7 then
  }

  //Añadidos los permisos en android>app>src>main>AndroidManifest.xml(<uses-permission android:name="android.permission.CAMERA" />)
  //1) Funcion del SCANNER basico enseñado por el profe
  async escanearQR(){
    let resultado = await BarcodeScanner.scan(); //a este resultado se le saca el texto para pasarlo al txt
    if(resultado.barcodes.length>0){ //si se captura al menos 1 codigo
      this.txt = resultado.barcodes[0].displayValue;
      console.log(this.txt)
    }
  }

  //2) Funcion del SCANNER con permiso en tiempo de ejecucion
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    } else {
      console.log("PLF: abriendo camara...")
      let resultado = await BarcodeScanner.scan();
      if (resultado.barcodes.length > 0) {
        this.texto = resultado.barcodes[0].displayValue;
        console.log("PLF, QR: " + this.texto);

        // Se separa el texto en base al carácter "|"
        const [codigoClase, nombreClase, fechaClase] = this.texto.split("|")

        // Variables a consola
        // console.log("PLF, QR: Código clase: " + codigoClase);
        // console.log("PLF, QR: Nombre clase: " + nombreClase);
        // console.log("PLF, QR: Correo clase: " + this.correo);
        // console.log("PLF, QR: FechaClase: " + fechaClase);
        
        let datos = this.api.marcarAsistencia(codigoClase, this.correo, fechaClase)
        let respuesta = await lastValueFrom(datos);
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
        if (json.status == "success") {
          console.log("PLF: " + json.message);
          window.location.reload(); // Recarga completa
        } else {
          console.log("PLF: Error al registrar asistencia");
          console.log("PLF mensaje: " + json.message);
        }
      }
      // Esto se podría usar para registrar la asistencia en la base de datos local
      // const { barcodes } = await BarcodeScanner.scan();
      //this.barcodes.push(...barcodes);
    }
  }

  // async leerQR(){
  //   let resultado = await BarcodeScanner.scan();
  //   if (resultado.barcodes.length > 0) {
  //     this.texto = resultado.barcodes[0].displayValue;
  //     console.log(this.texto);
  //   }
  // }

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
