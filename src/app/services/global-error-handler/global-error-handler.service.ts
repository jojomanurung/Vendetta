import { ErrorHandler, Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor() {}

  handleError(error: Error): void {
    console.error(error.message);

    const firebaseAuthInvalid = [
      'Firebase: The action code is invalid',
      'Firebase: The action code has expired',
    ];
    if (firebaseAuthInvalid.findIndex((e) => error.message.includes(e)) > -1) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'Your link is invalid. <br/> This can happen if the link is malformed, expired, or has already been used.',
        heightAuto: false,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        heightAuto: false,
      });
    }
  }
}
