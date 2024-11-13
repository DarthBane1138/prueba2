import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'; //SCANNER plugin
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {
  //variables para el qr opcion 2
  isSupported = false;
  barcodes: Barcode[] = []; //lista para codigos
  //variables para la api
  curso_sigla: string = 'PGY4121';
  curso_nombre: string = 'Programacion Movil';
  fechaClase: string = '11/11/2024';
  asistenciaActual: number = 4;
  totalClases: number = 10;
   //para botones de despliegue
  mostrarTodo: boolean = false;
  //para el scanner 1)
  txt: string = "";

  //estado de asistencia ausente o presente, esquema ejemplo
  asistencias = [
    { fecha: '11/11/2024', estado: true },
    { fecha: '23/11/2024', estado: false },
    { fecha: '28/11/2024', estado: true },
  ];

  //calculo delporcentaje de asistencia, ejemplo
  get porcentajeAsistencia() {
    return this.asistenciaActual / this.totalClases;
  }

  //barra de progresion, esquema ejemplo
  get colorBarra() {
    return this.porcentajeAsistencia <= 0.5
      ? 'danger'
      : this.porcentajeAsistencia < 0.7
      ? 'warning'
      : 'success'; //> 0.7 then
  }
  constructor(private alertController: AlertController) { }

  ngOnInit() {
    //2)
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    //1)
    BarcodeScanner.installGoogleBarcodeScannerModule; //instalacion de google barcode
    return;
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
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
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
