import { Component, computed, effect } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DbService } from '../db/db.service';
import { Product } from '../db/db.interface';
import { TagModule } from 'primeng/tag';
import { CartService } from '../cart/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

export interface ProductListProduct extends Product {
  addToCart: (productId: number) => void;
  inCart: boolean;
  productRating: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CardModule, ButtonModule, TagModule, FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  providers: [DbService],
})
export class ProductListComponent {
  products: ProductListProduct[] = [];
  cart = computed(() => this.cartService.cart());
  showSearch: boolean = false;

  // Search/filter state
  search = {
    name: '',
    description: '',
    genre: '',
    length: '',
    director: '',
    actors: '',
    releaseDate: '',
    showingDate: '',
    price: '',
    rating: '',
  };

  get filteredProducts(): ProductListProduct[] {
    if (!this.showSearch) return this.products;
    return this.products.filter((product) => {
      const s = this.search;
      const matchLength = (() => {
        if (!s.length) return true;
        const minutes = parseInt(product.length);
        if (s.length === 'Ispod 120') return minutes < 120;
        if (s.length === 'Do 130') return minutes <= 130;
        if (s.length === 'Do 140') return minutes <= 140;
        if (s.length === 'Do 150') return minutes <= 150;
        if (s.length === 'Do 160') return minutes <= 160;
        if (s.length === 'Do 170') return minutes <= 170;
        if (s.length === 'Iznad 180') return minutes > 180;
        return true;
      })();
      return (
        (!s.name || product.name.toLowerCase().includes(s.name.toLowerCase())) &&
        (!s.description || product.description.toLowerCase().includes(s.description.toLowerCase())) &&
        (!s.genre || product.genre.toLowerCase().includes(s.genre.toLowerCase())) &&
        matchLength &&
        (!s.director || product.director.toLowerCase().includes(s.director.toLowerCase())) &&
        (!s.actors || product.actors.toLowerCase().includes(s.actors.toLowerCase())) &&
        (!s.releaseDate || product.releaseDate.includes(s.releaseDate)) &&
        (!s.showingDate || product.showingDate.includes(s.showingDate)) &&
        (!s.price || product.price === +s.price) &&
        (!s.rating || (product.productRating && product.productRating >= +s.rating))
      );
    });
  }

  get uniqueShowingDates(): string[] {
    return Array.from(new Set(this.products.map(p => p.showingDate))).sort((a, b) => a.localeCompare(b));
  }
  get uniqueNames(): string[] {
    return Array.from(new Set(this.products.map(p => p.name))).sort((a, b) => a.localeCompare(b));
  }
  get uniqueGenres(): string[] {
    return Array.from(new Set(this.products.flatMap(p => p.genre.split(',').map(g => g.trim())))).sort((a, b) => a.localeCompare(b));
  }
  get uniqueLengths(): string[] {
    return [
      'Ispod 120',
      'Do 130',
      'Do 140',
      'Do 150',
      'Do 160',
      'Do 170',
      'Iznad 180',
    ];
  }
  get uniqueDirectors(): string[] {
    return Array.from(new Set(this.products.map(p => p.director))).sort((a, b) => a.localeCompare(b));
  }
  get uniqueActors(): string[] {
    return Array.from(new Set(this.products.flatMap(p => p.actors.split(',').map(a => a.trim())))).sort((a, b) => a.localeCompare(b));
  }
  get uniqueReleaseDates(): string[] {
    return Array.from(new Set(this.products.map(p => p.releaseDate))).sort((a, b) => a.localeCompare(b));
  }
  get uniquePrices(): number[] {
    return Array.from(new Set(this.products.map(p => p.price))).sort((a, b) => a - b);
  }
  get uniqueRatings(): number[] {
    return Array.from(new Set(this.products.map(p => Math.round(p.productRating)))).sort((a, b) => a - b);
  }

  // Vraca sve recenzije za dati film
  getProductReviews(productId: number) {
    return this.dbService.getProductRatingsForProduct(productId);
  }

  addToCart = (productId: number): void => {
    const product = this.dbService.products$().find(
      (product) => product.id === productId
    );
    this.cartService.addItemToCart(product as Product);
    alert('Film je dodat u korpu!');
  };

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  public dbService = this._dbService;
  constructor(private _dbService: DbService, private cartService: CartService, private route: ActivatedRoute) {
    effect(() => {
      const products = this.dbService.products$();
      const cart = this.cart();
      this.products = products.map((product) => ({
        ...product,
        inCart: this.cartService.isProductInCart(product),
        addToCart: () => this.addToCart(product.id),
        productRating: this.dbService
          .getProductRatingsForProduct(product.id)
          .reduce<number>((acc, curr, i, products) => {
            if (i === products.length - 1) {
              return (acc += curr.rating) / products.length;
            }
            return (acc += curr.rating);
          }, 0),
      }));
    });
    window.addEventListener('toggleSearchParams', () => this.toggleSearch());
  }
}
