import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <section class="product">
      <h2 class="product-name">{{ product.name }}</h2>
      <p class="product-price">{{ product.price | currency }}</p>
      <button mat-fab extended color="primary" aria-label="Add to cart" class="add-to-cart" id="add-to-cart-{{product.sku}}" (click)="addToCart(product.sku)">
        <mat-icon>add</mat-icon>
        Add to Cart
      </button>
    </section>
  `,
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() product!: Product;
  cartService: CartService = inject(CartService);

  addToCart(sku: string) {
    console.log("[Product] Add to cart: " + sku)
    this.cartService.addToCart(this.product);
  }
}
