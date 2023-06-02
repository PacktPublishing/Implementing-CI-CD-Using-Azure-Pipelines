import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';
import { Cart } from '../cart';

@Component({
  selector: 'app-cart-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="cart-indicator">
      Items in Cart <span class="value">({{ cart?.items?.length ?? 0 }})</span>
    </label>
  `,
  styleUrls: ['./cart-indicator.component.css']
})
export class CartIndicatorComponent {
  cartService: CartService = inject(CartService);
  cart: Cart | undefined;
  constructor() {
    this.cartService.change.subscribe(cart => {
      this.cart = cart;
    });
  }
}
