

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../environments/environment.development';

// @Injectable({
//   providedIn: 'root'
// })
// export class OtpService {
//   private serverName = environment.apiUrl;

//   constructor(private http: HttpClient) {}

//   // Check if email exists (PUBLIC endpoint - no auth needed)
//   checkEmailExists(email: string): Observable<any> {
//     const url = `${this.serverName}/api/user/check-email?email=${email}`;
//     const headers = new HttpHeaders({ 
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     });
//     console.log('Checking email:', url);
//     return this.http.get(url, { headers });
//   }

//   // Send OTP (PUBLIC endpoint)
//   sendOtp(email: string): Observable<any> {
//     const url = `${this.serverName}/api/otp/send?email=${encodeURIComponent(email)}`;
//     const headers = new HttpHeaders({ 
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     });
//     console.log('Sending OTP to:', url);
//     return this.http.post(url, {}, { headers });
//   }

//   // Verify OTP (PUBLIC endpoint)
//   verifyOtp(email: string, otp: string): Observable<any> {
//     const url = `${this.serverName}/api/otp/verify?email=${encodeURIComponent(email)}&otp=${otp}`;
//     const headers = new HttpHeaders({ 
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     });
//     console.log('Verifying OTP:', url);
//     return this.http.post(url, {}, { headers });
//   }

//   // // Reset Password (PUBLIC endpoint)
//   // resetPassword(email: string, newPassword: string): Observable<any> {
//   //   const url = `${this.serverName}/api/user/reset-password`;
//   //   const headers = new HttpHeaders({ 
//   //     'Content-Type': 'application/json',
//   //     'Accept': 'application/json'
//   //   });
//   //   const payload = { email, newPassword };
//   //   console.log('Resetting password for:', email);
//   //   return this.http.post(url, payload, { headers });
//   // }
//   resetPasswordWithToken(email: string, otp: string, newPassword: string): Observable<any> {
//     const url = `${this.serverName}/api/user/reset-password-with-otp`;
//     const headers = new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     });
    
//     // ✅ Ensure payload structure matches backend expectation:
//     const payload = {
//         email: email,
//         otp: otp,
//         newPassword: newPassword
//     };
    
//     console.log('Resetting password with OTP verification');
//     return this.http.post(url, payload, { headers });
// }
  
//   // Reset Password (PUBLIC endpoint)
// // resetPassword(email: string, newPassword: string): Observable<any> {
// //   const url = `${this.serverName}/api/user/reset-password`;
// //   const headers = new HttpHeaders({ 
// //     'Content-Type': 'application/json',
// //     'Accept': 'application/json'
// //   });
  
// //   // Try different payload formats that backend might expect
// //   const payload = {
// //     email: email,
// //     newPassword: newPassword,
// //     password: newPassword  // Some backends use 'password' instead
// //   };
  
// //   console.log('Resetting password for:', email);
// //   console.log('Reset password URL:', url);
// //   console.log('Payload:', payload);
  
// //   return this.http.post(url, payload, { headers });
// // }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private serverName = environment.apiUrl;

  constructor(private http: HttpClient) { }

  sendOtp(email: string): Observable<any> {
    const url = `${this.serverName}/api/otp/send`;
    const params = new HttpParams().set('email', email);
    return this.http.post(url, null, { params });
  }

  // ✅ Now returns resetToken
  verifyOtp(email: string, otp: string): Observable<any> {
    const url = `${this.serverName}/api/otp/verify`;
    const params = new HttpParams()
      .set('email', email)
      .set('otp', otp);
    
    return this.http.post(url, null, { params });
  }

  // ✅ Use resetToken instead of OTP
  resetPasswordWithToken(email: string, resetToken: string, newPassword: string): Observable<any> {
    const url = `${this.serverName}/api/user/reset-password-with-otp`;
    
    const payload = {
      email: email,
      resetToken: resetToken,  // ✅ Changed from 'otp'
      newPassword: newPassword
    };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    console.log('🔹 Sending password reset request');
    console.log('🔹 Email:', email);
    console.log('🔹 Reset Token:', resetToken);
    
    return this.http.post(url, payload, { headers });
  }
}
