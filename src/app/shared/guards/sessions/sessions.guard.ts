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
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUrl = state.url;
    /**
     * Guards for route verify.
     * Add more "else if" condition if other routes needs to be guarded
     */
    if (currentUrl === '/session/verify') {
      const mode = route.queryParamMap.get('mode');
      const actionCode = route.queryParamMap.get('oobCode');
      if (mode === 'verifyEmail' && actionCode) {
        return true;
      } else {
        return this.router.createUrlTree(['session', 'sign-up']);
      }
    } else {
      return true;
    }
  }
}
