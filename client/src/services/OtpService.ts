import { HttpClient } from '@angular/common/http';
 
import { Injectable } from '@angular/core';
 
import { environment } from '../environments/environment';

@Injectable({
 
  providedIn: 'root'
 
})
 
export class OtpService {

  private baseUrl = environment.apiUrl + '/api/otp';

  constructor(private http: HttpClient) {}

  sendOtp(email: string) {
 
    return this.http.post(
 
      `${this.baseUrl}/send?email=${email}`,
 
      {}
 
    );
 
  }

  // Check email exists
  checkEmailExists(email: string) {
    return this.http.get(`${this.baseUrl}/api/user/check-email?email=${email}`);
  }
  
  // Reset password
  resetPassword(email: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/api/user/reset-password`, { email, newPassword });
  }

  verifyOtp(email: string, otp: string) {
 
    return this.http.post(
 
      `${this.baseUrl}/verify?email=${email}&otp=${otp}`,
 
      {}
 
    );
 
  }
 
}
 
 