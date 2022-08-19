import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'v-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss'],
})
export class VerifyUserComponent implements OnInit, OnDestroy {
  timeOut!: NodeJS.Timeout;
  /**
   * Display time out number before redirect.
   * We use 3 seconds delay
   */
  _timeOut: number = 3;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const actionCode = this.route.snapshot.queryParamMap.get('oobCode');
    this.verifyEmail(actionCode!);
  }

  async verifyEmail(actionCode: string) {
    this.loadingService.loadingOn();
    await this.authService
      .verifyEmail(actionCode)
      .then(() => {
        this.loadingService.loadingOff();
        const interval = setInterval(() => {
          this._timeOut--;
          if (this._timeOut === 0) {
            clearInterval(interval);
          }
        }, 1000);
        this.timeOut = setTimeout(() => {
          this.router.navigate(['session', 'sign-in']);
        }, 3050);
      })
      .catch((err) => {
        this.loadingService.loadingOff();
        this.router.navigate(['session', 'sign-in']);
        throw err;
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeOut);
  }
}
