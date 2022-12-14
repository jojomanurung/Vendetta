import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { User } from '@interfaces/user.type';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionsGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUrl = state.url.split('?')[0];
    const mode = route.queryParamMap.get('mode');
    const actionCode = route.queryParamMap.get('oobCode');
    return this.checkAuthMode(currentUrl, mode, actionCode);
  }

  /**
   * Guards for session route.
   *
   * @param currentUrl is current state route without any queryParams
   *
   * @param mode
   * is a query param that given from Firebase actionURL send to user email
   * when requesting *reset password, verify email, recover email*. Current accepted values :
   * - resetPassword
   * - verifyEmail
   * - recoverEmail
   *
   * @param actionCode is unique code to verify the user
   *
   * Our action URL are directed to route "/session" *without any child route*
   */
  async checkAuthMode(
    currentUrl: string,
    mode: string | null,
    actionCode: string | null
  ) {
    const user = await this.authService.getUser();
    const loggedIn = !!user;
    console.log(loggedIn, user);
    if (!mode || !actionCode) {
      return this.router.createUrlTree(['/session/sign-in']);
    }

    if (currentUrl === '/session/action' && mode === 'verifyEmail') {
      return this.router.createUrlTree(['/session/verify'], {
        queryParams: { mode: mode, oobCode: actionCode },
      });
    } else if (currentUrl === '/session/action' && mode === 'resetPassword') {
      return this.router.createUrlTree(['/session/reset-password'], {
        queryParams: { mode: mode, oobCode: actionCode },
      });
    } else if (currentUrl === '/session/verify' && mode === 'verifyEmail') {
      return true;
    } else if (
      currentUrl === '/session/reset-password' &&
      mode === 'resetPassword'
    ) {
      return true;
    } else {
      return loggedIn ? false : this.router.createUrlTree(['/session/sign-in']);
    }
  }
}
