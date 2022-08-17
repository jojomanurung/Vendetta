import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { LoadingService } from '@service/loading/loading.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  signForm = new FormGroup({
    email: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  async resetPassword() {
    if (this.signForm.invalid) {
      this.signForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const email = this.signForm.controls['email'].value;

    if (email) {
      await this.authService.sendResetPassword(email);
      this.loadingService.loadingOff();
      await Swal.fire({
        icon: 'success',
        title: 'Reset Password Complete',
        text: 'We send a link to your email for you to complete the process',
        heightAuto: false
      });
      this.router.navigate(['/session/sign-in']);
    } else {
      this.signForm.markAllAsTouched();
      return;
    }
  }

  async googleSignIn() {
    this.loadingService.loadingOn();
    await this.authService.googleSignIn();
    this.loadingService.loadingOff();
    this.router.navigate(['/']);
  }

}
