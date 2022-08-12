import { ErrorHandler, Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() { }

  handleError(error: any): void {
    console.error(error);
    swal.fire({
      icon: 'error',
      title: 'Error',
      html: error.message,
      heightAuto: false,
      customClass: {
        htmlContainer: 'swal-scroll'
      }
    });
  }
}
