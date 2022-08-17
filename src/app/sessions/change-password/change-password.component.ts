import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'v-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  actionCode: string | null = '';

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.actionCode = this.route.snapshot.queryParamMap.get('oobCode');
  }

  async changePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const newPassword = this.changePasswordForm.controls['newPassword'].value;

    if (this.actionCode && newPassword) {
      await this.authService
        .sendChangePassword(this.actionCode, newPassword)
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
          console.log(error.message);
          const firebaseAuthInvalid = `Firebase: The action code is invalid.`;
          if (error.message.includes(firebaseAuthInvalid)) {
            await Swal.fire({
              icon: 'error',
              title: 'Error',
              html: 'Your verify code is invalid. <br/> This can happen if the code is malformed, expired, or has already been used.',
              heightAuto: false,
            });
            this.router.navigate(['session', 'sign-in']);
          } else {
            throw error;
          }
        });
    } else {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
  }
}
