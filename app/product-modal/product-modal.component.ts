import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent {
  @Input() product: any;
  orderGenerated: boolean = false; 

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  close() {
    this.modalController.dismiss(); 
  }

  generateOrder() {
    this.orderGenerated = true;
    setTimeout(() => {
      alert("Orden de compra generada");
    }, 500);
  }
}
