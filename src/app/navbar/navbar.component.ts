import { Component, computed, effect } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../cart/cart.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, BadgeModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  items: MenuItem[] = [];
  authenticatedUser = computed(() => this.auth.authenticatedUser());
  cart = computed(() => this.cartService.cart());
  cartSize: number | null = null;

  INITIAL_MENUBAR_ITEMS: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      route: '/',
    },
    {
      label: 'Pretraga',
      icon: 'pi pi-fw pi-search',
      command: () => {
        window.dispatchEvent(new CustomEvent('toggleSearchParams'));
      },
    },
    {
      label: 'Korpa',
      icon: 'pi pi-fw pi-shopping-cart',
      route: '/cart',
    },
    {
      label: 'Login',
      icon: 'pi pi-fw pi-sign-in',
      route: '/login',
    },
    {
      label: 'Sign Up',
      icon: 'pi pi-fw pi-user-plus',
      route: '/register',
    },
  ];

  AUTHENTICATED_MENUBAR_ITEMS = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      route: '/',
    },
    {
      label: 'Pretraga',
      icon: 'pi pi-fw pi-search',
      command: () => {
        window.dispatchEvent(new CustomEvent('toggleSearchParams'));
      },
    },
    {
      label: 'Korpa',
      icon: 'pi pi-fw pi-shopping-cart',
      route: '/cart',
    },
    {
      label: 'Profil',
      icon: 'pi pi-fw pi-user',
      route: '/profile',
    },
    {
      label: 'Log Out',
      icon: 'pi pi-fw pi-sign-out',
      command: () => {
        this.auth.logout();
        window.location.pathname = '/';
      },
    },
  ];

  getCartCount() {
    return this.cartService.cartCount();
  }

  constructor(private auth: AuthService, private cartService: CartService) {
    effect(() => {
      this.items =
        this.authenticatedUser() === null
          ? this.INITIAL_MENUBAR_ITEMS
          : this.AUTHENTICATED_MENUBAR_ITEMS;
    });

    effect(() => {
      this.cartSize = this.cart().length;
    });
  }
}
