import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductComponent
  ],
  template: `
    <section>
      <form #form>
        <input type="text" placeholder="Filter by product" #filter>
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
        <button class="secondary" type="button" (click)="form.reset();reset()">Reset</button>
      </form>
    </section>
    <section class="results">
      <app-product
         *ngFor="let product of filteredLocationList" [product]="product">
      </app-product>
    </section>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  productList: Product[] = [];
  productService: ProductService = inject(ProductService);

  filteredLocationList: Product[] = [];

  constructor() {
    this.productService.getAllProducts().then((products) => {
      this.productList = products;
      this.filteredLocationList = this.productList;
    });
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.productList;
    }

    this.filteredLocationList = this.productList.filter(
      product => product?.name.toLowerCase().includes(text.toLowerCase())
    );
  }

  reset() {
    this.filteredLocationList = this.productList;
  }
}