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
 
//   events: any[] = [];

//   paginatedEvents: any[] = [];

//   searchResults: any[] = [];

//   searchQuery = '';
 
//   currentPage = 1;

//   itemsPerPage = 5;

//   totalPages = 1;
 
//   minDate = '';
 
//   constructor(

//     private fb: FormBuilder,

//     private httpService: HttpService

//   ) { }
 
//   ngOnInit(): void {

//     this.initForm();

//     this.setMinDate();

//     this.loadEvents();

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

//     this.minDate = tomorrow.toISOString().slice(0, 16);   // YYYY-MM-DDTHH:mm

//   }
 
//   loadEvents(): void {

//     if (this.searchResults.length > 0) {

//       this.events = [...this.searchResults];

//     } else {

//       this.httpService.GetAllevents().subscribe({

//         next: (data) => {

//           this.events = data || [];

//         },

//         error: () => {

//           this.showError = true;

//           this.errorMessage = 'Failed to load events';

//         }

//       });

//     }

//     this.updatePagination();

//   }
 
//   onSearch(): void {

//     if (!this.searchQuery.trim()) {

//       this.searchResults = [];

//       this.loadEvents();

//       return;

//     }
 
//     const query = this.searchQuery.trim().toLowerCase();
 
//     if (!isNaN(Number(query))) {

//       // search by ID

//       this.httpService.getEventById(Number(query)).subscribe({

//         next: (event) => {

//           this.searchResults = event ? [event] : [];

//           this.loadEvents();

//         },

//         error: () => {

//           this.searchResults = [];

//           this.loadEvents();

//         }

//       });

//     } else {

//       // search by title (partial match)

//       this.httpService.getEventsByTitle(query).subscribe({

//         next: (data) => {

//           this.searchResults = data || [];

//           this.loadEvents();

//         },

//         error: () => {

//           this.searchResults = [];

//           this.loadEvents();

//         }

//       });

//     }

//   }
 
//   private updatePagination(): void {

//     this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);

//     if (this.currentPage > this.totalPages) {

//       this.currentPage = this.totalPages || 1;

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
 
//     this.httpService.createEvent(payload).subscribe({

//       next: () => {

//         this.showMessage = true;

//         this.responseMessage = 'Event created successfully';

//         this.itemForm.reset();

//         this.loadEvents();

//         this.autoCloseAlert();

//       },

//       error: () => {

//         this.showError = true;

//         this.errorMessage = 'Failed to create event';

//         this.autoCloseAlert();

//       }

//     });

//   }
 
//   deleteEvent(eventId: number): void {

//     if (!confirm('Are you sure you want to delete this event?')) return;
 
//     this.httpService.deleteEventDetailsByID(eventId).subscribe({

//       next: () => {

//         this.showMessage = true;

//         this.responseMessage = 'Event deleted successfully';

//         this.loadEvents();

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

// }

 














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
 
  events: any[] = [];
  paginatedEvents: any[] = [];
  searchResults: any[] = [];
  searchQuery = '';
 
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
 
  minDate = '';
  
  // NEW: Update mode properties
  isUpdateMode: boolean = false;
  selectedEventId: number | null = null;
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService
  ) { }
 
  ngOnInit(): void {
    this.initForm();
    this.setMinDate();
    this.loadEvents();
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
 
  loadEvents(): void {
    if (this.searchResults.length > 0) {
      this.events = [...this.searchResults];
    } else {
      this.httpService.GetAllevents().subscribe({
        next: (data) => {
          this.events = data || [];
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to load events';
        }
      });
    }
    this.updatePagination();
  }
 
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.loadEvents();
      return;
    }
 
    const query = this.searchQuery.trim().toLowerCase();
 
    if (!isNaN(Number(query))) {
      // search by ID
      this.httpService.getEventById(Number(query)).subscribe({
        next: (event) => {
          this.searchResults = event ? [event] : [];
          this.loadEvents();
        },
        error: () => {
          this.searchResults = [];
          this.loadEvents();
        }
      });
    } else {
      // search by title
      this.httpService.getEventsByTitle(query).subscribe({
        next: (data) => {
          this.searchResults = data || [];
          this.loadEvents();
        },
        error: () => {
          this.searchResults = [];
          this.loadEvents();
        }
      });
    }
  }
 
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedEvents = this.events.slice(start, start + this.itemsPerPage);
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
 
    // Simple client-side future date check
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
 
    if (selectedDate < tomorrow) {
      this.showError = true;
      this.errorMessage = 'Event must be scheduled for tomorrow or later';
      return;
    }
 
    const payload = {
      ...formValue,
      dateTime: selectedDate.toISOString()
    };

    if (this.isUpdateMode && this.selectedEventId) {
      // UPDATE MODE
      this.httpService.updateEventByPlanner(this.selectedEventId, payload).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Event updated successfully';
          this.resetForm();
          this.loadEvents();
          this.autoCloseAlert();
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to update event';
          this.autoCloseAlert();
        }
      });
    } else {
      // ADD MODE
      this.httpService.createEvent(payload).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Event created successfully';
          this.itemForm.reset();
          this.loadEvents();
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

  // NEW: Edit event method
  editEvent(event: any): void {
    this.isUpdateMode = true;
    this.selectedEventId = event.eventID;
    
    // Format datetime for input (datetime-local requires YYYY-MM-DDTHH:mm format)
    const eventDate = new Date(event.dateTime);
    const formattedDate = eventDate.toISOString().slice(0, 16);
    
    this.itemForm.patchValue({
      title: event.title,
      description: event.description,
      dateTime: formattedDate,
      location: event.location,
      status: event.status
    });
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // NEW: Cancel update method
  cancelUpdate(): void {
    this.resetForm();
  }

  // NEW: Reset form helper
  private resetForm(): void {
    this.isUpdateMode = false;
    this.selectedEventId = null;
    this.itemForm.reset();
  }
 
  deleteEvent(eventId: number): void {
    if (!confirm('Are you sure you want to delete this event?')) return;
 
    this.httpService.deleteEventDetailsByID(eventId).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Event deleted successfully';
        this.loadEvents();
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
}