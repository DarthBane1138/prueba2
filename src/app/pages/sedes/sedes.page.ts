import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.page.html',
  styleUrls: ['./sedes.page.scss'],
})
export class SedesPage implements OnInit {

  listaSedes: any [] = []

  constructor(private api: ApisService, private router: Router) { }

  ngOnInit() {
    this.verSedes();
  }

  async verSedes() {
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

      this.listaSedes.push(sede);
      console.log("PLF: Datos obtenidos")
      console.log("PLF: Nombre Sede: " + sede.nombre)
    }
  }

  irPrincipal() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    this.router.navigate(['principal'], extras)
  }

  irPerfil() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    this.router.navigate(['profile'], extras)
  }

}
