import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsComponent } from './sessions.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { SessionsGuard } from '../shared/guards/sessions/sessions.guard';

const sessions: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [SessionsGuard],
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [SessionsGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [SessionsGuard],
  },
  {
    path: 'verify',
    component: VerifyUserComponent,
    canActivate: [SessionsGuard],
  },
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: '',
    component: SessionsComponent,
    children: [...sessions],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsRoutingModule {}
