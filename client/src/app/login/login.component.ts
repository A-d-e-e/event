import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { HttpService } from '../../services/http.service';

import { AuthService } from '../../services/auth.service';
 
@Component({

  selector: 'app-login',

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.scss']

})

export class LoginComponent implements OnInit {

  itemForm: FormGroup;

  showMessage: boolean = false;

  showError: boolean = false;

  responseMessage: string = '';

  usernamePattern = '^[a-z]+$';

  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$';

  // Captcha properties

  captchaNum1: number = 0;

  captchaNum2: number = 0;

  captchaAnswer: number = 0;

  captchaVerified: boolean = false;

  showCaptchaError: boolean = false;
 
  constructor(

    private router: Router,

    private httpService: HttpService,

    private formBuilder: FormBuilder,

    private authService: AuthService

  ) {

    this.itemForm = this.formBuilder.group({

      username: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],

      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],

      captchaInput: ['', [Validators.required]]

    });

  }
 
  ngOnInit(): void {

    this.generateCaptcha();

  }
 
  generateCaptcha(): void {

    this.captchaNum1 = Math.floor(Math.random() * 10) + 1;

    this.captchaNum2 = Math.floor(Math.random() * 10) + 1;

    this.captchaAnswer = this.captchaNum1 + this.captchaNum2;

    this.captchaVerified = false;

    this.showCaptchaError = false;

    this.itemForm.patchValue({ captchaInput: '' });

  }
 
  verifyCaptcha(): void {

    const userAnswer = parseInt(this.itemForm.get('captchaInput')?.value);

    if (userAnswer === this.captchaAnswer) {

      this.captchaVerified = true;

      this.showCaptchaError = false;

      this.showMessage = true;

      this.showError = false;

      this.responseMessage = 'Captcha verified!';

      // Clear the message after 2 seconds

      setTimeout(() => {

        if (this.captchaVerified && !this.showError) {

          this.showMessage = false;

          this.responseMessage = '';

        }

      }, 2000);

    } else {

      this.captchaVerified = false;

      this.showCaptchaError = true;

      this.showMessage = true;

      this.showError = true;

      this.responseMessage = 'Incorrect captcha answer. Please try again.';

      this.generateCaptcha();

    }

  }
 
  onLogin(): void {

    if (!this.captchaVerified) {

      this.showMessage = true;

      this.showError = true;

      this.responseMessage = 'Please verify the captcha first.';

      return;

    }
 
    if (this.itemForm.valid) {

      this.showMessage = false;

      this.showError = false;

      this.responseMessage = '';

      this.httpService.Login(this.itemForm.value).subscribe(

        (data: any) => {

          this.showMessage = true;

          this.responseMessage = 'Login successful! Redirecting to dashboard...';

          setTimeout(() => {

            this.authService.setRole(data.role);

            this.authService.saveToken(data.token);

            localStorage.setItem('token', data.token);

            this.router.navigateByUrl('dashboard').then(() => {

              window.location.reload();

            });

          }, 2000);

        },

        error => {

          this.showMessage = true;

          this.showError = true;

          if (error.status === 401) {

            this.responseMessage = 'Incorrect username or password. Please try again.';

          } else {

            this.responseMessage = 'An error occurred during login. Please try again later.';

          }

          // Reset captcha on login error

          this.generateCaptcha();

          this.captchaVerified = false;

        }

      );

    } else {

      this.showMessage = true;

      this.showError = true;

      this.responseMessage = 'Please fill in all required fields correctly.';

      this.itemForm.markAllAsTouched();

    }

  }

}
 