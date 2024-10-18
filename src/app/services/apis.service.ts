import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  ruta: string = 'https://www.s2-studio.cl';

  constructor(private http: HttpClient) { }

  creacionUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    let objeto: any = {};
    objeto.correo = correo;
    objeto.contrasena = contrasena;
    objeto.nombre = nombre;
    objeto.apellido = apellido;
    objeto.carrera = carrera;

    return this.http.post(this.ruta + "/api_duoc/usuario/usuario_almacenar", objeto).pipe()
  }

  loginUsuario(correo: string, contrasena: string) {
    let objeto: any = {};
    objeto.correo = correo;
    objeto.contrasena = contrasena;

    return this.http.post(this.ruta + "/api_duoc/usuario/usuario_login", objeto).pipe()
  }

  obtencionSedes() {
    return this.http.get(this.ruta + "/api_duoc/usuario/sedes_obtener").pipe()
  }

}
