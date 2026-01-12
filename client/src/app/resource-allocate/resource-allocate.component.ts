import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls: ['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent implements OnInit {

  itemForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  resourceList: any[] = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  eventList: any[] = [];

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      eventId: [null, Validators.required],
      resourceId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getResources();
    this.getEvent();
  }

  /**
   * Handles resource allocation:
   * - Validates form
   * - Calls backend
   * - Resets form and shows message on success
   * - Shows error on failure
   */
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const { eventId, resourceId, quantity } = this.itemForm.value;
    const allocationBody = { quantity };

    this.httpService.allocateResources(eventId, resourceId, allocationBody).subscribe({
      next: (res) => {
        this.showMessage = true;
        this.responseMessage = 'Resource allocated successfully';
        this.itemForm.reset({ quantity: 1 });
        console.log(this.responseMessage);
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = 'Failed to allocate resource.';
        console.error(err);
      }
    });
  }

  /**
   * Fetch events
   */
  getEvent(): void {
    this.httpService.getAllEvents().subscribe({
      next: (res) => {
        this.eventList = res || [];
      },
      error: (err) => {
        console.error('Failed to fetch events', err);
      }
    });
  }

  /**
   * Fetch resources
   */
  getResources(): void {
    this.httpService.getAllResources().subscribe({
      next: (res) => {
        this.resourceList = res || [];
      },
      error: (err) => {
        console.error('Failed to fetch resources', err);
      }
    });
  }


}