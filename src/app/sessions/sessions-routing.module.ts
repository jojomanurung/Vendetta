import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsComponent } from './sessions.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { SessionsGuard } from '../shared/guards/sessions/sessions.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';

const sessions: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verify',
    component: VerifyUserComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
];

const routes: Routes = [
  {
    path: '',
    component: SessionsComponent,
    canActivate: [SessionsGuard],
    children: [...sessions],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsRoutingModule {}
