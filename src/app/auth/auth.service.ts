import { Injectable, signal } from '@angular/core';
import { DbService } from '../db/db.service';
import { User } from '../db/db.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private db: DbService) { }

  authenticatedUser = signal<User | null>(this.db.authenticatedUser);

  login(username: string, password: string): boolean {
    const user = this.db.users.find((user) => user.username === username && user.password === password);

    if (user) {
      this.db.authenticatedUser = user;
      this.authenticatedUser.update(() => user);
      return true;
    }

    return false;
  }

  logout(): void {
    this.db.authenticatedUser = null;
    this.authenticatedUser.update(() => null);
  }

  register(userData: Partial<User>): void {
    const user = {
      id: this.db.users.length + 1,
      username: userData.username!,
      password: userData.password!,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phoneNumber: userData.phoneNumber || '',
      email: userData.email || '',
      country: userData.country || '',
      city: userData.city || '',
      address: userData.address || '',
      zipCode: userData.zipCode || '',
    };
    this.db.user = user;
    this.db.authenticatedUser = user;
    this.authenticatedUser.update(() => user);
  }
}
