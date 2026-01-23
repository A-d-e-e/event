import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  itemForm!: FormGroup;
  showMessage = false;
  showError = false;
  responseMessage = '';
  errorMessage = '';
  
  allEvents: any[] = [];  // ✅ Store ALL events here
  events: any[] = [];     // ✅ Filtered events for display
  paginatedEvents: any[] = [];
  searchQuery = '';
  
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  minDate = '';
 
  isUpdateMode: boolean = false;
  selectedEventId: number | null = null;
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService
  ) {}
 
  ngOnInit(): void {
    this.initForm();
    this.setMinDate();
    this.loadAllEvents();
  }
 
  private initForm(): void {
    this.itemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dateTime: ['', Validators.required],
      location: ['', Validators.required],
      status: ['', Validators.required]
    });
  }
 
  private setMinDate(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    this.minDate = tomorrow.toISOString().slice(0, 16);
  }
 
  loadAllEvents(): void {
    console.log('📥 Loading all events...');
    this.httpService.GetAllevents().subscribe({
      next: (data) => {
        console.log('✅ Received events:', data);
        
        // Store all events
        this.allEvents = Array.isArray(data) ? data : [];
        // Display all events initially
        this.events = [...this.allEvents];
        
        console.log(`📊 Total events loaded: ${this.allEvents.length}`);
        this.updatePagination();
      },
      error: (error) => {
        console.error('❌ Error loading events:', error);
        this.showError = true;
        this.errorMessage = 'Failed to load events';
        this.allEvents = [];
        this.events = [];
        this.updatePagination();
        this.autoCloseAlert();
      }
    });
  }
 
  // ✅ CLIENT-SIDE SEARCH (No API calls needed!)
  onSearch(): void {
    const query = this.searchQuery.trim();
    
    console.log('🔍 Search triggered with query:', query);
    
    // If search is empty, show all events
    if (!query) {
      console.log('📋 Empty search - showing all events');
      this.events = [...this.allEvents];
      this.currentPage = 1;
      this.updatePagination();
      return;
    }
 
    // Check if it's a number (Event ID search)
    const numericQuery = Number(query);
    if (!isNaN(numericQuery) && query === numericQuery.toString()) {
      console.log('🔢 Searching by Event ID:', numericQuery);
      this.searchById(numericQuery);
    } else {
      console.log('🔤 Searching by Title:', query);
      this.searchByTitle(query);
    }
  }
 
  // ✅ CLIENT-SIDE ID SEARCH
  private searchById(eventId: number): void {
    console.log(`🎯 Filtering events by ID: ${eventId}`);
    
    // Filter from allEvents array
    const foundEvents = this.allEvents.filter(event => 
      event.eventID === eventId || event.id === eventId
    );
    
    if (foundEvents.length > 0) {
      console.log('✅ Event found:', foundEvents[0]);
      this.events = foundEvents;
      this.showTemporaryMessage('success', `Event found: ${foundEvents[0].title || 'Untitled'}`);
    } else {
      console.log('❌ No event found with ID:', eventId);
      this.events = [];
      this.showTemporaryMessage('error', `No event found with ID: ${eventId}`);
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }
 
  // ✅ CLIENT-SIDE TITLE SEARCH
  private searchByTitle(title: string): void {
    console.log(`🎯 Filtering events by title containing: "${title}"`);
    
    const lowerQuery = title.toLowerCase();
    
    // Filter from allEvents array
    const foundEvents = this.allEvents.filter(event => {
      const eventTitle = (event.title || '').toLowerCase();
      const eventDescription = (event.description || '').toLowerCase();
      
      // Search in both title and description
      return eventTitle.includes(lowerQuery) || eventDescription.includes(lowerQuery);
    });
    
    console.log(`✅ Found ${foundEvents.length} matching events`);
    
    this.events = foundEvents;
    
    if (foundEvents.length === 0) {
      this.showTemporaryMessage('error', `No events found matching "${title}"`);
    } else if (foundEvents.length === 1) {
      this.showTemporaryMessage('success', `Found 1 event matching "${title}"`);
    } else {
      this.showTemporaryMessage('success', `Found ${foundEvents.length} events matching "${title}"`);
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }
 
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.events.length / this.itemsPerPage) || 1;
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedEvents = this.events.slice(start, start + this.itemsPerPage);
    
    console.log(`📄 Pagination: Page ${this.currentPage}/${this.totalPages}, Showing ${this.paginatedEvents.length} events`);
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
 
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
 
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
 
    const formValue = this.itemForm.value;
    const selectedDate = new Date(formValue.dateTime);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (selectedDate < tomorrow) {
      this.showError = true;
      this.errorMessage = 'Event must be scheduled for tomorrow or later';
      this.autoCloseAlert();
      return;
    }
 
    const payload = {
      ...formValue,
      dateTime: selectedDate.toISOString()
    };
 
    if (this.isUpdateMode && this.selectedEventId) {
      this.httpService.updateEventByPlanner(this.selectedEventId, payload).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Event updated successfully';
          this.resetForm();
          this.loadAllEvents();
          this.autoCloseAlert();
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to update event';
          this.autoCloseAlert();
        }
      });
    } else {
      this.httpService.createEvent(payload).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Event created successfully';
          this.itemForm.reset();
          this.loadAllEvents();
          this.autoCloseAlert();
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to create event';
          this.autoCloseAlert();
        }
      });
    }
  }
 
  editEvent(event: any): void {
    this.isUpdateMode = true;
    this.selectedEventId = event.eventID;
    
    const eventDate = new Date(event.dateTime);
    const formattedDate = eventDate.toISOString().slice(0, 16);
    
    this.itemForm.patchValue({
      title: event.title,
      description: event.description,
      dateTime: formattedDate,
      location: event.location,
      status: event.status
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  cancelUpdate(): void {
    this.resetForm();
  }
 
  private resetForm(): void {
    this.isUpdateMode = false;
    this.selectedEventId = null;
    this.itemForm.reset();
  }
 
  deleteEvent(eventId: number): void {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
 
    this.httpService.deleteEventDetailsByID(eventId).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Event deleted successfully';
        this.loadAllEvents();
        this.autoCloseAlert();
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to delete event';
        this.autoCloseAlert();
      }
    });
  }
 
  closeAlert(): void {
    this.showMessage = false;
    this.showError = false;
    this.responseMessage = '';
    this.errorMessage = '';
  }
 
  private autoCloseAlert(): void {
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }
 
  private showTemporaryMessage(type: 'success' | 'error', message: string): void {
    if (type === 'success') {
      this.showMessage = true;
      this.responseMessage = message;
    } else {
      this.showError = true;
      this.errorMessage = message;
    }
    this.autoCloseAlert();
  }
}
 


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpService } from '../../services/http.service';
 
