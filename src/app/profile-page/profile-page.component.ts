import { Component, signal } from '@angular/core';
import { DbService } from '../db/db.service';
import { Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../db/db.interface';
import { createExistingUsernameValidator } from '../login/existingUsername.validator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    MessageModule,
    ToastModule,
  ],
  templateUrl: './profile-page.component.html',
  providers: [ConfirmationService, MessageService],
})
export class ProfilePageComponent {
  user = signal(this.dbService.authenticatedUser);

  userForm = new FormGroup({
    username: new FormControl(this.user()?.username, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      createExistingUsernameValidator(
        this.dbService.users.map((user) => user.username)
      ),
    ]),
    password: new FormControl(this.user()?.password, [
      Validators.required,
      Validators.maxLength(20),
    ]),
    firstName: new FormControl(this.user()?.firstName || '', [
      Validators.required,
      Validators.pattern(/^[A-Za-zčćžšđČĆŽŠĐ\s'-]{2,30}$/),
    ]),
    lastName: new FormControl(this.user()?.lastName || '', [
      Validators.required,
      Validators.pattern(/^[A-Za-zčćžšđČĆŽŠĐ\s'-]{2,30}$/),
    ]),
    phoneNumber: new FormControl(this.user()?.phoneNumber, [
      Validators.pattern(new RegExp(/^\+?\d{1,15}$/)),
    ]),
    email: new FormControl(this.user()?.email, [
      Validators.pattern(/^[\w\.\-]+@[a-zA-Z\d\.\-]+\.[a-zA-Z]{2,}$/),
    ]),
    country: new FormControl(this.user()?.country, [
      Validators.pattern(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/),
    ]),
    city: new FormControl(this.user()?.city, [
      Validators.pattern(/^[a-zA-Z]+(?:[\s\-'][a-zA-Z]+)*$/),
    ]),
    address: new FormControl(this.user()?.address, [
      Validators.pattern(/^[a-zA-Z0-9\s,'-\.#]+$/),
    ]),
    zipCode: new FormControl(this.user()?.zipCode, [
      Validators.pattern(/^\d{3,10}$/),
    ]),
  });

  isFormValid() {
    return this.userForm.valid && this.userForm.dirty && this.userForm.touched;
  }

  updateProfile(): void {
    if (this.userForm.valid) {
      this.dbService.updateUser({
        ...this.user(),
        ...this.userForm.value,
      } as User);
      this.user.update(() => this.dbService.authenticatedUser);
    }
  }

  constructor(
    private dbService: DbService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    if (!this.user()) {
      this.router.navigate(['/login']);
    }
  }

  confirmProfileUpdate(event: Event) {
    this.confirmationService.confirm({
      target: event.target as Element,
      message: 'Da li ste sigurni da zelite da izmenite svoj profil?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.updateProfile();
        this.messageService.add({
          severity: 'success',
          summary: 'Uspeh',
          detail: 'Profil je azuriran',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Izmene nisu sacuvane.',
          life: 3000,
        });
      },
    });
  }
}
