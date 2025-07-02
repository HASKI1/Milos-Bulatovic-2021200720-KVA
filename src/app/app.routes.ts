import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
  {
    path: 'cart',
    component: CartPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
  },
  {
    path: 'search',
    component: ProductListComponent,
    data: { showSearch: true },
  },
];
