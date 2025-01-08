import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ProductModalComponent } from '../../product-modal/product-modal.component'; // Asegúrate de importar el componente modal
import { DbService } from 'src/app/services/db.service';

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: string;
}

@Component({
  selector: 'app-sell',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
})
export class SellPage {

  mdl_email: string = '';
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';

  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public groupedProducts: Product[][] = [];  
  public searchText: string = '';

  public selectedProduct: Product | null = null; 

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController, private db: DbService 
  ) {}

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
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>('assets/json/productos.json').subscribe(data => {
      this.products = data;
      this.filteredProducts = [...this.products]; 
      this.groupProductsInPairs(); 
    });
  }

  groupProductsInPairs() {
    const grouped = [];
    for (let i = 0; i < this.filteredProducts.length; i += 2) {
      grouped.push(this.filteredProducts.slice(i, i + 2));
    }
    this.groupedProducts = grouped;
  }

  filterProducts() {
    if (this.searchText.trim() === '') {
      this.filteredProducts = [...this.products]; 
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.nombre.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    this.groupProductsInPairs(); 
  }

  goHome() {
    let extras: NavigationExtras = {
      state: {
        correo: this.mdl_email
      }
    }
    this.router.navigate(['home'], { state: { correo: this.mdl_email }, replaceUrl: true });
  
  }

  async openProductDetails(product: Product) {
    this.selectedProduct = product;
    const modal = await this.modalController.create({
      component: ProductModalComponent, 
      componentProps: {
        product: this.selectedProduct 
      }
    });
    return await modal.present(); 
  }
}
