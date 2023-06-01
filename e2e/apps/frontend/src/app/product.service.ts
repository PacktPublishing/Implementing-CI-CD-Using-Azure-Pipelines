import { Injectable, inject } from '@angular/core';
import { Product } from './product';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  settingsService: SettingsService = inject(SettingsService);
  url = this.settingsService.getCatalogApiUrl();

  constructor() { }

  async getAllProducts(): Promise<Product[]> {
    const data = await fetch(this.url + 'products');
    return await data.json() ?? [];
  }
  
  async getProductBySku(sku: string): Promise<Product | undefined> {
    const data = await fetch(this.url + 'products/' + sku);
    return await data.json() ?? {};
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`);
  }
}
