import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit
//todo: complete missing code..
{
  
itemForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  resourceList: any[] = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      availability: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    // As requested, call getResource() in ngOnInit (implemented as getResources)
    this.getResources();
  }

  /**
   * Fetches the list of all available resources from the server.
   * Calls httpService.getAllResources() and stores in resourceList.
   * Displays an error if request fails.
   */
  getResources(): void {
    this.httpService.getAllResources().subscribe({
      next: (res) => {
        this.resourceList = res || [];
        this.showError = false;
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch resources.';
        console.error(err);
      }
    });
  }

  /**
   * Handles form submission to add a new resource.
   * If valid, submits via httpService.addResource() and resets form.
   * Refreshes list by calling getResources().
   * Displays an error message on failure.
   */
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
    const payload = this.itemForm.value;

    this.httpService.addResource(payload).subscribe({
      next: (res) => {
        this.showMessage = true;
        this.responseMessage = 'Resource added successfully';
        this.itemForm.reset({ availability: true });
        this.getResources();
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = 'Failed to add resource.';
        console.error(err);
      }
    });
  }

}