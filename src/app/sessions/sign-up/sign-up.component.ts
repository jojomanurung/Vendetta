import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { LoadingService } from '@service/loading/loading.service';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
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
  ) { }

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
