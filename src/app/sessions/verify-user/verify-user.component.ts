import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';

@Component({
  selector: 'v-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit, OnDestroy {
  timeOut!: NodeJS.Timeout;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const mode = this.route.snapshot.queryParamMap.get('mode');
    const actionCode = this.route.snapshot.queryParamMap.get('oobCode');
    if (mode === 'verifyEmail' && actionCode) {
      this.verifyEmail(actionCode);
    } else {
      this.router.navigate(['session', 'sign-up']);
    }
  }

  async verifyEmail(actionCode: string) {
    await this.authService.verifyEmail(actionCode);
    this.timeOut = setTimeout(() => {
      this.router.navigate(['session', 'sign-in']);
    }, 1000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeOut);
  }

}