// @Component({
//   selector: 'app-event',
//   templateUrl: './create-event.component.html',
//   styleUrls: ['./create-event.component.scss']
// })
// export class CreateEventComponent implements OnInit {
//   itemForm!: FormGroup;
//   showMessage = false;
//   showError = false;
//   responseMessage = '';
//   errorMessage = '';
  
//   events: any[] = [];  // All events (master list)
//   paginatedEvents: any[] = [];  // Events shown on current page
//   searchQuery = '';
  
//   currentPage = 1;
//   itemsPerPage = 5;
//   totalPages = 1;
//   minDate = '';
 
//   // Update mode properties
//   isUpdateMode: boolean = false;
//   selectedEventId: number | null = null;
 
//   constructor(
//     private fb: FormBuilder,
//     private httpService: HttpService
//   ) {}
 
//   ngOnInit(): void {
//     this.initForm();
//     this.setMinDate();
//     this.loadAllEvents();  // ✅ FIXED: Load events on init
//   }
 
//   private initForm(): void {
//     this.itemForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       dateTime: ['', Validators.required],
//       location: ['', Validators.required],
//       status: ['', Validators.required]
//     });
//   }
 
//   private setMinDate(): void {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     tomorrow.setHours(0, 0, 0, 0);
//     this.minDate = tomorrow.toISOString().slice(0, 16);
//   }
 
//   // ✅ FIXED: Renamed to loadAllEvents for clarity
//   loadAllEvents(): void {
//     this.httpService.GetAllevents().subscribe({
//       next: (data) => {
//         this.events = data || [];
//         this.updatePagination();
//       },
//       error: (error) => {
//         this.showError = true;
//         this.errorMessage = 'Failed to load events';
//         this.events = [];
//         this.updatePagination();
//       }
//     });
//   }
 
//   // FIXED: Completely rewritten search logic
//   onSearch(): void {
//     const query = this.searchQuery.trim();
    
//     // If search is empty, show all events
//     if (!query) {
//       this.loadAllEvents();
//       return;
//     }
 
//     // Check if it's a number (Event ID search)
//     if (!isNaN(Number(query))) {
//       this.searchById(Number(query));
//     } else {
//       // Search by title
//       this.searchByTitle(query);
//     }
//   }
 
//   // NEW: Separate method for searching by ID
//   private searchById(eventId: number): void {
//     this.httpService.getEventById(eventId).subscribe({
//       next: (event) => {
//         if (event) {
//           this.events = [event];  // Show only the searched event
//         } else {
//           this.events = [];
//           this.showTemporaryMessage('error', 'No event found with that ID');
//         }
//         this.currentPage = 1;
//         this.updatePagination();
//       },
//       error: (error) => {
//         this.events = [];
//         this.updatePagination();
//         this.showTemporaryMessage('error', 'Failed to find event');
//       }
//     });
//   }
 
