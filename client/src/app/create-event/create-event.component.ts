import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

interface Event {
  eventID: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  status: string;
}

@Component({
  selector: 'app-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  itemForm!: FormGroup;
  events: Event[] = [];
  searchQuery: string = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  showMessage = false;
  showError = false;
  responseMessage = '';
  errorMessage = '';

  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dateTime: ['', Validators.required],
      location: ['', Validators.required],
      status: [null, Validators.required]   // consider default: ['', Validators.required]
    });

    this.loadEvents();   // ← load existing events
  }

  loadEvents(): void {
    this.httpService.GetAllevents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.totalPages = Math.ceil(this.events.length / this.pageSize);
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load events';
      }
    });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.itemForm.value,
      dateTime: new Date(this.itemForm.value.dateTime).toISOString()
    };

    this.httpService.createEvent(formData).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Event created successfully';
        this.itemForm.reset();
        this.loadEvents();          // refresh list
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to create event';
      }
    });
  }

  deleteEvent(eventID: string): void {
    if (!confirm('Are you sure?')) return;

    this.httpService.deleteEventDetailsByID(eventID).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.eventID !== eventID);
        this.showMessage = true;
        this.responseMessage = 'Event deleted';
        this.loadEvents();   // or recalculate pagination
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to delete event';
      }
    });
  }

  onSearch(): void {
    // simple client-side filter (improve with server-side later)
    // or call httpService.getEvents({ search: this.searchQuery })
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  closeAlert(): void {
    this.showMessage = false;
    this.showError = false;
  }

  // Optional: getter for paginated events
  get paginatedEvents(): Event[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.events.slice(start, start + this.pageSize);
  }
}