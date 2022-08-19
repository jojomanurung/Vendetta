import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { CustomValidators } from '@validators/custom-validators';
import { SubSink } from 'subsink2';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnDestroy {
  private subs = new SubSink();

  signForm = new FormGroup({
    email: new FormControl('', [Validators.required, CustomValidators.email]),
    password: new FormControl('', [
      Validators.required,
      CustomValidators.password,
    ]),
  });

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  signUp() {
    if (this.signForm.invalid) {
      this.signForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const email = this.signForm.controls['email'].value!;
    const password = this.signForm.controls['password'].value!;

    this.subs.sink = this.authService.emailSignUp(email, password).subscribe({
      next: () => {
        this.loadingService.loadingOff();
        Swal.fire({
          icon: 'success',
          title: 'Sign up Complete',
          text: 'We send a link to your email for you to verify your email address or you can sign in directly',
          heightAuto: false,
        }).then(() => {
          this.router.navigate(['/session/sign-in']);
        });
      },
      error: (err) => {
        this.loadingService.loadingOff();
      },
    });
  }

  googleSignIn() {
    this.loadingService.loadingOn();
    this.subs.sink = this.authService.googleSignIn().subscribe({
      next: () => {
        this.loadingService.loadingOff();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loadingService.loadingOff();
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
