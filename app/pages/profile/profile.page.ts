import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  mdl_email: string = '';
  mdl_password: string = '';
  mdl_newPassword: string = '';
  mdl_career: string = '';
  nombre: string = '';
  apellido: string = '';
  objeto: any;

  constructor(private router: Router, private api: ApiService, private db: DbService, private toastController: ToastController) { }

  async ngOnInit() {
    let extras = this.router.getCurrentNavigation();
    if (extras?.extras.state) {
      this.mdl_email = extras?.extras.state["correo"];
      this.objeto = await this.db.obtenerUsuarioLogueado(this.mdl_email);
      this.mdl_password = this.objeto.contrasena; 
      this.mdl_career = this.objeto.carrera; 
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'success',
      position: 'top',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  navigateHome() {
    
    this.mdl_password = '';
    this.mdl_newPassword = '';
    this.mdl_career = '';

    let extras: NavigationExtras = {
      state: {
        correo: this.mdl_email
      }
    }
    this.router.navigate(['home'], { state: { correo: this.mdl_email }, replaceUrl: true });
  }

  async updateUser() {
    try {
      
      if (!this.mdl_newPassword) {
        console.log('Por favor, ingrese una nueva contraseña');
        await this.presentToast('Por favor, ingrese una nueva contraseña');
        return; 
      }
  
      const cantidad = await this.db.loginn(this.mdl_email, this.mdl_password);
      
      if (cantidad === '0') {
        console.log('Contraseña actual incorrecta');
        await this.presentToast('Contraseña actual incorrecta');
        return;
      }
      
      await this.api.update(this.mdl_email, this.mdl_newPassword, this.mdl_career).toPromise();
      console.log('Usuario modificado correctamente');
      await this.presentToast('Usuario modificado correctamente');
  
      this.db.usuarioActual = {
        nombre: this.objeto.nombre,
        apellido: this.objeto.apellido,
        carrera: this.mdl_career,
        correo: this.mdl_email,
      };
  
      // Limpiar los campos
      this.mdl_password = '';
      this.mdl_newPassword = '';
      this.mdl_career = '';
  
      this.router.navigate(['home']);
      
    } catch (error) {
      console.error('Error en updateUser:', error);
      await this.presentToast('Error al actualizar el usuario');
    }
  }
  
}
