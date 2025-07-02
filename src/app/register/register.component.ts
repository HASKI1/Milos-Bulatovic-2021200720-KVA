import { Component, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../db/db.interface';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { createUniqueUsernameValidator } from './uniqueUsername.validator';
import { DbService } from '../db/db.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [InputTextModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user = computed(() => this.authService.authenticatedUser());

  constructor(
    private authService: AuthService,
    private router: Router,
    private dbService: DbService
  ) {
    if (this.user() !== null) {
      this.router.navigate(['/profile']);
    }
  }

  register(): void {
    if (this.registerFormGroup.valid) {
      const userData = Object.fromEntries(
        Object.entries(this.registerFormGroup.value).map(([k, v]) => [k, v ?? ''])
      );
      this.authService.register(userData);
      this.router.navigate(['/']);
    }
  }

  registerFormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      createUniqueUsernameValidator(
        this.dbService.users.map((user) => user.username)
      ),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zčćžšđČĆŽŠĐ\s'-]{2,30}$/),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zčćžšđČĆŽŠĐ\s'-]{2,30}$/),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+?\d{6,15}$/),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\w\.\-]+@[a-zA-Z\d\.\-]+\.[a-zA-Z]{2,}$/),
    ]),
    country: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZčćžšđČĆŽŠĐ\s-]{2,30}$/),
    ]),
    city: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZčćžšđČĆŽŠĐ\s-]{2,30}$/),
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9čćžšđČĆŽŠĐ\s,'-\.\#]{3,50}$/),
    ]),
    zipCode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3,10}$/),
    ]),
  });
}
