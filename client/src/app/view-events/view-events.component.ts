import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {

  itemForm: FormGroup;
  formModel: any = { status: null, eventID: null };
  showError: boolean = false;
  errorMessage: any;
  eventObj: any[] = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  isUpdate: any = false;

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      eventID: [null], // for search
      title: ['', Validators.required],
      description: ['', Validators.required],
      dateTime: ['', Validators.required],
      location: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Currently empty per spec
  }

  /**
   * Searches for an event based on formModel.eventID
   */
  searchEvent(): void {
    const id = this.formModel?.eventID;
    if (id == null || id === '') {
      this.showError = true;
      this.errorMessage = 'Please enter an Event ID to search.';
      return;
    }
    this.httpService.getEventDetails(id).subscribe({
      next: (res) => {
        this.eventObj = res ? [res] : [];
        this.showError = false;
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch event details.';
        console.error(err);
      }
    });
  }

  /**
   * Handles form submission (update event)
   */
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
    const eventId = this.formModel?.eventID;
    if (!eventId) {
      this.showError = true;
      this.errorMessage = 'Event ID is required for update.';
      return;
    }

    const payload = {
      title: this.itemForm.value.title,
      description: this.itemForm.value.description,
      dateTime: this.itemForm.value.dateTime,
      location: this.itemForm.value.location,
      status: this.itemForm.value.status
    };

    this.httpService.updateEvent(payload, eventId).subscribe({
      next: (res) => {
        this.showMessage = true;
        this.responseMessage = 'Event updated successfully';
        this.itemForm.reset();
        this.isUpdate = false;
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = 'Failed to update event.';
        console.error(err);
      }
    });
  }

  /**
   * Pre-fills the form with selected event values for editing
   */
  edit(val: any): void {
    this.isUpdate = true;
    // Convert dateTime to 'YYYY-MM-DDTHH:mm' format for datetime-local input if necessary
    const dt = val?.dateTime ? new Date(val.dateTime) : null;
    const isoLocal = dt ? new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';

    this.formModel.eventID = val?.eventID;
    this.itemForm.patchValue({
      title: val?.title || '',
      description: val?.description || '',
      dateTime: isoLocal || '',
      location: val?.location || '',
      status: val?.status || ''
    });
  }
}