import { ErrorHandler, Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor() {}

  handleError(error: any): void {
    console.error(error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
      heightAuto: false,
    });
  }
}
