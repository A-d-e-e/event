import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit
//doto: complete missing code..
{
  
itemForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  eventList: any[] = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dateTime: ['', Validators.required],
      location: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getEvent();
  }

  /**
   * Fetch list of all events
   */
  getEvent(): void {
    this.httpService.getAllEvents().subscribe({
      next: (res) => {
        this.eventList = res || [];
        this.showError = false;
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch events.';
        console.error(err);
      }
    });
  }

  /**
   * Handles form submission: creates a new event, resets form, refreshes list.
   */
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const payload = this.itemForm.value;

    this.httpService.createEvent(payload).subscribe({
      next: (res) => {
        this.showMessage = true;
        this.responseMessage = 'Event created successfully';
        this.itemForm.reset();
        this.getEvent();
      },
      error: (err) => {
        this.showError = true;
        this.errorMessage = 'Failed to create event.';
        console.error(err);
      }
    });
  }

}