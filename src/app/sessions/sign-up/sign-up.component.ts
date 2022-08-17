import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { LoadingService } from '@service/loading/loading.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  async signUp() {
    if (this.signForm.invalid) {
      this.signForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const email = this.signForm.controls['email'].value;
    const password = this.signForm.controls['password'].value;
    if (email && password) {
      await this.authService.emailSignUp(email, password);
      this.loadingService.loadingOff();
      await Swal.fire({
        icon: 'success',
        title: 'Sign up Complete',
        text: 'We send a link to your email for you to verify your email address or you can sign in directly',
        heightAuto: false,
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
  }
}
