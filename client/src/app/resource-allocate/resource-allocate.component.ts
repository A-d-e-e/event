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
  showError: boolean = false;
  errorMessage: string = '';
  resourceList: any[] = [];
  showMessage: boolean = false;
  responseMessage: string = '';
  eventList: any[] = [];
  paginatedResources: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  isSuccess: boolean = false;
  showPopup: boolean = false;
  selectedResourceUnavailable: boolean = false;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
      eventId: ['', Validators.required],
      resourceId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getResources();
    this.getEvent();
  }



  getResources() {
    this.httpService.getAllResources().subscribe(
      (data: any) => {
        this.resourceList = data;
        this.totalPages = Math.ceil(this.resourceList.length / this.itemsPerPage);
        this.setPaginatedResources();
      },
      (error: any) => {
        this.showErrorMessage(error.message || 'Failed to load resources');
      }
    );
  }

  setPaginatedResources() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResources = this.resourceList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPaginatedResources();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPaginatedResources();
    }
  }

  getEvent() {
    this.httpService.getAllEvents().subscribe(
      (data: any) => {
        this.eventList = data;
      },
      (error: any) => {
        this.showErrorMessage(error.message || 'Failed to load events');
      }
    );
  }

  showSuccessMessage(message: string) {
    this.responseMessage = message;
    this.isSuccess = true;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000); 
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    this.isSuccess = false;
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 3000); 
  }

  onResourceSelect(event: any) {
    const resourceId = event.target.value;
    const selectedResource = this.resourceList.find(r => r.resourceID == resourceId);
    this.selectedResourceUnavailable = selectedResource ? !selectedResource.availability : false;
  }

  onSubmit() {
    if (this.selectedResourceUnavailable) {
      this.showErrorMessage('Cannot allocate an unavailable resource. Please select an available resource.');
      return;
    }

    if (this.itemForm.valid) {
      this.httpService.allocateResources(this.itemForm.value.eventId, this.itemForm.value.resourceId, this.itemForm.value).subscribe(
        (data: any) => {
          this.showSuccessMessage(data.message);
          this.itemForm.reset();
          this.selectedResourceUnavailable = false;

          this.getResources();
        },
        (error: any) => {
          if (error.status === 409) {
            this.showErrorMessage(error.error.message);
          } else {
            this.showErrorMessage('An error occurred');
          }
        }
      );
    } else {
      
      this.markFormGroupTouched(this.itemForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}