import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { Cart } from '../cart';

@Component({
  selector: 'app-cart-indicator',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <a [routerLink]="['/cart']" id="cart-indicator">
      <label class="cart-indicator">
        Items in Cart <span class="value">({{ getTotalItems() | number}})</span>
      </label>
    </a>
  `,
  styleUrls: ['./cart-indicator.component.css']
})
export class CartIndicatorComponent {
  cartService: CartService = inject(CartService);
  cart: Cart | undefined;
  constructor() {
    console.log("[CartIndicatorComponent] constructor");
    this.cart = this.cartService.getCart();
    this.cartService.change.subscribe(cart => {
      console.log("[CartIndicatorComponent] ID " + cart.id);
      this.cart = cart;
    });
  }

  getTotalItems() {
    if (this.cart?.items)
      return this.cart?.items.map(i => i.quantity).reduce((acc, value) => acc + value, 0);
    return 0;
  }
}
