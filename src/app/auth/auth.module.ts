import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth/auth.service';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { OtpService } from './services/auth/otp.service';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent],
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
  providers: [AuthService, OtpService],
  exports: []
})
export class AuthModule { }
