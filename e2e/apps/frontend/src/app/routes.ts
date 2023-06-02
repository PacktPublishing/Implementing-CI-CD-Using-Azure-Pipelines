import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page'
  }, {
    path: 'cart',
    component: CartComponent,
    title: 'Shopping cart'
  }, {
    path: 'checkout',
    component: CheckoutComponent,
    title: 'checkout'
  }
];

export default routeConfig;