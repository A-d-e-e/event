import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  itemForm: FormGroup;
  formModel: any = { role: null, email: '', password: '', username: '' };
  showMessage: boolean = false;
  responseMessage: any;

  constructor(
    public router: Router,
    public bookService: HttpService,
    private formBuilder: FormBuilder
  ) {
    this.itemForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required], // PLANNER | STAFF | CLIENT
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // No specific actions per spec
  }

  /**
   * Handles registration:
   * - Validates form
   * - Sends data via HttpService
   * - Shows success message and resets form
   * - Marks controls touched if invalid
   */
  onRegister(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const payload = this.itemForm.value;

    this.bookService.registerUser(payload).subscribe({
      next: (res) => {
        this.showMessage = true;
        this.responseMessage = 'Registered successfully';
        this.itemForm.reset();
      },
      error: (err) => {
        this.showMessage = true;
        this.responseMessage = 'Registration failed';
        console.error(err);
      }
    });
  }

}
