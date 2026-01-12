import { Component, OnInit } from '@angular/core';
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
  myBookings: any[] = [];
  displayedBookings: any[] = [];
  message: { type: 'success' | 'error', text: string } | null = null;
  searchPerformed: boolean = false;
  loadingBookings: boolean = false;
 
  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      searchTerm: ['']
    });
  }
 
  ngOnInit(): void {
    // this.loadMyBookings();
  }

  // loadMyBookings(): void {
  //   this.loadingBookings = true;
  //   this.httpService.getMyBookings().subscribe(
  //     (bookings: any) => {
  //       this.myBookings = bookings;
  //       this.displayedBookings = bookings;
  //       this.loadingBookings = false;
  //     },
  //     (error: any) => {
  //       console.error('Error loading bookings:', error);
  //       this.showTemporaryMessage('error', 'Failed to load your bookings');
  //       this.loadingBookings = false;
  //     }
  //   );
  // }
 
  searchBookings(): void {
    const searchTerm = this.itemForm.get('searchTerm')?.value?.toLowerCase().trim();
    
    if (!searchTerm) {
      this.displayedBookings = this.myBookings;
      this.searchPerformed = false;
      return;
    }
    
    this.searchPerformed = true;
    this.displayedBookings = this.myBookings.filter(booking => {
      const eventTitle = booking.event?.title?.toLowerCase() || '';
      const bookingId = booking.bookingId?.toString() || '';
      const eventLocation = booking.event?.location?.toLowerCase() || '';
      
      return eventTitle.includes(searchTerm) || 
             bookingId.includes(searchTerm) ||
             eventLocation.includes(searchTerm);
    });
    
    if (this.displayedBookings.length > 0) {
      this.showTemporaryMessage('success', `Found ${this.displayedBookings.length} booking(s)`);
    } else {
      this.showTemporaryMessage('error', 'No bookings match your search');
    }
  }
  
  clearSearch(): void {
    this.itemForm.reset();
    this.displayedBookings = this.myBookings;
    this.searchPerformed = false;
    this.message = null;
  }
 
  getBookingStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'APPROVED':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
 
  private showTemporaryMessage(type: 'success' | 'error', text: string): void {
    this.message = { type, text };
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
}