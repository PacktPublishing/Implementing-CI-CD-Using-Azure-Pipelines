import { Injectable, inject, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Product } from './product';
import { Cart } from './cart';
import { CartItem } from './cartitem';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cookieService: CookieService = inject(CookieService);
  settingsService: SettingsService = inject(SettingsService);
  url = this.settingsService.getCartApiUrl();
  cart: Cart | undefined;
  @Output() change = new EventEmitter<Cart>();

  constructor(private http: HttpClient) {
    var cartId = this.cookieService.get('cartId');

    this.initializeCart(cartId);
  }

  initializeCart(cartId: String) {
    this.init(cartId).subscribe(cart => {
      this.cart = cart;
      this.cookieService.set('cartId', this.cart?.id as string);
      this.change.emit(this.cart);
    });
  }

  init(cartId: String): Observable<Cart> {
    console.log("[CartService] init");
    if (cartId !== undefined && cartId !== '') {
      return this.http.get<Cart>(this.url + 'carts/' + cartId);
    } else {
      return this.http.post<Cart>(this.url + 'carts', {});
    }
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

  clearCart(): Observable<void> {
    console.log(`[CartService] Clear cart: ${this.cart?.id}`);
    var response = this.http.delete<void>(this.url + 'carts/' + this.cart?.id);
    response.subscribe(() => {
      this.initializeCart('');
    });
    return response;
  }
}
