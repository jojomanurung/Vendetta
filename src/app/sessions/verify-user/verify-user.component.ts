import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { LoadingService } from '@service/loading/loading.service';

@Component({
  selector: 'v-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss'],
})
export class VerifyUserComponent implements OnInit, OnDestroy {
  timeOut!: NodeJS.Timeout;
  /**
   * Display time out number before redirect.
   * We use 5 seconds delay
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
    await this.authService.verifyEmail(actionCode).catch((error) => {
      this.loadingService.loadingOff();
      this.router.navigate(['session', 'sign-in']);
      throw error;
    });
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
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeOut);
  }
}
