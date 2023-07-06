import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cart } from '../cart';
import { CartItem } from '../cart-item';
import { CartService } from '../cart.service';
import { MatTableModule } from '@angular/material/table';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CheckoutService } from '../checkout.service';
import { MatButtonModule } from '@angular/material/button';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule
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
    <section class="checkoutForm">
      <h2>Checkout: </h2>
      <form (submit)="checkout()">
        <mat-form-field class="example-full-width">
          <mat-label>First Name</mat-label>
          <input type="firstName" matInput [formControl]="firstName" [errorStateMatcher]="matcher"
                placeholder="Ex. John" id="first-name">
          <mat-error *ngIf="firstName.hasError('required')">
            <strong>Required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field class="example-full-width">
          <mat-label>Last Name</mat-label>
          <input type="lastName" matInput [formControl]="lastName" [errorStateMatcher]="matcher"
                placeholder="Ex. Doe" id="last-name">
          <mat-error *ngIf="lastName.hasError('required')">
            <strong>Required</strong>
          </mat-error>
        </mat-form-field>
        <mat-form-field class="example-full-width">
          <mat-label>Email</mat-label>
          <input type="email" matInput [formControl]="email" [errorStateMatcher]="matcher"
                placeholder="Ex. pat@example.com" id="email">
          <mat-error *ngIf="email.hasError('email') && !email.hasError('required')">
            Please enter a valid email address
          </mat-error>
          <mat-error *ngIf="email.hasError('required')">
            <strong>Required</strong>
          </mat-error>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" id="submit-order">Submit</button>
      </form>
    </section>
  `,
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService: CartService = inject(CartService);
  checkoutService: CheckoutService = inject(CheckoutService);
  cart: Cart | undefined;
  items: CartItem[];
  displayedColumns: string[] = ['sku', 'name', 'quantity', 'price', 'total'];

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private router: Router) {
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

  matcher = new MyErrorStateMatcher();

  checkout() {
    console.log("[CartComponent]checkout");
    this.checkoutService.checkout(
      this.firstName.value ?? '',
      this.lastName.value ?? '',
      this.email.value ?? '',
      this.cart ?? {} as Cart
    ).subscribe(orderResponse => {
      console.log("[CartComponent]Order placed: " + orderResponse.orderId);
      this.cartService.clearCart();
      this.router.navigate(['/checkout']);
    });
  }
}
