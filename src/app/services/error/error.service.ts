import { ErrorHandler, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import Swal from 'sweetalert2';

interface AngularFireError extends Error {
  rejection: FirebaseError;
}

function isAngularFireError(err: any): err is AngularFireError {
  return err.rejection && err.rejection.name === 'FirebaseError';
}

@Injectable()
export class ErrorService implements ErrorHandler {
  constructor() {}

  handleError(error: any): void {
    if (isAngularFireError(error)) {
      this.angularFireErrorHandler(error);
    } else {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        heightAuto: false,
      });
    }
  }

  angularFireErrorHandler(error: AngularFireError) {
    const rejection = error.rejection;
    const errorCode = rejection.code;
    const authInvalid = [
      'auth/expired-action-code',
      'auth/invalid-action-code',
    ];
    if (authInvalid.includes(errorCode)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'Your link is invalid. <br/> This can happen if the link is malformed, expired, or has already been used.',
        heightAuto: false,
      });
    } else if (errorCode === 'auth/email-already-in-use') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'Email already been used. <br> Please use different email or Login if this is your email address.',
        heightAuto: false,
      });
    } else if (errorCode === 'auth/timeout') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'Timeout. <br> Please try again or contact administrator.',
        heightAuto: false,
      });
    } else if (errorCode === 'auth/user-not-found') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'User not found or email address is invalid.',
        heightAuto: false,
      });
    } else if (errorCode === 'auth/wrong-password') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'Incorrect password. <br> Please try again.',
        heightAuto: false,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: rejection.message,
        heightAuto: false,
      });
    }
    console.error(rejection);
  }
}
