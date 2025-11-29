import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  private API_URL = environment.api.EMAIL_URL;

  constructor(private http: HttpClient) {}

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}api/otp/send`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.API_URL}api/otp/verify`, { email, otp });
  }
}