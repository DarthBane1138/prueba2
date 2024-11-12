import { Component, OnInit } from '@angular/core';

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
  }

  escanearQR() {
    console.log("funcionando");
  }

  verMas() {
    this.mostrarTodo = true;
  }

  verMenos() {
    this.mostrarTodo = false;
  }

}
