import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { CustomValidators } from '@validators/custom-validators';
import { SubSink } from 'subsink2';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  signForm = new FormGroup({
    email: new FormControl('', [Validators.required, CustomValidators.email]),
  });

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRedirectResult();
  }

  async resetPassword() {
    if (this.signForm.invalid) {
      this.signForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const email = this.signForm.controls['email'].value!;

    await this.authService
      .sendPasswordReset(email)
      .then(async () => {
        this.loadingService.loadingOff();
        await Swal.fire({
          icon: 'success',
          title: 'Reset Password Complete',
          text: 'We send a link to your email for you to complete the process',
          heightAuto: false,
        });
        this.router.navigate(['/session/sign-in']);
      })
      .catch((err) => {
        this.loadingService.loadingOff();
        throw err;
      });
  }

  async googleSignIn() {
    this.loadingService.loadingOn();
    await this.authService.signInWithGoogle();
  }

  getRedirectResult() {
    this.loadingService.loadingOn();
    this.subs.sink = this.authService.getRedirectResult().subscribe({
      next: (resp) => {
        this.loadingService.loadingOff();
        if (resp !== null) {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loadingService.loadingOff();
      },
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
