import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpService } from '../../services/OtpService';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;
  
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  resendTimer: number = 0;
  private resendInterval: any;
  
  private resetToken: string = ''; //  Store reset token instead

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  sendOTP(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      this.notificationService.warning('Please enter a valid email address');
      return;
    }

    this.isLoading = true;
    const email = this.emailForm.get('email')?.value;

    this.otpService.sendOtp(email).subscribe({
      next: (response: any) => {
        console.log('✅ OTP sent successfully');
        this.isLoading = false;
        this.notificationService.success('Verification code sent to your email!');
        this.currentStep = 2;
        this.startResendTimer();
      },
      error: (error: any) => {
        console.error('❌ OTP send error', error);
        this.isLoading = false;
        this.notificationService.error('Failed to send verification code');
      }
    });
  }

  // ✅ UPDATED: Store reset token
  verifyOTP(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      this.notificationService.warning('Please enter a valid 6-digit code');
      return;
    }

    this.isLoading = true;
    const email = this.emailForm.get('email')?.value;
    const otp = this.otpForm.get('otp')?.value;

    this.otpService.verifyOtp(email, otp).subscribe({
      next: (response: any) => {
        console.log('✅ OTP verified successfully');
        this.isLoading = false;
        
        // ✅ STORE THE RESET TOKEN FROM RESPONSE
        this.resetToken = response.resetToken;
        console.log('🔑 Reset token received:', this.resetToken);
        
        this.notificationService.success('Verification successful!');
        this.currentStep = 3;
        this.clearResendTimer();
      },
      error: (error: any) => {
        console.error('❌ OTP verification error', error);
        this.isLoading = false;
        this.notificationService.error('Invalid or expired code');
      }
    });
  }

  // ✅ UPDATED: Use reset token
  resetPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.notificationService.warning('Please fill all required fields correctly');
      return;
    }

    this.isLoading = true;
    const email = this.emailForm.get('email')?.value;
    const newPassword = this.passwordForm.get('password')?.value;

    console.log('🔄 Resetting password for:', email);
    console.log('🔑 Using reset token:', this.resetToken);

    // ✅ USE RESET TOKEN INSTEAD OF OTP
    this.otpService.resetPasswordWithToken(email, this.resetToken, newPassword).subscribe({
      next: (response: any) => {
        console.log('✅ Password reset successful');
        this.isLoading = false;
        this.currentStep = 4;
        this.notificationService.success('Password reset successfully!');
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: any) => {
        console.error('❌ Password reset error', error);
        this.isLoading = false;
        
        let errorMessage = 'Failed to reset password';
        if (error.status === 400) {
          errorMessage = 'Session expired. Please start again.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.notificationService.error(errorMessage);
      }
    });
  }

  resendOTP(): void {
    if (this.resendTimer > 0) return;

    const email = this.emailForm.get('email')?.value;
    this.otpService.sendOtp(email).subscribe({
      next: () => {
        this.notificationService.success('New verification code sent!');
        this.startResendTimer();
      },
      error: () => {
        this.notificationService.error('Failed to resend code');
      }
    });
  }

  startResendTimer(): void {
    this.resendTimer = 60;
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
    }
    this.resendTimer = 0;
  }

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

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.passwordForm.get('password')?.value);
  }

  get hasLowerCase(): boolean {
    return /[a-z]/.test(this.passwordForm.get('password')?.value);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.passwordForm.get('password')?.value);
  }

  ngOnDestroy(): void {
    this.clearResendTimer();
  }
}
