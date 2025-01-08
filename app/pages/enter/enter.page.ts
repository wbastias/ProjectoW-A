import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-enter',
  templateUrl: './enter.page.html',
  styleUrls: ['./enter.page.scss'],
})
export class EnterPage implements OnInit {

  images = [
    'assets/images/1.jpg',  
    'assets/images/2.jpg',
    'assets/images/3.jpg'
  ];
  currentImage: string = 'assets/images/4.jpg';  
  displayedImages: string[] = [];

  constructor(private navController: NavController, private router: Router, private db : DbService) { }

  ngOnInit() {
    this.crearTablas();
    this.showRandomImages();
  }

  async crearTablas() {
    await this.db.crearTablaUsuario();
    await this.db.crearTablaSesion();
  }

  showRandomImages() {
    let count = 0;
    let interval = setInterval(() => {
      if (count < 3) {
        this.setRandomImage();
        count++;
      } else {
        clearInterval(interval);
        this.navController.navigateRoot('/login'); 
      }
    }, 2500); 

    setTimeout(() => {
      this.navController.navigateRoot('/login'); 
    }, 7500); 
  }

  setRandomImage() {
    const availableImages = this.images.filter(image => !this.displayedImages.includes(image));
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    this.currentImage = randomImage;
    this.displayedImages.push(randomImage);
  }
}
