import { Injectable, inject } from '@angular/core';
import { Product } from './product';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  configService: ConfigService = inject(ConfigService);
  url = this.configService.getCatalogApiUrl();

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
