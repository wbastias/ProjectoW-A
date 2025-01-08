import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {

  mdl_email: string = '';
  mdl_password: string = '';
  mdl_v_password: string = '';
  mdl_name: string = '';
  mdl_lastName: string = '';
  mdl_career: string = '';

  constructor(private api: ApiService, private router: Router, private db: DbService, private toastController: ToastController) { }

  ngOnInit() {
    console.log('.');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: 'danger', 
      cssClass: 'custom-toast' 
    });
    await toast.present();
  }

  validateForm(): boolean {

    if (this.mdl_password !== this.mdl_v_password) {
      this.presentToast('Las contraseñas no coinciden');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|cl|es)$/;
    if (!emailRegex.test(this.mdl_email)) {
      this.presentToast('Por favor ingresa un correo válido (ejemplo@eco-wall.com, eco-wall@ejemplo.cl, ejemplo@ejemplo.es)');
      return false;
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(this.mdl_career)) {
      this.presentToast('El teléfono ingresado no es válido. Ingresa uno de 9 números (Ej: 976583421)');
      return false;
    }

    return true;
  }

  async almacenarUsuaio() {
    await this.db.usuarioAlmacenar(this.mdl_email, this.mdl_password, this.mdl_name, this.mdl_lastName, this.mdl_career);
    this.router.navigate(['login']);
  }

  async createUser() {

    if (!this.validateForm()) {
      return; 
    }

    let datos = this.api.createUser(
      this.mdl_email, this.mdl_password, 
      this.mdl_name, this.mdl_lastName,
      this.mdl_career
    );

    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    
    console.log(json_texto);
    
    if (json.status === 'success') {
      console.log('Usuario creado correctamente');
      await this.db.usuarioAlmacenar(this.mdl_email, this.mdl_password, this.mdl_name, this.mdl_lastName, this.mdl_career);
      this.mdl_email = '';
      this.mdl_password = '';
      this.mdl_name = '';
      this.mdl_lastName = '';
      this.mdl_career = ''; 
      this.router.navigate(['login']);
    } else if (json.message === 'El correo ingresado ya existe') {
      await this.presentToast('El correo ya existe'); 
    } else if (json.message === 'Todos los campos son obligatorios') {
      await this.presentToast('Faltan datos. Todos los campos son obligatorios'); 
    } else {
      await this.presentToast('Ha ocurrido un error'); 
    }
  }
}
