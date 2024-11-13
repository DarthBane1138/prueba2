import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'; //SCANNER plugin

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {
  //variables para el qr
  curso_sigla: string = 'PGY4121';
  curso_nombre: string = 'Programacion Movil';
  fechaClase: string = '11/11/2024';
  asistenciaActual: number = 4;
  totalClases: number = 10;

  mostrarTodo: boolean = false;
  txt: string = ""; //para el scanner

  //estado de asistencia, ausente o presente
  asistencias = [
    { fecha: '11/11/2024', estado: true },
    { fecha: '23/11/2024', estado: false },
    { fecha: '28/11/2024', estado: true },
  ];

  //calculo delporcentaje de asistencia
  get porcentajeAsistencia() {
    return this.asistenciaActual / this.totalClases;
  }

  //barra de progresion
  get colorBarra() {
    return this.porcentajeAsistencia <= 0.5
      ? 'danger'
      : this.porcentajeAsistencia < 0.7
      ? 'warning'
      : 'success'; //> 0.7 then
  }
  constructor() { }

  ngOnInit() {
    BarcodeScanner.installGoogleBarcodeScannerModule; //instalacion de google barcode
    return;
  }
  //Funcion del SCANNER
  async escanearQR(){
    let resultado = await BarcodeScanner.scan(); //a este resultado se le saca el texto para pasarlo al txt
    if(resultado.barcodes.length>0){ //si se captura al menos 1 codigo
      this.txt = resultado.barcodes[0].displayValue;
      console.log(this.txt)
    }
  }//añadidos los permisos en android>app>src>main>AndroidManifest.xml

  //Botones de despliegue en registro de clases
  verMas() {
    this.mostrarTodo = true;
  }
  verMenos() {
    this.mostrarTodo = false;
  }

}
