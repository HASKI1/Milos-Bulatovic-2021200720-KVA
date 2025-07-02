import { Component, computed } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CartService } from '../cart/cart.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DbService } from '../db/db.service';
import { TagModule } from 'primeng/tag';
import { Product } from '../db/db.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [DataViewModule, CurrencyPipe, ButtonModule, TagModule, DecimalPipe],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent {
  cart = this.cartService.cart;

  removeCartItem(product: ProductCartProduct): void {
    this.cartService.removeItemFromCart(product);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  getTotalPrice(): number {
    return this.cart().reduce((acc, curr) => acc + curr.price * curr.count, 0);
  }

  getProductRating(productId: number): number | null {
    const ratings = this.dbService.getProductRatingsForProduct(productId);
    if (!ratings.length) return null;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / ratings.length;
  }

  constructor(
    public cartService: CartService,
    public dbService: DbService,
    public router: Router
  ) { }
}

export interface ProductCartProduct extends Product {
  productRating: number;
}
