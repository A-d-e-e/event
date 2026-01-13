
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event', 
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  itemForm!: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  eventList: any[] = [];
  showMessage: boolean = false;
  responseMessage: string = '';
  minDate: string;
  eventObj: any;
  isUpdate: boolean = false;
  paginatedEvents: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;

  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(
    private router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.minDate = this.getTomorrowDate(); 
  }

  ngOnInit(): void {
    this.searchQuery = '';
    
    this.itemForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dateTime: ['', [Validators.required, this.dateTimeValidator.bind(this)]],
      location: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.getEvents(); 
  }

  
  private parseLocalDateTime(value: string): Date | null {
    if (typeof value !== 'string') return null;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [_, y, m, d, hh, mm] = match;
    const year = Number(y);
    const monthIndex = Number(m) - 1; 
    const day = Number(d);
    const hour = Number(hh);
    const minute = Number(mm);
    const local = new Date();
    local.setFullYear(year, monthIndex, day);
    local.setHours(hour, minute, 0, 0);
    return local;
  }

  
  dateTimeValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    const selectedDate = typeof val === 'string' ? this.parseLocalDateTime(val) : new Date(val);

   
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      return { invalidDate: true };
    }


    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < tomorrow.getTime()) {
      return { dateInPast: true };
    }
    return null;
  }

  private getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const day = tomorrow.getDate().toString().padStart(2, '0');
    const hour = tomorrow.getHours().toString().padStart(2, '0');
    const minute = tomorrow.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.getEvents(); 
      return;
    }

    const query = this.searchQuery.trim().toLowerCase();
    if (!isNaN(Number(query))) {
      this.searchById(Number(query));
    } else {
      this.searchByTitle(query);
    }
  }

  searchById(id: number) {
    this.httpService.getEventById(id).subscribe(
      (data) => {
        this.searchResults = data ? [data] : [];
        this.updatePagination(this.searchResults);
      },
      (error) => {
        console.error('Error searching by ID:', error);
        this.searchResults = [];
        this.updatePagination(this.searchResults);
      }
    );
  }

  searchByTitle(title: string) {
    this.httpService.getEventsByTitle(title).subscribe(
      (data) => {
        this.searchResults = data;
        this.updatePagination(this.searchResults);
      },
      (error) => {
        console.error('Error searching by title:', error);
        this.searchResults = [];
        this.updatePagination(this.searchResults);
      }
    );
  }

  updatePagination(results: any[]) {
    this.eventList = results;
    this.totalPages = Math.ceil(this.eventList.length / this.itemsPerPage);
    this.currentPage = 1;
    this.setPaginatedEvents();
  }

  getEvents() {
    if (this.searchResults.length > 0) {
      this.eventList = this.searchResults;
      this.totalPages = Math.ceil(this.eventList.length / this.itemsPerPage);
      this.setPaginatedEvents();
    } else {
      this.httpService.GetAllevents().subscribe(
        (data) => {
          this.eventList = data;
          this.totalPages = Math.ceil(this.eventList.length / this.itemsPerPage);
          this.setPaginatedEvents();
        },
        error => {
          this.showError = true;
          this.errorMessage = error.message || 'Failed to load events';
        }
      );
    }
  }

  setPaginatedEvents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.eventList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPaginatedEvents();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPaginatedEvents();
    }
  }

  deleteEvent(eventId: any) {
    this.httpService.deleteEventDetailsByID(eventId).subscribe(
      data => {
        this.getEvents();
      },
      error => {
        this.errorMessage = error.message || 'Failed to delete event';
        this.showError = true;
      }
    );
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const formData = { ...this.itemForm.value };
      const dt = this.parseLocalDateTime(formData.dateTime) || new Date(formData.dateTime);
      formData.dateTime = dt.toISOString();

      this.httpService.createEvent(formData).subscribe(
        data => {
          this.responseMessage = 'Event created successfully';
          this.showMessage = true;
          this.itemForm.reset();
          this.getEvents();
          this.autoCloseAlert();
        },
        error => {
          this.errorMessage = 'An error occurred: ' + (error?.message || error);
          this.showError = true;
          this.autoCloseAlert();
        }
      );
    } else {
      this.markFormGroupTouched(this.itemForm);
    }
  }

  autoCloseAlert() {
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }

  closeAlert() {
    this.showMessage = false;
    this.showError = false;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onUpdate() {
    if (this.itemForm.valid) {
      const eventData = this.itemForm.value;

      const payload = {
        title: eventData.title,
        description: eventData.description,
        dateTime: (this.parseLocalDateTime(eventData.dateTime) || new Date(eventData.dateTime)).toISOString(),
        location: eventData.location,
        status: eventData.status
      };

      if (this.isUpdate && this.eventObj) {
        this.httpService.updateEvent(payload, this.eventObj.eventID).subscribe(
          response => {
            this.showMessage = true;
            this.responseMessage = 'Event updated successfully.';
            this.getEvents();
            this.resetForm();
          },
          (error) => {
            this.showError = true;
            this.errorMessage = 'An error occurred while updating the event: ' + error.message;
          }
        );
      } else {
        this.httpService.createEvent(payload).subscribe(
          response => {
            this.showMessage = true;
            this.responseMessage = 'Event created successfully.';
            this.getEvents();
            this.resetForm();
          },
          (error) => {
            this.showError = true;
            this.errorMessage = 'An error occurred while creating the event: ' + error.message;
          }
        );
      }
    } else {
      this.showError = true;
      this.errorMessage = 'Please fill all required fields.';
      this.itemForm.markAllAsTouched();
    }
  }

  edit(val: any) {
    this.isUpdate = true;
    this.eventObj = val;

    const iso = new Date(val?.dateTime);
    const localY = iso.getFullYear();
    const localM = (iso.getMonth() + 1).toString().padStart(2, '0');
    const localD = iso.getDate().toString().padStart(2, '0');
    const localH = iso.getHours().toString().padStart(2, '0');
    const localMin = iso.getMinutes().toString().padStart(2, '0');
    const localDatetime = `${localY}-${localM}-${localD}T${localH}:${localMin}`;

    this.itemForm.patchValue({
      title: val.title,
      description: val.description,
      dateTime: localDatetime,
      location: val.location,
      status: val.status
    });
  }

  resetForm(): void {
    this.isUpdate = false;
    this.itemForm.reset();
    this.eventObj = null;
    this.showError = false;
    this.showMessage = false;
  }
}






