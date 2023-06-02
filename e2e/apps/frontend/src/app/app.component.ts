import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { CartIndicatorComponent } from './cart-indicator/cart-indicator.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    RouterModule,
    CartIndicatorComponent
  ],
  template: `
    <main>
      <section class="cart-indicator">
        <app-cart-indicator></app-cart-indicator>
      </section>
      <a [routerLink]="['/']">
        <header class="brand-name">
          Pack Store
        </header>
      </a>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Home';
}
