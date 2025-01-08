import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private db: SQLiteObject | null = null;
  public usuarioActual: any = null; 

  constructor(private sqlite: SQLite) { }

  async abrirDB() {
    this.db = await this.sqlite.create({
      name: "datos.db",
      location: "default"
    });
    console.log("FSR: Base de datos abierta OK");
  }

  async crearTablaUsuario() {
    await this.abrirDB();
    await this.db?.executeSql("CREATE TABLE IF NOT EXISTS USUARIO(MAIL VARCHAR(75), PASS VARCHAR(30), NOMBRE VARCHAR(50), APELLIDO VARCHAR(50), CARRERA VARCHAR(50))", []);
    console.log("FSR: Tabla usuario creada OK");
  }

  async crearTablaSesion() {
    await this.abrirDB();
    await this.db?.executeSql("CREATE TABLE IF NOT EXISTS SESION(MAIL VARCHAR(75))", []);
    console.log("FSR: Tabla sesion creada OK");
  }

  async usuarioAlmacenar(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    try {
      await this.abrirDB();
      await this.db?.executeSql("INSERT INTO USUARIO VALUES(?,?,?,?,?)", [correo, contrasena, nombre, apellido, carrera]);
      console.log("FSR: Usuario almacenado Ok");

      // Actualiza el usuario actual
      this.usuarioActual = { nombre, apellido, carrera, correo };
    } catch (error) {
      console.log("FSR: Se ha producido un error" + JSON.stringify(error));
    }
  }

  async obtenerCantidadUsuarios() {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT COUNT(MAIL) AS CANTIDAD FROM USUARIO", []);
    console.log("FSR: " + JSON.stringify(respuesta.rows.item(0).CANTIDAD));
    return JSON.stringify(respuesta.rows.item(0).CANTIDAD);
  }

  async obtenerCantidadSesion() {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT COUNT(MAIL) AS CANTIDAD FROM SESION", []);
    console.log("FSR: " + JSON.stringify(respuesta.rows.item(0).CANTIDAD));
    return JSON.stringify(respuesta.rows.item(0).CANTIDAD);
  }

  async loginn(correo: string, contrasena: string) {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT * FROM USUARIO WHERE MAIL = ? AND PASS = ?", [correo, contrasena]);
    
    if (respuesta.rows.length > 0) {
        this.usuarioActual = {
            correo: respuesta.rows.item(0).MAIL,
            nombre: respuesta.rows.item(0).NOMBRE,
            apellido: respuesta.rows.item(0).APELLIDO,
            carrera: respuesta.rows.item(0).CARRERA,
            PASS: respuesta.rows.item(0).PASS,
        };
        return "1"; // Usuario encontrado
    } else {
        this.usuarioActual = null; 
        return "0"; // Usuario no encontrado
    }
}


  async sesionAlmacenar(correo: string) {
    try {
      await this.abrirDB();
      await this.db?.executeSql("INSERT INTO SESION VALUES(?)", [correo]);
      console.log("FSR: Usuario almacenado Ok");
    } catch (error) {
      console.log("FSR: Se ha producido un error" + JSON.stringify(error));
    }
  }

  async obtenerCorreoLogueado() {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT MAIL FROM SESION", []);
    return respuesta.rows.item(0).MAIL;
  }

  async obtenerUsuarioLogueado(correo: string) {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT NOMBRE, APELLIDO, CARRERA, PASS FROM USUARIO WHERE MAIL = ?", [correo]);

    this.usuarioActual = {
      nombre: respuesta.rows.item(0).NOMBRE,
      apellido: respuesta.rows.item(0).APELLIDO,
      carrera: respuesta.rows.item(0).CARRERA,
      correo: correo,
    };

    return this.usuarioActual; 
  }

  async eliminarSesion() {
    await this.abrirDB();
    await this.db?.executeSql("DELETE FROM SESION", []);
    console.log("FSR: Sesión eliminada");
  }

  // Para actualizar el usuario actual
  actualizarUsuario(nombre: string, apellido: string, carrera: string) {
    if (this.usuarioActual) {
      this.usuarioActual.nombre = nombre;
      this.usuarioActual.apellido = apellido;
      this.usuarioActual.carrera = carrera;
    }
  }

  async crearTablaEnterQr() {
    await this.abrirDB();
    await this.db?.executeSql("CREATE TABLE IF NOT EXISTS ENTERQR(MAIL VARCHAR(50), SIGLA VARCHAR(50), NOMBRE_CURSO VARCHAR(50), FECHA VARCHAR(10))", []);
    console.log("FSR: Tabla enterqr creada OK");
  }


  async enterQrAlmacenar(correo: string, sigla: string, nombre_curso: string, fecha: string) {
    try {
      await this.abrirDB();
      await this.db?.executeSql("INSERT INTO ENTERQR VALUES(?,?,?,?)", [correo, sigla, nombre_curso, fecha]);
      console.log("FSR: Ingreso QR almacenado Ok");
    } catch (error) {
      console.log("FSR: Se ha producido un error" + JSON.stringify(error));
    }
  }

  async obtenerAsistencia(correo: string) {
    await this.abrirDB();
    let lista_asistencia: any[]=[];
    let respuesta = await this.db?.executeSql("SELECT SIGLA, NOMBRE_CURSO, FECHA FROM ENTERQR WHERE MAIL = ?", [correo]);

    for(let x = 0; x < respuesta.rows.length;x++){
      let nota: any = {};
      nota.sigla = respuesta.rows.item(x).SIGLA;
      nota.nombre_curso = respuesta.rows.item(x).NOMBRE_CURSO;
      nota.fecha = respuesta.rows.item(x).FECHA;

      lista_asistencia.push(nota);
    }

    return lista_asistencia;

  }
}
