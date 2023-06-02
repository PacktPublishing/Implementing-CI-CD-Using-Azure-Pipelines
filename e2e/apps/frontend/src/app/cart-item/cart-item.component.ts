import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../cartitem';

@Component({
  selector: 'cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      cart-item works!
    </p>
  `,
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() cartItem!: CartItem;

}
