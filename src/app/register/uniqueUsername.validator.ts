import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function createUniqueUsernameValidator(
  existingUsernames: string[]
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const username = control.value;

    if (existingUsernames.includes(username)) {
      return { uniqueUsername: true };
    }

    return null;
  };
}
