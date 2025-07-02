import { Component, computed, signal } from '@angular/core';
import { DbService } from '../db/db.service';
import { Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../cart/cart.service';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ProductRating, User } from '../db/db.interface';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    DataViewModule,
    TagModule,
    CurrencyPipe,
    DecimalPipe,
    DividerModule,
    FormsModule,
    ToastModule,
    DropdownModule,
  ],
  providers: [MessageService],
  templateUrl: './checkout-page.component.html',
})
export class CheckoutPageComponent {
  user = signal(this.dbService.authenticatedUser);
  cart = this.cartService.cart;

  ratingOptions = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ];
  productRating: { [productId: number]: number | null } = {};

  statusOptions = [
    { label: 'Rezervisano', value: 'rezervisano' },
    { label: 'Odgledano', value: 'odgledano' },
    { label: 'Otkazano', value: 'otkazano' },
  ];
  productStatus: { [productId: number]: string } = {};

  productComment: { [productId: number]: string } = {};

  goToHome() {
    this.router.navigate(['/']);
  }

  addRating(productId: number): void {
    const rating: ProductRating = {
      productId,
      rating: this.productRating[productId]!,
      comment: this.productComment[productId] || '',
      userId: (this.user() as User).id,
    };
    this.dbService.setProductRating(rating);
    const product = this.cart().find((p) => p.id === productId);
    if (product) {
      this.cartService.removeItemFromCart(product);
    }
    this.messageService.clear();
    this.ratingSubmitSuccess();
    this.router.navigate(['/']);
  }

  removeFromCart(productId: number) {
    const product = this.cart().find((p) => p.id === productId);
    if (product) {
      this.cartService.removeItemFromCart(product);
    }
  }

  getTotalPrice(): number {
    return this.cart().reduce((acc, curr) => acc + curr.price * curr.count, 0);
  }

  getProductRating(productId: number): number | null {
    const ratings = this.dbService.getProductRatingsForProduct(productId);
    if (!ratings.length) return null;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round((sum / ratings.length) * 100) / 100;
  }

  canRate(productId: number): boolean {
    return true;
  }

  ngOnInit() {
    this.cart().forEach((product) => {
      if (!this.productStatus[product.id]) {
        this.productStatus[product.id] = 'rezervisano';
      }
      if (this.productRating[product.id] === undefined) {
        this.productRating[product.id] = null;
      }
      if (this.productComment[product.id] === undefined) {
        this.productComment[product.id] = '';
      }
    });
  }

  ratingSubmitFail() {
    this.messageService.add({
      severity: 'error',
      summary: 'Greška',
      detail: 'Došlo je do greške pri ocenjivanju',
    });
  }

  ratingSubmitSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Rating submitted',
      detail: 'Thank you for your feedback',
    });
  }

  constructor(
    public dbService: DbService,
    public router: Router,
    public cartService: CartService,
    public messageService: MessageService
  ) {
    if (!this.user() || this.cart().length === 0) {
      this.router.navigate(['/']);
    }
  }
}
