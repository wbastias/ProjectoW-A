import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  mdl_email: string = '';
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';
  montoGanado: number = 35680;

  constructor(private router: Router, private db: DbService) { }

  async ngOnInit() {
    this.mdl_email = await this.db.obtenerCorreoLogueado();
    if (this.db.usuarioActual) {
        this.nombre = this.db.usuarioActual.nombre;
        this.apellido = this.db.usuarioActual.apellido;
        this.carrera = this.db.usuarioActual.carrera;
    } else {
        let objeto = await this.db.obtenerUsuarioLogueado(this.mdl_email);
        this.nombre = objeto.nombre;
        this.apellido = objeto.apellido;
        this.carrera = objeto.carrera;

        this.db.usuarioActual = objeto; 
    }

    console.log('Usuario logueado:', this.db.usuarioActual || 'No disponible');

    let extras = this.router.getCurrentNavigation();
    if (extras?.extras.state) {
        this.mdl_email = extras?.extras.state['correo'];
    }
}


  getInstitutions() {
    let extras: NavigationExtras = {
      state: {
        correo: this.mdl_email
      }
    }
    this.router.navigate(['sell'], { state: { correo: this.mdl_email }, replaceUrl: true });
  }

  update() {
    let extras: NavigationExtras = {
      state: {
        correo: this.mdl_email
      }
    }
    this.router.navigate(['profile'], { state: { correo: this.mdl_email }, replaceUrl: true });
  }

  assistance() {
    let extras: NavigationExtras = {
      state: {
        correo: this.mdl_email
      }
    }
    this.router.navigate(['assistance'], { state: { correo: this.mdl_email }, replaceUrl: true });
  }
  
  cerrarSesion() {
    this.db.eliminarSesion();
    this.db.usuarioActual = null; 
    this.router.navigate(['login'], { replaceUrl: true });
}
}
