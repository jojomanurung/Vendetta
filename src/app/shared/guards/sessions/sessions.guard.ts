import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionsGuard implements CanActivate {
  constructor(public router: Router) {}

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
  checkAuthMode(
    currentUrl: string,
    mode: string | null,
    actionCode: string | null
  ) {
    const safeRoute = [
      '/session/sign-in',
      '/session/sign-up',
      '/session/forgot-password',
    ];
    const unSafeRoute = ['/session/verify', '/session/change-password'];
    if (!mode && !actionCode) {
      if (currentUrl === '/session') {
        return this.router.createUrlTree(['/session/sign-in']);
      } else if (safeRoute.includes(currentUrl)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (currentUrl === '/session' && mode === 'verifyEmail') {
        return this.router.createUrlTree(['/session/verify'], {
          queryParams: { oobCode: actionCode },
        });
      } else if (currentUrl === '/session' && mode === 'resetPassword') {
        return this.router.createUrlTree(['/session/change-password'], {
          queryParams: { oobCode: actionCode },
        });
      } else if (unSafeRoute.includes(currentUrl) && !mode && actionCode) {
        return true;
      } else {
        return false;
      }
    }
  }
}
