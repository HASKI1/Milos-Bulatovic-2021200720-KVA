import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function createExistingUsernameValidator(
  existingUsernames: string[]
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const username = control.value;
    if (!existingUsernames.includes(username)) {
      return { existingUsername: true };
    }
    return null;
  };
}
