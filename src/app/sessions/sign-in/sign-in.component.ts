import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { CustomValidators } from '@validators/custom-validators';
import { SubSink } from 'subsink2';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  signForm = new FormGroup({
    email: new FormControl('', [Validators.required, CustomValidators.email]),
    password: new FormControl('', Validators.required),
  });
  nextUrl!: string | null;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.nextUrl = this.route.snapshot.queryParamMap.get('next');
    this.getRedirectResult();
  }

  signIn() {
    if (this.signForm.invalid) {
      this.signForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const email = this.signForm.controls['email'].value!;
    const password = this.signForm.controls['password'].value!;

    this.subs.sink = this.authService.emailSignIn(email, password).subscribe({
      next: () => {
        this.loadingService.loadingOff();
        if (this.nextUrl) {
          this.router.navigate([this.nextUrl]);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loadingService.loadingOff();
      },
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
          if (this.nextUrl) {
            this.router.navigate([this.nextUrl]);
          } else {
            this.router.navigate(['/']);
          }
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
