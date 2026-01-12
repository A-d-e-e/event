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
  itemForm!: FormGroup;
  showMessage: boolean = false;
  showError: boolean = false;
  responseMessage: string = '';
  showPassword: boolean = false; 
  

  usernamePattern = '^[a-z]{3,}$';
  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,27}$';

  usernameRules = [
    { key: "required", label: "Username required", satisfied: false },
    { key: "minLength", label: "Username should be at least 3 characters", satisfied: false},
    { key: "lowerCase", label: "Username can only lowercase characters", satisfied: false}
  ]

  passwordRules = [
    { key: "required", label: "Password required", satisfied: false },
    { key: "capital", label: "Password should have a capital letter", satisfied: false },
    { key: "special", label: "Password should have a special character", satisfied: false },
    { key: "number", label: "Password should have a number", satisfied: false },
    { key: "minLength", label: "Password should be of 8 characters at least", satisfied: false }
  ]

  constructor(
    private router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]]
    });

    this.itemForm.get('username')?.valueChanges.subscribe(value => {
      this.checkUsernameRules(value || '')
    })

    this.itemForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordRules(value || '')
    })
  }

  checkUsernameRules(username: string){
    this.usernameRules[0].satisfied = username.length > 0
    this.usernameRules[1].satisfied = username.length >= 3
    this.usernameRules[2].satisfied = /^[a-z]+$/.test(username)
  }

  checkPasswordRules(password: string){
    this.passwordRules[0].satisfied = password.length > 0
    this.passwordRules[1].satisfied = /[A-Z]/.test(password)
    this.passwordRules[2].satisfied = /[@#$%^&+=]/.test(password)
    this.passwordRules[3].satisfied = /[0-9]/.test(password)
    this.passwordRules[4].satisfied = password.length >= 8
  }

  get showUsernameRequirements(): boolean {
    return this.usernameRules?.some( rule => !rule.satisfied)
  }

  get showPasswordRequirements(): boolean {
    return this.passwordRules?.some(rule => !rule.satisfied)
  }

  onLogin() {
    if (this.itemForm.valid) {
      this.showMessage = false;
      this.showError = false;
      this.responseMessage = '';

      this.httpService.login(this.itemForm.value).subscribe(
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
          }, 1000); 
        },
        error => {
          this.showMessage = true;
          this.showError = true;
          if (error.status === 401) {
            this.responseMessage = 'Incorrect username or password. Please try again.';
          } else {
            this.responseMessage = 'An error occurred during login. Please try again later.';
          }
        }
      );
    } else {
      this.showMessage = true;
      this.showError = true;
      this.responseMessage = 'Please fill in all required fields correctly.';
      this.itemForm.markAllAsTouched();
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}