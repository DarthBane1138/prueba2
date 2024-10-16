import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  dbInstance: SQLiteObject | null = null;
  users: any[] = []; // Lista para los usuarios
  sedes: any [] = []; // Lista para sedes
  carreras: any [] = []; // Lista para carreras

  constructor(private sqlite: SQLite) {
    this.crearTablas();
   }

  crearTablas() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('create table if not exists usuario (correo varchar(70), contrasena varchar(30), nombre varchar(30), apellido varchar(30), carrera varchar(30), sede varchar(30))',
      [])
        .then(() => console.log('PLF: TABLA USUARIO OK'))
        .catch(e => console.log('PLF: ERROR AL CREAR TABLA USUARIO: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  almacenarUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string, sede: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('insert into usuario values(?, ?, ?, ?, ?, ?)', [correo, contrasena, nombre, apellido, carrera, sede])
        .then(() => console.log('PLF: USUARIO ALMACENADO OK'))
        .catch(e => console.log('PLF: ERROR AL ALMACENAR USUARIO: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  loginUsuario(correo: string, contrasena: string) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select count(correo) as cantidad from usuario where correo = ? and contrasena = ?', [correo, contrasena])
        .then((data) => {
          return data.rows.item(0).cantidad;
        })
        .catch(e => console.log('PLF: ERROR AL REALIZAR LOGIN: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  infoUsuario(correo: string, contrasena: string) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select correo, nombre, apellido from usuario where correo = ? and contrasena = ?', [correo, contrasena])
        .then((data) => {
          let objeto: any = {};
          objeto.correo = data.rows.item(0).correo;
          objeto.nombre = data.rows.item(0).nombre;
          objeto.apellido = data.rows.item(0).apellido;

          console.log("PLF: DATOS RESCATADOS EXITOSAMENTE")
          console.log(objeto.correo)
          console.log(objeto.nombre)
          console.log(objeto.apellido)
          

          return objeto
        })
        .catch(e => console.log('PLF: ERROR AL OBTENER INFO DE PERSONA: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }
}
