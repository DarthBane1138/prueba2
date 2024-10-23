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
  sede: string = '';

  constructor(private sqlite: SQLite) {
    this.crearTablas();
  }

   // Servicio Crear Tablas
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

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('create table if not exists sesion (correo varchar(30), contrasena varchar(30))', [])
        .then(() => console.log('PLF: TABLA SESION CREADA CORRECTAMENTE'))
        .catch(e => console.log('PLF: ERROR AL CREAR TABLA SESION: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  // Almacenar Usuario
  almacenarUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string, sede: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      console.log("Valores almacenados: ")
      db.executeSql('insert into usuario values(?, ?, ?, ?, ?, ?)', [correo, contrasena, nombre, apellido, carrera, sede])
        .then(() => console.log('PLF: USUARIO ALMACENADO OK'))
        .catch(e => console.log('PLF: ERROR AL ALMACENAR USUARIO: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  // Almacenar Sesión
  /*async almacenarSesion(correo: string, contrasena: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('delete from sesion', [])
      
        .then(() => {
          console.log("PLF: Sesión anterior Sobreescrita")
          return db.executeSql('insert into sesion values (?, ?)', [correo, contrasena])
        })
        .then(() => console.log('PLF: SESION ALMACENADO OK'))
        .catch(e => console.log('PLF: ERROR AL ALMACENAR SESION: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }*/

  async almacenarSesion(correo: string, contrasena: string) {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
  
      await db.executeSql('delete from sesion', []);
      console.log("PLF: Sesión anterior Sobreescrita");
  
      await db.executeSql('insert into sesion values (?, ?)', [correo, contrasena]);
      console.log('PLF: SESION ALMACENADA OK');
    } catch (e) {
      console.log('PLF: ERROR AL ALMACENAR SESION: ' + JSON.stringify(e));
    }
  }

  // Servicio Login
  loginUsuario(correo: string, contrasena: string) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select count(correo) as cantidad from usuario where correo = ? and contrasena = ?',
        [correo, contrasena])
        .then((data) => {
          return data.rows.item(0).cantidad;
        })
        .catch(e => console.log('PLF: ERROR AL REALIZAR LOGIN: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS' + JSON.stringify(e)));
  }

  // Validar Sesión
  validarSesion() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select count(correo) as cantidad from sesion', [])
        .then((data) => {
          return data.rows.item(0).cantidad;
        })
        .catch(e => console.log('PLF: ERROR AL VALIDAR SESIÓN: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS' + JSON.stringify(e)));
  }

  obtenerSesion() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select correo, contrasena from sesion', [])
        .then((data) => {
          let objeto: any = {};
          objeto.correo = data.rows.item(0).correo;
          objeto.contrasena = data.rows.item(0).contrasena;
          return objeto;
        })
        .catch(e => console.log('PLF: ERROR AL OBTENER SESIÓN: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS' + JSON.stringify(e)));
  }

  infoUsuario(correo: string, contrasena: string) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      return db.executeSql('select correo, contrasena, nombre, apellido, carrera, sede from usuario where correo = ? and contrasena = ?', [correo, contrasena])
        .then((data) => {
          let objeto: any = {};
          objeto.correo = data.rows.item(0).correo;
          objeto.contrasena = data.rows.item(0).contrasena;
          objeto.nombre = data.rows.item(0).nombre;
          objeto.apellido = data.rows.item(0).apellido;
          objeto.carrera = data.rows.item(0).carrera;
          objeto.sede = data.rows.item(0).sede;

          return objeto
        })
        .catch(e => console.log('PLF: ERROR AL OBTENER INFO DE PERSONA: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  cambiarContrasena(correo: string, contrasenaActual: string, nuevaContrasena: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('update usuario set contrasena = ? where correo = ? and contrasena = ?', [nuevaContrasena, correo, contrasenaActual])
        .then(() => console.log('PLF: USUARIO MODIFICADO OK'))
        .catch(e => console.log('PLF: ERROR AL MODIFICAR CONTRASENA: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL INGRESAR A BASE DE DATOS'));
  }

  eliminarSesion() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('delete from sesion', [])
        .then(() => console.log('PLF: SESION ALMACENADO OK'))
        .catch(e => console.log('PLF: ERROR AL ALMACENAR SESION: ' + JSON.stringify(e)));
    })
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS'));
  }

  actualizarUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string, sede: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      console.log("PLF: Actualizando datos en la base de datos local...");
      return db.executeSql(
        'UPDATE usuario SET correo = ?, contrasena = ?, nombre = ?, apellido = ?, carrera = ?, sede = ? where correo = ? and contrasena = ?',
        [correo, contrasena, nombre, apellido, carrera, sede, correo, contrasena]
      );
    })
    .then(() => console.log("PLF Usuario Actualizado OK"))
    .catch(e => console.log('PLF: ERROR AL ACTUALIZAR USUARIO: ' + JSON.stringify(e)))
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS: ' + JSON.stringify(e)));
  }

  actualizarDatos(correo: string, contrasena: string, carrera: string) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      console.log("PLF: Actualizando datos en la base de datos local...");
      return db.executeSql(
        'UPDATE usuario SET contrasena = ?, carrera = ? where correo = ? and contrasena = ?',
        [contrasena, carrera, correo, contrasena]
      );
    })
    .then(() => console.log("PLF Datos de Usuario Actualizado OK"))
    .catch(e => console.log('PLF: ERROR AL ACTUALIZAR USUARIO: ' + JSON.stringify(e)))
    .catch(e => console.log('PLF: ERROR AL CREAR O ABRIR BASE DE DATOS: ' + JSON.stringify(e)));
  }

  async verificarUsuario(correo: string) {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      const resultado = await db.executeSql('select count(*) as cantidad from usuario where correo= ? ',
        [correo]
      );
      // Verificamos si la cantidad es mayor que 0
      const cantidad = resultado.rows.item(0).cantidad;
      return cantidad > 0;
    } catch (e) {
      console.log('PLF: Error al verificar Usuario ' + JSON.stringify(e));
      return false;
    }
  }

  actualizarSesion() {
    
  }

}

