import { Injectable, inject, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Product } from './product';
import { Cart } from './cart';
import { CartItem } from './cartitem';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  settingsService: SettingsService = inject(SettingsService);
  url = this.settingsService.getCartApiUrl();
  cart: Cart | undefined;
  @Output() change = new EventEmitter<Cart>();

  constructor(private http: HttpClient) {
    this.init().subscribe(cart => {
      this.cart = cart;
      this.change.emit(this.cart);
    });
  }

  init(): Observable<Cart> {
    console.log("[CartService] init");
    return this.http.post<Cart>(this.url + 'carts', {});
  }

  getCart(): Cart {
    return this.cart as Cart;
  }

  addToCart(product: Product): Observable<Cart> {
    console.log(`[CartService] Add to cart: ${this.cart?.id} product ` + product.sku);
    let cartItem = {
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1
    } as CartItem;
    var response = this.http.post<Cart>(this.url + 'carts/' + this.cart?.id + "/item", cartItem)
    response.subscribe(cart => {
      this.cart = cart;
      this.change.emit(this.cart);
    });
    return response;
  }
}
