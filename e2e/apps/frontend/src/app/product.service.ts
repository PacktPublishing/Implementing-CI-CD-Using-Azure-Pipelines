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

  productList: Product[] = [
    {
      sku: "1",
      name: 'A113 Transitional Housing',
      price: 100,
      quantity: 100,
      photo: '/assets/house1.jpg'
    },
    {
      sku: "2",
      name: 'Warm Beds Housing Support',
      price: 200,
      quantity: 200,
      photo: '/assets/house2.jpg'
    },
    {
      sku: "3",
      name: 'Homesteady Housing',
      price: 300,
      quantity: 300,
      photo: '/assets/house3.jpg'
    },
    {
      sku: "4",
      name: 'Happy Homes Group',
      price: 400,
      quantity: 400,
      photo: '/assets/house4.jpg'
    },
    {
      sku: "5",
      name: 'Hopeful Apartment Group',
      price: 500,
      quantity: 500,
      photo: '/assets/house5.jpg'
    }
  ];

  async getAllProducts(): Promise<Product[]> {
    //return this.productList;
    const data = await fetch(this.url + 'products');
    return await data.json() ?? [];
  }
  
  async getProductBySku(sku: string): Promise<Product | undefined> {
    // return this.productList.find(product => product.sku === sku);
    const data = await fetch(this.url + 'products/' + sku);
    return await data.json() ?? {};
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`);
  }
}
