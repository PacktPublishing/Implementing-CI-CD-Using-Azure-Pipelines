import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './app-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig = {};

  constructor(private http: HttpClient) { }

  async loadConfig(): Promise<void> {
    return this.http.get<AppConfig>('./assets/config/app.config.json').toPromise()
      .then(data => {
        this.config = data as AppConfig;
      });
  }

  getConfig(): AppConfig {
    return this.config;
  }

  getCatalogApiUrl(): string {
    return this.config.catalogApiUrl as string;
  }

  getCartApiUrl(): string {
    return this.config.cartApiUrl as string;
  }

  getCheckoutApiUrl(): string {
    return this.config.checkoutApiUrl as string;
  }
}
