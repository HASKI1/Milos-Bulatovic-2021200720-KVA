import { Injectable, computed, signal } from '@angular/core';
import { DbService } from '../db/db.service';
import { Product } from '../db/db.interface';

export interface CartProduct extends Product {
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = computed(() => {
    return this.db.cartSignal().map((item: any) => ({ ...item, count: item.count ?? 1 }));
  });

  cartCount = computed(() =>
    this.cart().map((p) => p.count).reduce((a, b) => a + b, 0)
  );

  constructor(private db: DbService) { }

  isProductInCart(product: Product): boolean {
    return this.cart().some((p) => p.id === product.id);
  }

  addItemToCart(product: Product): void {
    const currentCart = this.db.cart$() as CartProduct[];
    const existingProduct = currentCart.find((p) => p.id === product.id);
    let newCart;
    if (!existingProduct) {
      newCart = [...currentCart, { ...product, count: 1 }];
    } else {
      newCart = currentCart.map((p) =>
        p.id === product.id ? { ...p, count: (p.count ?? 1) + 1 } : p
      );
    }
    this.db.cart = newCart;
  }

  removeItemFromCart(product: Product): void {
    const currentCart = this.db.cart$() as CartProduct[];
    const existingProduct = currentCart.find((p) => p.id === product.id);
    if (!existingProduct) {
      return;
    }
    if ((existingProduct.count ?? 1) > 1) {
      const newCart = currentCart.map((p) =>
        p.id === product.id ? { ...p, count: (p.count ?? 1) - 1 } : p
      );
      this.db.cart = newCart;
      return;
    }
    const newCart = currentCart.filter((p) => p.id !== product.id);
    this.db.cart = newCart;
  }
}
