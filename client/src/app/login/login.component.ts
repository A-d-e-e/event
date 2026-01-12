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
export class LoginComponent implements OnInit
{
  
itemForm: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // No specific actions per spec
  }

  /**
   * Handles the login process:
   * - If valid, calls backend
   * - Stores token and role via AuthService
   * - Redirects to dashboard and reloads
   * - Shows error on failure
   */
  onLogin(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const payload = this.itemForm.value;

    this.httpService.login(payload).subscribe({
      next: (res) => {
        // Expecting { token, username, email, role }
        if (res?.token) {
          this.authService.saveToken(res.token);
          this.authService.SetRole(res.role);
          this.router.navigate(['/dashboard']);
          setTimeout(() => window.location.reload(), 300);
        } else {
          this.showError = true;
          this.errorMessage = 'Invalid login response.';
        }
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = 'Invalid username or password.';
        console.error(err);
      }
    });
  }

  /**
   * Navigates to registration page
   */
  registration(): void {
    this.router.navigate(['/registration']);
  }

}
