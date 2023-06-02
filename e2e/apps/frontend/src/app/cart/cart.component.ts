import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart } from '../cart';
import { CartItem } from '../cartitem';
import { CartService } from '../cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    CartItemComponent,
    MatTableModule
  ],
  template: `
    <section class="cart">
      <h1>Shopping Cart ID: {{cart?.id}}</h1>
    </section>
    <section class="items">
      <table mat-table [dataSource]="items">
        <ng-container matColumnDef="sku">
          <th mat-header-cell *matHeaderCellDef>SKU</th>
          <td mat-cell *matCellDef="let item">{{item.sku}}</td>
          <td mat-footer-cell *matFooterCellDef>Total</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let item">{{item.name}}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>
        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Quantity</th>
          <td mat-cell *matCellDef="let item">{{item.quantity | number}}</td>
          <td mat-footer-cell *matFooterCellDef>{{getTotalQuantity() | number}}</td>
        </ng-container>
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let item">{{item.price | currency}}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>
        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let item">{{(item.quantity * item.price) | currency}}</td>
          <td mat-footer-cell *matFooterCellDef> {{getTotalCost() | currency}} </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        <tr mat-footer-row *matFooterRowDef="displayedColumns"></tr>
      </table>
    </section>
  `,
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService: CartService = inject(CartService);
  cart: Cart | undefined;
  items: CartItem[];
  displayedColumns: string[] = ['sku', 'name', 'quantity', 'price', 'total'];

  constructor() {
    console.log("[CartComponent] constructor");
    this.cart = this.cartService.getCart();
    this.items = this.cart?.items;
    this.cartService.change.subscribe(cart => {
      console.log("[CartComponent] ID " + cart.id);
      this.cart = cart;
      this.items = this.cart?.items;
    });
  }

  getTotalQuantity() {
    if (this.items)
      return this.items.map(i => i.quantity).reduce((acc, value) => acc + value, 0);
    return 0;
  }

  getTotalCost() {
    if (this.items)
      return this.items.map(i => i.quantity * i.price).reduce((acc, value) => acc + value, 0);
    return 0;
  }
}
