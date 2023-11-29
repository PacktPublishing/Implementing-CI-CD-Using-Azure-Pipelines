import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../checkout.service';
import { OrderResponse } from '../order-response';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <section class="checkout">
      <h1>Congratulations!!!</h1>
      <h2>Your order {{orderResponse?.orderId}} has been placed.</h2>
      <h3>{{orderResponse?.message}}</h3>
      <a [routerLink]="['/']">
          <button mat-raised-button id="continue-shopping" color="primary" aria-label="Packt Store">
            Continue Shopping
          </button>
      </a>
    </section>
  `,
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  checkoutService: CheckoutService = inject(CheckoutService);
  orderResponse: OrderResponse | undefined;

  constructor(private router: Router) {
    this.orderResponse = this.checkoutService.getOrderResponse();
    if (this.orderResponse === undefined) {
      this.router.navigate(['/']);
    }
  }
}
