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
  
  // For displaying selected resource price
  selectedResourcePrice: number = 0;
  calculatedTotal: number = 0;

  constructor(
    public router: Router,
    public httpService: HttpService,
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
    this.getEvent();
    this.getResources();
    
    // Watch for resource selection changes to update price
    this.itemForm.get('resourceId')?.valueChanges.subscribe(resourceId => {
      this.updateSelectedResourcePrice(resourceId);
    });
    
    // Watch for quantity changes to update total
    this.itemForm.get('quantity')?.valueChanges.subscribe(quantity => {
      this.calculateTotal(quantity);
    });
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const eventId = this.itemForm.value.eventId;
      const resourceId = this.itemForm.value.resourceId;
      const payload = {
        quantity: this.itemForm.value.quantity
      };

      this.httpService.allocateResources(eventId, resourceId, payload).subscribe(
        (data) => {
          this.showMessage = true;
          this.responseMessage = 'Resource allocated successfully!';
          this.itemForm.reset();
          this.selectedResourcePrice = 0;
          this.calculatedTotal = 0;
          console.log('Success:', this.responseMessage);
          this.autoCloseAlert();
        },
        (error) => {
          this.showError = true;
          this.errorMessage = 'Failed to allocate resource';
          console.error('Error:', error);
          this.autoCloseAlert();
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  getEvent() {
    this.httpService.GetAllevents().subscribe(
      (data) => {
        this.eventList = data || [];
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to load events';
        console.error('Error loading events:', error);
      }
    );
  }

  getResources() {
    this.httpService.GetAllResources().subscribe(
      (data) => {
        this.resourceList = data || [];
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to load resources';
        console.error('Error loading resources:', error);
      }
    );
  }

  // Update selected resource price
  updateSelectedResourcePrice(resourceId: string) {
    const selectedResource = this.resourceList.find(r => r.resourceID == resourceId);
    if (selectedResource) {
      this.selectedResourcePrice = selectedResource.price || 0;
      this.calculateTotal(this.itemForm.get('quantity')?.value || 0);
    } else {
      this.selectedResourcePrice = 0;
      this.calculatedTotal = 0;
    }
  }

  // Calculate total price
  calculateTotal(quantity: number) {
    if (quantity && quantity > 0) {
      this.calculatedTotal = this.selectedResourcePrice * quantity;
    } else {
      this.calculatedTotal = 0;
    }
  }

  // Get resource details by ID
  getResourceById(resourceId: number) {
    return this.resourceList.find(r => r.resourceID === resourceId);
  }

  private autoCloseAlert(): void {
    setTimeout(() => {
      this.showMessage = false;
      this.showError = false;
      this.responseMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}