import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <section class="product">
      <h2 class="product-name">{{ product.name }}</h2>
      <p class="product-price">{{ product.price | currency }}</p>
      <a [routerLink]="['/details', product.sku]">Learn More</a>
      <button class="primary" type="button" (click)="addToCart(product.sku)">Add to Cart</button>
    </section>
  `,
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() product!: Product;

  addToCart(sku: string) {
    console.log(`Add product ${sku} to cart`);
  }
}
