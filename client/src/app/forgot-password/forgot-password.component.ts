import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { NotificationService } from '../../services/notification.service';
import { OtpService } from '../../services/OtpService';
 
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  currentStep: number = 1;
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  resendTimer: number = 0;
  private resendInterval: any;
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private notificationService: NotificationService,
    private router: Router,
    private otpService: OtpService
  ) {}
 
  ngOnInit(): void {
    this.initForms();
  }
 
  initForms(): void {
    // Email form
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
 
    // OTP form
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
 
    // Password form with custom validator
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
 
  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
 
    if (!password || !confirmPassword) {
      return null;
    }
 
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }
 
  // Step 1: Send OTP
  sendOTP(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
 
    this.isLoading = true;
    const email = this.emailForm.get('email')?.value;
 
    // First check if email exists in database
    this.otpService.checkEmailExists(email).subscribe(
      (response: any) => {
        if (response.exists) {
          // Email exists, send OTP
          this.otpService.sendOtp(email).subscribe(
            (response: any) => {
              this.isLoading = false;
              this.notificationService.success('Verification code sent to your email!');
              this.currentStep = 2;
              this.startResendTimer();
            },
            (error: any) => {
              this.isLoading = false;
              this.notificationService.error('Failed to send verification code. Please try again.');
              console.error('OTP send error:', error);
            }
          );
        } else {
          this.isLoading = false;
          this.notificationService.error('Email not found. Please check and try again.');
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.notificationService.error('Unable to verify email. Please try again.');
        console.error('Email check error:', error);
      }
    );
  }
 
  // Step 2: Verify OTP
  verifyOTP(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
 
    this.isLoading = true;
    const email = this.emailForm.get('email')?.value;
    const otp = this.otpForm.get('otp')?.value;
 
    this.otpService.verifyOtp(email, otp).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.notificationService.success('Verification successful!');
        this.currentStep = 3;
        this.clearResendTimer();
      },
      (error: any) => {
        this.isLoading = false;
        this.notificationService.error('Invalid or expired code. Please try again.');
        console.error('OTP verification error:', error);
      }
    );
  }
 
  // Step 3: Reset Password
  resetPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
 
    this.isLoading = true;
    const email = this.emailForm.get('email')?.value;
    const newPassword = this.passwordForm.get('password')?.value;
 
    this.otpService.resetPassword(email, newPassword).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.currentStep = 4;
        this.notificationService.success('Password reset successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error: any) => {
        this.isLoading = false;
        this.notificationService.error('Failed to reset password. Please try again.');
        console.error('Password reset error:', error);
      }
    );
  }
 
  // Resend OTP
  resendOTP(): void {
    if (this.resendTimer > 0) return;
 
    const email = this.emailForm.get('email')?.value;
    this.otpService.sendOtp(email).subscribe(
      (response: any) => {
        this.notificationService.success('New verification code sent!');
        this.startResendTimer();
      },
      (error: any) => {
        this.notificationService.error('Failed to resend code. Please try again.');
        console.error('Resend OTP error:', error);
      }
    );
  }
 
  // Resend timer management
  startResendTimer(): void {
    this.resendTimer = 60; // 60 seconds
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.clearResendTimer();
      }
    }, 1000);
  }
 
  clearResendTimer(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendTimer = 0;
    }
  }
 
  // Password strength checker
  getPasswordStrength(): string {
    const password = this.passwordForm.get('password')?.value;
    if (!password) return '';
 
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
 
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }
 
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    return strength.charAt(0).toUpperCase() + strength.slice(1);
  }
 
  // Password requirement checkers
  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.passwordForm.get('password')?.value || '');
  }
 
  hasLowerCase(): boolean {
    return /[a-z]/.test(this.passwordForm.get('password')?.value || '');
  }
 
  hasNumber(): boolean {
    return /[0-9]/.test(this.passwordForm.get('password')?.value || '');
  }
 
  ngOnDestroy(): void {
    this.clearResendTimer();
  }
}