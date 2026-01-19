import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
 
  itemForm: FormGroup;
  eventObj: any[] = [];
  message: { type: 'success' | 'error', text: string } | null = null;
  searchPerformed: boolean = false;
 
  tooltipVisible: boolean = false;
  tooltipContent: any[] = [];
  tooltipX: number = 0;
  tooltipY: number = 0;
 
  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      searchTerm: ['', Validators.required]
    });
  }
 
  ngOnInit(): void {}
 
  searchEvent(): void {
    if (this.itemForm.valid) {
      const searchTerm = this.itemForm.get('searchTerm')?.value;
      if (isNaN(searchTerm)) {
        // If searchTerm is a string, search by title
        this.httpService.GetEventdetailsbyTitleforClient(searchTerm).subscribe(
          response => this.handleSearchResponse(response),
          error => this.handleSearchError(error)
        );
      } else {
        // If searchTerm is a number, search by ID
        this.httpService.getBookingDetails(searchTerm).subscribe(
          response => this.handleSearchResponse(response),
          error => this.handleSearchError(error)
        );
      }
    } else {
      this.itemForm.get('searchTerm')?.markAsTouched();
    }
  }

  // Calculate total price for an event
  calculateTotalPrice(allocations: any[]): number {
    if (!allocations || allocations.length === 0) return 0;
    return allocations.reduce((total, allocation) => {
      const price = allocation.resource?.price || 0;
      const quantity = allocation.quantity || 0;
      return total + (price * quantity);
    }, 0);
  }

  // Calculate total price for a single allocation
  calculateAllocationPrice(allocation: any): number {
    const price = allocation.resource?.price || 0;
    const quantity = allocation.quantity || 0;
    return price * quantity;
  }
 
  showTooltip(event: MouseEvent, allocations: any[]): void {
    this.tooltipContent = allocations;
    this.tooltipX = event.clientX + 100;
    this.tooltipY = event.clientY + 10;
    this.tooltipVisible = true;
  }
 
  hideTooltip(): void {
    this.tooltipVisible = false;
  }
 
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.tooltipVisible) {
      this.tooltipX = event.clientX + 10;
      this.tooltipY = event.clientY + 10;
    }
  }
 
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
      case 'upcoming':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      case 'pending':
      case 'ongoing':
        return 'badge-warning';
      case 'completed':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }
 
  private handleSearchResponse(response: any): void {
    this.searchPerformed = true;
    if (response && Object.keys(response).length !== 0) {
      this.eventObj = [response];
      this.showTemporaryMessage('success', 'Event found');
    } else {
      this.eventObj = [];
      this.showTemporaryMessage('error', 'No event found');
    }
  }
 
  private handleSearchError(error: any): void {
    this.searchPerformed = true;
    this.showTemporaryMessage('error', 'Failed to find event');
    this.eventObj = [];
    console.error('Error searching event:', error);
  }
 
  private showTemporaryMessage(type: 'success' | 'error', text: string): void {
    this.message = { type, text };
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
}