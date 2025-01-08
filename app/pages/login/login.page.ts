import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router'; 
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { ToastController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mdl_email: string = '';
  mdl_password: string = '';
  cantidad: string = '';

  constructor(private router: Router, private api: ApiService, private db: DbService, private toastController: ToastController) { } // Inyecta el ToastController

  ngOnInit() {
    let extras = this.router.getCurrentNavigation();
    if (extras?.extras.state) {
      this.mdl_email = extras?.extras.state["correo"];
    }
    console.log(this.mdl_email);
  }

  navigateCreateUser() {
    this.router.navigate(['create-user']);
  }

  async ionViewWillEnter() {
    this.cantidad = await this.db.obtenerCantidadUsuarios();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      color: 'danger', 
      cssClass: 'custom-toast' 
    });
    await toast.present();
  }

  async login() {
    let datos = this.api.login(this.mdl_email, this.mdl_password);
    let respuesta = await lastValueFrom(datos);

    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    console.log(json_texto);

    if (json.status === 'success') {
      const usuario = json.usuario;
      
      let cantidad = await this.db.loginn(usuario.correo, this.mdl_password);

      if (cantidad === "0") {
        await this.db.usuarioAlmacenar(usuario.correo, this.mdl_password, usuario.nombre, usuario.apellido, usuario.carrera);
      }
      
      await this.db.sesionAlmacenar(this.mdl_email);
      let extras: NavigationExtras = {
        replaceUrl: true,
        state: {
          correo: usuario.correo
        }
      };
      
      
      this.mdl_email = '';
      this.mdl_password = '';
      
      this.router.navigate(['home'], extras);
    } else if (json.status === 'error') {
      await this.presentToast('CREDENCIALES INVALIDAS'); 
    } else {
      await this.presentToast('Ha ocurrido un error'); 
    }
  }
}
