import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  rute: string = 'https://www.s2-studio.cl/api_duoc';

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string, name: string, lastName: string, career: string){
    
    let object: any = {};

    object.correo = email;
    object.contrasena = password;
    object.nombre = name;
    object.apellido = lastName;
    object.carrera = career;

    return this.http.post(this.rute +
      '/usuario/usuario_almacenar', object).pipe();
  }

  login(email: string, password: string){

    let object: any = {};

    object.correo = email;
    object.contrasena = password;

    return this.http.post(this.rute +
      '/usuario/usuario_login', object).pipe();
  }

  update(email: string, password: string, career: string){
    let object: any = {};

    object.correo = email;
    object.contrasena = password;
    object.carrera = career;

    return this.http.patch(this.rute +
      '/usuario/usuario_modificar', object).pipe();

  }
  
}
