import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit
///todo: complete missing code.

  {

    
formModel: any = { status: null, eventID: null };
  showError: boolean = false;
  errorMessage: any;
  eventObj: any[] = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  isUpdate: any = false;

  // Per spec, display data present in "scores$" using *ngFor
  scores$: Observable<any[]> = of([]);

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Reserved for future use (per spec)
  }

  /**
   * Fetches booking details based on eventID from formModel.
   */
  searchEvent(): void {
    const eventId = this.formModel?.eventID;
    if (eventId == null || eventId === '') {
      this.showError = true;
      this.errorMessage = 'Please enter a valid Event ID.';
      return;
    }

    // Set scores$ observable with booking details
    this.scores$ = this.httpService.getBookingDetails(eventId);
  }

  }

