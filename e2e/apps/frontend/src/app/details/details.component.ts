import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <article>
      <section class="product-description">
        <h2 class="product-name">{{product?.name}}</h2>
        <p class="product-price">Price: {{product?.price | currency}}</p>
        <p class="product-quantity">Quantity: {{product?.quantity | number}}</p>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  productService = inject(ProductService);
  product: Product | undefined;

  constructor() {
    const sku = String(this.route.snapshot.params['sku']);
    this.productService.getProductBySku(sku).then(product => {
      this.product = product;
    });
  }
}
