import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductComponent,
    MatButtonModule
  ],
  template: `
    <section>
      <input type="text" placeholder="Filter by product" #filter>
      <button class="search" mat-raised-button color="primary" (click)="filterResults(filter.value)">Search</button>
      <button class="reset" mat-raised-button color="warn" (click)="reset(); filter.value='';">Reset</button>
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