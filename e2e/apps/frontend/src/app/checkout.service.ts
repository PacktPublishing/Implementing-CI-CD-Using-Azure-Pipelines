import { Injectable, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Cart } from './cart';
import { CartItem } from './cartitem';
import { OrderRequest, OrderItem } from './orderrequest';
import { Observable } from 'rxjs';
import { OrderResponse } from './orderresponse';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  settingsService: SettingsService = inject(SettingsService);
  url = this.settingsService.getCheckoutApiUrl();
  orderResponse: OrderResponse | undefined;
  @Output() change = new EventEmitter<OrderResponse>();

  constructor(private http: HttpClient) { }

  getOrderResponse(): OrderResponse {
    return this.orderResponse as OrderResponse;
  }

  checkout(firstName: String, lastName: String, email: String, cart: Cart): Observable<OrderResponse> {
    let order = {
      customer: {
        firstName: firstName,
        lastName: lastName,
        email: email
      },
      items: cart.items.map((item: CartItem) => {
        return { sku: item.sku, name: item.name, price: item.price, quantity: item.quantity } as OrderItem
      })
    } as OrderRequest;
    var response = this.http.post<OrderResponse>(this.url + 'checkout', order);
    response.subscribe(orderResponse => {
      console.log("[CheckoutService] checkout complete" + orderResponse.orderId);
      this.orderResponse = orderResponse;
      this.change.emit(this.orderResponse);
    });
    return response;
  }
}