// import { Component, OnInit } from '@angular/core';
// import {
// AbstractControl,
// FormBuilder,
// FormGroup,
// ValidationErrors,
// Validators
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpService } from '../../services/http.service';
// import { AuthService } from '../../services/auth.service';

// @Component({
// selector: 'app-event',
// templateUrl: './create-event.component.html',
// styleUrls: ['./create-event.component.scss']
// })
// export class CreateEventComponent implements OnInit {

// itemForm!: FormGroup;

// showError = false;
// showMessage = false;
// errorMessage: any;
// responseMessage = '';

// eventList: any[] = [];
// paginatedEvents: any[] = [];

// currentPage = 1;
// itemsPerPage = 3;
// totalPages = 1;

// minDate: string;
// isUpdate = false;
// eventObj: any = null;

// constructor(
// private router: Router,
// private httpService: HttpService,
// private formBuilder: FormBuilder,
// private authService: AuthService
// ) {
// this.minDate = this.getTomorrowDate();
// }

// ngOnInit(): void {
// this.itemForm = this.formBuilder.group({
// title: ['', Validators.required],
// description: ['', Validators.required],
// dateTime: ['', [Validators.required, this.dateTimeValidator.bind(this)]],
// location: ['', Validators.required],
// status: ['', Validators.required]
// });

// // 🔥 SAFE: unit tests mock this service
// this.getEvents();
// }

// /* ---------------- DATE HELPERS ---------------- */

// private parseLocalDateTime(value: string): Date | null {
// if (!value) return null;

// const match = value.match(
// /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
// );
// if (!match) return null;

// const [, y, m, d, h, min] = match;
// return new Date(+y, +m - 1, +d, +h, +min, 0, 0);
// }

// /** ✅ FINAL VALIDATOR (TEST-FRIENDLY) */
// dateTimeValidator(control: AbstractControl): ValidationErrors | null {
// const value = control.value;

// // 🔥 Let Validators.required handle empty value
// if (!value) {
// return null;
// }

// const selectedDate =
// typeof value === 'string'
// ? this.parseLocalDateTime(value)
// : new Date(value);

// if (!selectedDate || isNaN(selectedDate.getTime())) {
// return { invalidDate: true };
// }

// const tomorrow = new Date();
// tomorrow.setDate(tomorrow.getDate() + 1);
// tomorrow.setHours(0, 0, 0, 0);

// if (selectedDate < tomorrow) {
// return { dateInPast: true };
// }

// return null;
// }

// private getTomorrowDate(): string {
// const d = new Date();
// d.setDate(d.getDate() + 1);

// return `${d.getFullYear()}-${(d.getMonth() + 1)
// .toString()
// .padStart(2, '0')}-${d
// .getDate()
// .toString()
// .padStart(2, '0')}T${d
// .getHours()
// .toString()
// .padStart(2, '0')}:${d
// .getMinutes()
// .toString()
// .padStart(2, '0')}`;
// }

// /* ---------------- FORM ACTIONS ---------------- */

// onSubmit(): void {
// if (this.itemForm.invalid) {
// this.itemForm.markAllAsTouched();
// return;
// }

// const payload = { ...this.itemForm.value };
// const date = this.parseLocalDateTime(payload.dateTime)!;
// payload.dateTime = date.toISOString();

// this.httpService.createEvent(payload).subscribe({
// next: () => {
// this.showMessage = true;
// this.responseMessage = 'Event created successfully';
// this.itemForm.reset();
// this.getEvents();
// },
// error: (err) => {
// this.showError = true;
// this.errorMessage = err;
// }
// });
// }

// /* ---------------- DATA ---------------- */

// getEvents(): void {
// this.httpService.GetAllevents().subscribe({
// next: (data) => {
// this.eventList = data || [];
// this.totalPages = Math.ceil(this.eventList.length / this.itemsPerPage);
// this.setPaginatedEvents();
// },
// error: () => {
// // 🔥 Prevent test crash
// this.eventList = [];
// }
// });
// }

// setPaginatedEvents(): void {
// const start = (this.currentPage - 1) * this.itemsPerPage;
// this.paginatedEvents = this.eventList.slice(start, start + this.itemsPerPage);
// }

// /* ---------------- EDIT ---------------- */

// edit(event: any): void {
// this.isUpdate = true;
// this.eventObj = event;

// const d = new Date(event.dateTime);
// const localDateTime = `${d.getFullYear()}-${(d.getMonth() + 1)
// .toString()
// .padStart(2, '0')}-${d
// .getDate()
// .toString()
// .padStart(2, '0')}T${d
// .getHours()
// .toString()
// .padStart(2, '0')}:${d
// .getMinutes()
// .toString()
// .padStart(2, '0')}`;

// this.itemForm.patchValue({
// title: event.title,
// description: event.description,
// dateTime: localDateTime,
// location: event.location,
// status: event.status
// });
// }

// resetForm(): void {
// this.isUpdate = false;
// this.eventObj = null;
// this.itemForm.reset();
// this.showError = false;
// this.showMessage = false;
// }
// }