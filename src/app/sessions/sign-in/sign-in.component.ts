import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  nextUrl!: string | null;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.nextUrl = this.route.snapshot.queryParamMap.get('next');
  }

  async signIn() {
    if (this.signForm.invalid) {
      this.signForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const email = this.signForm.controls['email'].value;
    const password = this.signForm.controls['password'].value;

    if (email && password) {
      await this.authService.emailSignIn(email, password);
      this.loadingService.loadingOff();
      if (this.nextUrl) {
        this.router.navigate([this.nextUrl]);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.signForm.markAllAsTouched();
      return;
    }
  }

  async googleSignIn() {
    this.loadingService.loadingOn();
    await this.authService.googleSignIn();
    this.loadingService.loadingOff();
    if (this.nextUrl) {
      this.router.navigate([this.nextUrl]);
    } else {
      this.router.navigate(['/']);
    }
  }

}
