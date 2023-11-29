import { Component } from '@angular/core';
import { NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { CartIndicatorComponent } from './cart-indicator/cart-indicator.component';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgSwitch, 
    NgSwitchDefault, 
    NgSwitchCase, 
    HomeComponent,
    RouterModule,
    CartIndicatorComponent,
    MatButtonModule,
    MatIconModule]
})
export class AppComponent {
  title = 'frontend';

  constructor(private config: ConfigService) {
    console.log('[AppComponent] constructor with config ' + JSON.stringify(config.getConfig));
  }
}

/*
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { CartIndicatorComponent } from './cart-indicator/cart-indicator.component';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    RouterModule,
    CartIndicatorComponent,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <main>
      <section class="cart-indicator">
        <app-cart-indicator></app-cart-indicator>
      </section>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <button mat-mini-fab color="primary" aria-label="Packt Store">
            <mat-icon>home</mat-icon>
          </button>
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

*/