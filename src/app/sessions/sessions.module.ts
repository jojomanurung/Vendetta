import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './sessions.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoadingComponent } from '@components/loading/loading.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

const Material = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    SessionsComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyUserComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...Material,
    LoadingComponent,
  ],
})
export class SessionsModule {}
