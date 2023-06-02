import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page'
  }, {
    path: 'cart',
    component: CartComponent,
    title: 'Shopping cart'
  }
];

export default routeConfig;