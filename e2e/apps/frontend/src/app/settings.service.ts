import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  getCatalogApiUrl(): string {
    return "http://localhost:5050/";
  }

  getCartApiUrl(): string {
    return "http://localhost:5075/";
  }

  getCheckoutApiUrl(): string {
    return "http://localhost:5015/";
  }
}