//   // NEW: Separate method for searching by title
//   private searchByTitle(title: string): void {
//     this.httpService.getEventsByTitle(title.toLowerCase()).subscribe({
//       next: (data) => {
//         this.events = data || [];
//         if (this.events.length === 0) {
//           this.showTemporaryMessage('error', 'No events found with that title');
//         }
//         this.currentPage = 1;
//         this.updatePagination();
//       },
//       error: (error) => {
//         this.events = [];
//         this.updatePagination();
//         this.showTemporaryMessage('error', 'Failed to search events');
//       }
//     });
//   }
 
//   // FIXED: Simplified pagination logic
//   private updatePagination(): void {
//     this.totalPages = Math.ceil(this.events.length / this.itemsPerPage) || 1;
    
//     // Ensure current page is valid
//     if (this.currentPage > this.totalPages) {
//       this.currentPage = 1;
//     }
    
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     this.paginatedEvents = this.events.slice(start, start + this.itemsPerPage);
//   }
 
//   nextPage(): void {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.updatePagination();
//     }
//   }
 
//   previousPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updatePagination();
//     }
//   }
 
//   onSubmit(): void {
//     if (this.itemForm.invalid) {
//       this.itemForm.markAllAsTouched();
//       return;
//     }
 
//     const formValue = this.itemForm.value;
//     const selectedDate = new Date(formValue.dateTime);
    
//     // Simple client-side future date check
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     tomorrow.setHours(0, 0, 0, 0);
    
//     if (selectedDate < tomorrow) {
//       this.showError = true;
//       this.errorMessage = 'Event must be scheduled for tomorrow or later';
//       return;
//     }
 
//     const payload = {
//       ...formValue,
//       dateTime: selectedDate.toISOString()
//     };
 
//     if (this.isUpdateMode && this.selectedEventId) {
//       // UPDATE MODE
//       this.httpService.updateEventByPlanner(this.selectedEventId, payload).subscribe({
//         next: () => {
//           this.showMessage = true;
//           this.responseMessage = 'Event updated successfully';
//           this.resetForm();
//           this.loadAllEvents();  // Reload all events
//           this.autoCloseAlert();
//         },
//         error: () => {
//           this.showError = true;
//           this.errorMessage = 'Failed to update event';
//           this.autoCloseAlert();
//         }
//       });
//     } else {
//       // ADD MODE
//       this.httpService.createEvent(payload).subscribe({
//         next: () => {
//           this.showMessage = true;
//           this.responseMessage = 'Event created successfully';
//           this.itemForm.reset();
//           this.loadAllEvents();  // Reload all events
//           this.autoCloseAlert();
//         },
//         error: () => {
//           this.showError = true;
//           this.errorMessage = 'Failed to create event';
//           this.autoCloseAlert();
//         }
//       });
//     }
//   }
 
//   editEvent(event: any): void {
//     this.isUpdateMode = true;
//     this.selectedEventId = event.eventID;
    
//     // Format datetime for input (datetime-local requires YYYY-MM-DDThh:mm format)
//     const eventDate = new Date(event.dateTime);
//     const formattedDate = eventDate.toISOString().slice(0, 16);
    
//     this.itemForm.patchValue({
//       title: event.title,
//       description: event.description,
//       dateTime: formattedDate,
//       location: event.location,
//       status: event.status
//     });
    
//     // Scroll to form
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }
 
//   cancelUpdate(): void {
//     this.resetForm();
//   }
 
//   private resetForm(): void {
//     this.isUpdateMode = false;
//     this.selectedEventId = null;
//     this.itemForm.reset();
//   }
 
//   deleteEvent(eventId: number): void {
//     if (!confirm('Are you sure you want to delete this event?')) {
//       return;
//     }
 
//     this.httpService.deleteEventDetailsByID(eventId).subscribe({
//       next: () => {
//         this.showMessage = true;
//         this.responseMessage = 'Event deleted successfully';
//         this.loadAllEvents();  // Reload all events
//         this.autoCloseAlert();
//       },
//       error: () => {
//         this.showError = true;
//         this.errorMessage = 'Failed to delete event';
//         this.autoCloseAlert();
//       }
//     });
//   }
 
//   closeAlert(): void {
//     this.showMessage = false;
//     this.showError = false;
//     this.responseMessage = '';
//     this.errorMessage = '';
//   }
 
//   private autoCloseAlert(): void {
//     setTimeout(() => {
//       this.closeAlert();
//     }, 5000);
//   }
 
//   // NEW: Helper method for temporary messages
//   private showTemporaryMessage(type: 'success' | 'error', message: string): void {
//     if (type === 'success') {
//       this.showMessage = true;
//       this.responseMessage = message;
//     } else {
//       this.showError = true;
//       this.errorMessage = message;
//     }
//     this.autoCloseAlert();
//   }
// }
 