import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsGuard } from '@guards/sessions.guard';
import { SessionsComponent } from './sessions.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ActionComponent } from './action/action.component';

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
    canActivate: [SessionsGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [SessionsGuard],
  },
  {
    path: 'action',
    component: ActionComponent,
    canActivate: [SessionsGuard],
  }
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
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
