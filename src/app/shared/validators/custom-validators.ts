import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Email validators that following spec from
   * [w3resource](https://www.w3resource.com/javascript/form/email-validation.php)
   *
   * If somehow this didn't meet the requirement
   * @see `regExp()`
   */
  static email(control: AbstractControl): { [key: string]: any } | null {
    let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return CustomValidators.regExp(emailPattern, 'email')(control);
  }

  /**
   * Password validator that requires control value
   * between 6 to 20 characters which contain at least one numeric digit,
   * one uppercase and one lowercase letter
   *
   * If somehow this didn't meet the requirement
   * @see `regExp()`
   */
  static password(control: AbstractControl): { [key: string]: any } | null {
    let passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return CustomValidators.regExp(passwordPattern, 'password')(control);
  }

  /**
   * Validator that requires a pair of controls have identical value.
   * @param source is the control name used as a comparison
   * @param target is the control name that we want to compare with source and set error
   * @example
   * ### Validate between newPassword and confirmPassword
   *
   * ```typescript
   * const formGroup = new FormGroup(
   *  {
   *    newPassword: new FormControl('', Validators.required),
   *    confirmPassword: new FormControl('', Validators.required),
   *  },
   *  CustomValidators.match('newPassword', 'confirmPassword')
   * );
   *
   * console.log(formGroup.controls['confirmPassword'].errors); // {notMatch: "123"}
   * ```
   * @return returns an error map with the `notMatch` property if the validation check fails,
   * otherwise `null`.
   */
  static match(source: string, target: string): ValidatorFn {
    return (control: AbstractControl) => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      if (
        isEmptyInputValue(targetCtrl?.value) ||
        isEmptyInputValue(!sourceCtrl?.value)
      ) {
        return null; // don't validate when control is empty
      }

      if (sourceCtrl?.value !== targetCtrl?.value) {
        targetCtrl?.setErrors({ notMatch: sourceCtrl?.value });
      }

      return null;
    };
  }

  /**
   * Validator that requires control value match with regular expression
   * @param pattern is regular expression
   * @param name is used for error properties that stored in errors property.
   * @example
   * ### Validate that field is valid email address
   *
   * ```typescript
   * const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   * const name = 'email';
   * const control = new FormControl('Vendetta', CustomValidators.regExp(pattern, name));
   *
   * console.log(control.errors); // {email: Vendetta}
   * ```
   * @return returns an error map with the `name` value that passed as property if the validation check fails,
   * otherwise `null`.
   */
  static regExp(pattern: RegExp, name: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (isEmptyInputValue(control.value)) {
        return null; // don't validate when control is empty
      }

      return pattern.test(control.value) ? null : { [name]: control.value };
    };
  }
}

/**
 * Check if the object is a string or array before evaluating the length attribute.
 * This avoids falsely rejecting objects that contain a custom length attribute.
 * For example, the object {id: 1, length: 0, width: 0} should not be returned as empty.
 */
function isEmptyInputValue(value: any) {
  return (
    value == null ||
    ((typeof value === 'string' || Array.isArray(value)) && value.length === 0)
  );
}
