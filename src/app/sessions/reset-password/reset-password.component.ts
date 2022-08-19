import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { CustomValidators } from '@validators/custom-validators';
import Swal from 'sweetalert2';

@Component({
  selector: 'v-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  passwordResetForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        CustomValidators.password,
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    CustomValidators.match('newPassword', 'confirmPassword')
  );

  actionCode: string = '';

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.actionCode = this.route.snapshot.queryParamMap.get('oobCode')!;
  }

  async confirmPasswordReset() {
    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const newPassword = this.passwordResetForm.controls['newPassword'].value!;

    await this.authService
      .confirmPasswordReset(this.actionCode, newPassword)
      .then(async () => {
        this.loadingService.loadingOff();
        await Swal.fire({
          icon: 'success',
          title: 'Change Password Complete',
          text: 'You will be redirected to sign in page',
          heightAuto: false,
        });
        this.router.navigate(['session', 'sign-in']);
      })
      .catch(async (error) => {
        this.loadingService.loadingOff();
        this.router.navigate(['session', 'sign-in']);
      });
  }
}
