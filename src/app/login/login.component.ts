import { Component, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { createExistingUsernameValidator } from './existingUsername.validator';
import { DbService } from '../db/db.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, FormsModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
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

  loginFormControl = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      createExistingUsernameValidator(
        this.dbService.users.map((user) => user.username)
      ),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
  });

  loginError = false;

  login(): void {
    if (this.loginFormControl.valid) {
      const { username, password } = this.loginFormControl.value;
      const success = this.authService.login(username as string, password as string);
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.loginError = true;
      }
    }
  }
}
