import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})

export class ViewEventsComponent  implements OnInit{
  itemForm!: FormGroup;
  showError : boolean = false;
  errorMessage : string = "";
  eventObj: any;
  showMessage: boolean = false;
  responseMessage: string = '';
  isUpdate: boolean = false;
  eventList: any[] = [];
  originalEventList: any[] = [];
  minDate: string;
  message: {type: 'success' | 'error', text: string } | null = null;
  searchPerformed : boolean = false;

  paginatedEvents: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;

  
  roleName: string = '';
  staffList: any[] = [];
  selectedEventForStaff: any = null;
  selectedStaffId: string = '';
  staffAssignMessage: string = '';
  staffAssignSuccess: boolean = false;
  
  selectedEventForMessaging: any = null;
  messages: any[] = [];
  newMessage: string = '';

  
  selectedEventForBooking: any = null;
  bookingRequirements: string = '';
  bookingMessage: string = '';
  bookingSuccess: boolean = false;
  bookingAmount: number = 0;
  isProcessingPayment: boolean = false;
  userBookings: any[] = []; 

  
  allBookings: any[] = [];
  selectedBooking: any = null;
  bookingStatusUpdate: string = '';
  bookingNotes: string = '';

  
  showStaffAssignModal: boolean = false;
  showMessagingModal: boolean = false;
  showBookingModal: boolean = false;
  showBookingsListModal: boolean = false;
  showBookingStatusModal: boolean = false;
  showUpdateModal: boolean = false;

  constructor(private httpService: HttpService,
    private formBuilder: FormBuilder,private router: Router,
    private authService: AuthService){
      this.minDate = this.getTomorrowDate();
      this.roleName = this.authService.getRole || '';
    }

  ngOnInit(): void {
    this.initForm();
    // this.getEvents();
    
    
    // if (this.roleName === 'PLANNER') {
    //   this.loadStaffList();
    // }
    
    
    // if (this.roleName === 'CLIENT') {
    //   this.loadUserBookings();
    // }
  }
  initForm() {
    this.itemForm = this.formBuilder.group({
      searchTerm : [''],
      title:['',[Validators.required]],
      description: ['',[Validators.required]],
      dateTime:['',[Validators.required,this.dateTimeValidator.bind(this)]],
      location:['',[Validators.required]],
      status:['',[Validators.required]]
    })
  }

  
  closeStaffAssignModal(): void {
    this.showStaffAssignModal = false;
  }

  closeMessagingModal(): void {
    this.showMessagingModal = false;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
  }

  closeBookingsListModal(): void {
    this.showBookingsListModal = false;
  }

  closeBookingStatusModal(): void {
    this.showBookingStatusModal = false;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
  }

  openUpdateModal(event: any): void {
    this.edit(event);
    this.showUpdateModal = true;
  }

  dateTimeValidator(control: AbstractControl): ValidationErrors | null{
    const selectedDate = new Date(control.value);
    const tomorrow = new Date(this.minDate);

    if(isNaN(selectedDate.getTime())){
      return { invalidDate: true};
    }

    if(selectedDate < tomorrow){
      return { dateInPast: true};
    }
    return null;
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);
    return tomorrow.toISOString().slice(0,16);
  }

  // getEvents() {
    
  //   const role = this.authService.getRole;
  //   let eventsObservable;
    
  //   if (role === 'PLANNER') {
  //     eventsObservable = this.httpService.GetAllevents();
  //   } else if (role === 'CLIENT') {
  //     eventsObservable = this.httpService.GetAlleventsForClient();
  //   } else {
  //     eventsObservable = this.httpService.GetEvents();
  //   }
    
  //   eventsObservable.subscribe(
  //     (data) => {
  //       this.eventList = data;
  //       this.originalEventList = [...data]
  //       this.totalPages = Math.ceil(this.eventList.length / this.itemsPerPage);
  //       this.setPaginatedEvents();
  //     },
  //     (error: any) => {
  //       this.showError = true;
  //       this.errorMessage = error.message || 'Failed to load events';
  //     }
  //   );
  // }
  
  
  // loadUserBookings(): void {
  //   this.httpService.getMyBookings().subscribe({
  //     next: (bookings: any) => {
  //       this.userBookings = bookings;
  //     },
  //     error: (error) => {
  //       console.error('Error loading bookings:', error);
  //     }
  //   });
  // }
  
  
  isEventBooked(eventId: number): boolean {
    return this.userBookings.some(booking => booking.event?.eventID === eventId);
  }
  
  
  getBookingForEvent(eventId: number): any {
    return this.userBookings.find(booking => booking.event?.eventID === eventId);
  }
  setPaginatedEvents() {
    const startIndex = (this.currentPage -1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.eventList.slice(startIndex,endIndex);
  }
  nextPage(){
    if(this.currentPage < this.totalPages){
      this.currentPage++;
      this.setPaginatedEvents();
    }
  }
  previousPage(){
    if(this.currentPage > 1){
      this.currentPage -- ;
      this.setPaginatedEvents();
    }
  }
  // searchEvent(): void{
  //   if(this.itemForm.get('searchTerm')?.valid){
  //     const searchTerm = this.itemForm.get('searchTerm')?.value;
  //     const role = this.authService.getRole;
      
  //     if(isNaN(searchTerm)){
        
  //       let searchObservable;
  //       if (role === 'PLANNER') {
  //         searchObservable = this.httpService.getEventsByTitle(searchTerm);
  //       } else if (role === 'CLIENT') {
  //         searchObservable = this.httpService.GetEventdetailsbyTitleforClient(searchTerm);
  //       } else {
  //         searchObservable = this.httpService.GetEventdetailsbyTitle(searchTerm);
  //       }
        
  //       searchObservable.subscribe(
  //         (response) => {
  //           console.log(response);
  //           this.handleSearchResponse(response);
  //           if(response && Object.keys(response).length !== 0){
              
  //             this.eventList = Array.isArray(response) ? response : [response];
  //             this.totalPages = 1;
  //             this.currentPage = 1;
  //             this.setPaginatedEvents();
  //           }else{
  //             this.eventList = [];
  //             this.paginatedEvents = [];
  //             this.totalPages = 0;
  //             this.currentPage = 0;
  //           }
  //         },
  //         (error) => {
  //           this.handleSearchError(error);
  //           this.eventList = [];
  //           this.paginatedEvents = [];
  //           this.totalPages = 0;
  //           this.currentPage = 0;
  //         }
  //       );
  //     }else{
        
  //       let searchObservable;
  //       if (role === 'PLANNER') {
  //         searchObservable = this.httpService.getEventById(Number(searchTerm));
  //       } else if (role === 'CLIENT') {
  //         searchObservable = this.httpService.getBookingDetails(Number(searchTerm));
  //       } else {
  //         searchObservable = this.httpService.GetEventdetails(Number(searchTerm));
  //       }
        
  //       searchObservable.subscribe(
  //         (response) =>{
  //           this.handleSearchResponse(response);
  //           if(response && Object.keys(response).length !== 0){
  //             this.eventList = [response];
  //             this.totalPages = 1;
  //             this.currentPage = 1;
  //             this.setPaginatedEvents();
  //           }else{
  //             this.eventList = [];
  //             this.paginatedEvents = [];
  //             this.totalPages = 0;
  //             this.currentPage = 0;
  //           }
  //         },
  //         (error) => {
  //           this.handleSearchError(error);
  //           this.eventList = [];
  //           this.paginatedEvents = [];
  //           this.totalPages = 0;
  //           this.currentPage = 0;
  //         }
  //       );
  //     }
  //   } else{
  //     this.itemForm.get('searchTerm')?.markAsTouched();
  //   }
  // }
  private handleSearchError(error: any) {
   this.searchPerformed = true;
   this.showTemporaryMessage('error','Failed to find event');
   console.error('Error searching event:',error);
  }
  private handleSearchResponse(response: any): void {
    this.searchPerformed = true;
    if(response && Object.keys(response).length !== 0){
      this.showTemporaryMessage('success','Event Found');
    }else{
      this.showTemporaryMessage('error','No event found');
    }
  }
  private showTemporaryMessage(type: 'success' | 'error',text: string): void {
    this.message = {type, text};
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
  onSubmit(){
    if(this.itemForm.valid){
      const eventData = this.itemForm.value;
      if(this.isUpdate && this.eventObj){
        const updateData = {
          title: eventData.title,
          description: eventData.description,
          dateTime: eventData.dateTime,
          location: eventData.location,
          status: eventData.status
        };
        this.httpService.updateEvent(updateData, this.eventObj.eventID).subscribe(
          response => {
            this.showMessage =true;
            this.responseMessage = 'Event updated successfully.';
            // this.getEvents();
            this.resetForm();
            this.closeUpdateModal();
          },
          (error) => {
            this.showError = true;
            this.errorMessage = 'An error occured while updating the event: ' + error.message;
          }
        );
      }else{
        this.httpService.createEvent(eventData).subscribe(
          response => {
            this.showMessage = true;
            this.responseMessage = 'Event created successfully.';
            // this.getEvents();
            this.resetForm();
            this.closeUpdateModal();
          },
          (error) => {
            this.showError = true;
            this.errorMessage = 'An error occured while updating the event: ' + error.message;
          }
        );
      }
    } else{
      this.showError = true;
      this.errorMessage = 'Please fill all required fields.';
      this.itemForm.markAllAsTouched();
    }
  }
  resetForm() : void{
    this.isUpdate = false;
    this.itemForm.reset();
    this.eventObj = null;
    this.showError = false;
    this.showMessage = false;
  }
  edit(val: any){
    this.isUpdate = true;
    this.eventObj = val;
    this.itemForm.patchValue({
      title: val.title,
      description : val.description,
      dateTime:  new Date(val.dateTime).toISOString().slice(0,16),
      location : val.location,
      status:  val.status
    });
    ;
  }
  filterPastEvents(): void{
    const currentDate = new Date();
    this.eventList = this.originalEventList.filter(event => new Date(event.dateTime) < currentDate);
  }
  filterTodayEvents(): void{
    const currentDate = new Date();
    this.eventList = this.originalEventList.filter(event => {
      const eventDate = new Date(event.dateTime);
      return eventDate.toDateString() === currentDate.toDateString();
    });
  }
  filterFutureEvents(): void{
    const currentDate = new Date();
    this.eventList = this.originalEventList.filter(event => new Date(event.dateTime) > currentDate);
  }

  viewAllEvents(): void{
    // this.getEvents();
  }
  onFilterChange(event: any): void{
    const filterValue = event.target.value;
    switch(filterValue){
      case 'past': this.filterPastEvents();
      break;
      case 'today': this.filterTodayEvents();
      break;
      case 'future': this.filterFutureEvents();
      break;
      default: this.viewAllEvents();
    }
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.eventList.length / this.itemsPerPage);
    this.setPaginatedEvents();
  }

  sortByTitle(): void {
      this.eventList.sort((a, b) => a.title.localeCompare(b.title));
      this.updatePaginatedEvents();
    }
  
    sortById(): void {
      this.eventList.sort((a, b) => a.eventID - b.eventID);
      this.updatePaginatedEvents();
    }
  
    sortByDate(): void {
      this.eventList.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      this.updatePaginatedEvents();
    }
    sortByLocation(): void {
      this.eventList.sort((a, b) => a.location.localeCompare(b.location));
      this.updatePaginatedEvents();
    }
  
    updatePaginatedEvents(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedEvents = this.eventList.slice(startIndex, endIndex);
    }
  
    onSortChange(event: any): void {
      const sortValue = event.target.value;
      this.currentPage = 1;
      this.setPaginatedEvents();
      switch (sortValue) {
        case 'title':
          this.sortByTitle();
          break;
        case 'date':
          this.sortByDate();
          break;
        case 'location':
          this.sortByLocation();
          break;
        case 'id':
          this.sortById();
          break;
      }
    }

    
    // loadStaffList(): void {
    //   this.httpService.getAllStaff().subscribe({
    //     next: (response: any) => {
    //       this.staffList = response;
    //     },
    //     error: (error) => {
    //       console.error('Error loading staff list:', error);
    //     }
    //   });
    // }

    openStaffAssignment(event: any): void {
      this.selectedEventForStaff = event;
      this.selectedStaffId = '';
      this.staffAssignMessage = '';
      this.staffAssignSuccess = false;
      this.showStaffAssignModal = true;
    }

    // assignStaff(): void {
    //   if (!this.selectedEventForStaff || !this.selectedStaffId) {
    //     return;
    //   }

    //   this.httpService.assignStaffToEvent(this.selectedEventForStaff.eventID, Number(this.selectedStaffId)).subscribe({
    //     next: (response: any) => {
    //       this.staffAssignMessage = 'Staff assigned successfully!';
    //       this.staffAssignSuccess = true;
          
          
    //       const eventIndex = this.eventList.findIndex(e => e.eventID === this.selectedEventForStaff.eventID);
    //       if (eventIndex !== -1) {
    //         const assignedStaff = this.staffList.find(s => s.userId == this.selectedStaffId);
    //         this.eventList[eventIndex].assignedStaff = assignedStaff;
    //         this.updatePaginatedEvents();
    //       }
          
    //       setTimeout(() => {
    //         this.closeStaffAssignModal();
    //       }, 1500);
    //     },
    //     error: (error) => {
    //       this.staffAssignMessage = error.error?.message || 'Failed to assign staff';
    //       this.staffAssignSuccess = false;
    //     }
    //   });
    // }

    
    openMessaging(event: any): void {
      this.selectedEventForMessaging = event;
      this.messages = [];
      this.newMessage = '';
      // this.messages(event.eventID);
      this.showMessagingModal = true;
    }

    // loadMessages(eventId: number): void {
    //   this.httpService.getEventMessages(eventId).subscribe({
    //     next: (response: any) => {
    //       this.messages = response;
    //     },
    //     error: (error) => {
    //       console.error('Error loading messages:', error);
    //       this.messages = [];
    //     }
    //   });
    // }

    // sendMessage(): void {
    //   if (!this.newMessage || !this.selectedEventForMessaging) {
    //     return;
    //   }

    //   const messageData = {
    //     eventId: this.selectedEventForMessaging.eventID,
    //     content: this.newMessage
    //   };

    //   this.httpService.sendMessage(messageData).subscribe({
    //     next: (response: any) => {
          
    //       this.loadMessages(this.selectedEventForMessaging.eventID);
    //       this.newMessage = '';
          
          
    //       setTimeout(() => {
    //         const messagesContainer = document.querySelector('.messages-container');
    //         if (messagesContainer) {
    //           messagesContainer.scrollTop = messagesContainer.scrollHeight;
    //         }
    //       }, 100);
    //     },
    //     error: (error) => {
    //       console.error('Error sending message:', error);
    //       alert('Failed to send message');
    //     }
    //   });
    // }

   
    openBookingForm(event: any): void {
      
      if (this.isEventBooked(event.eventID)) {
        alert('You have already booked this event!');
        return;
      }
      
      this.selectedEventForBooking = event;
      this.bookingRequirements = '';
      this.bookingMessage = '';
      this.bookingSuccess = false;
      this.isProcessingPayment = false;
      
      // const amountInPaise = this.paymentService.calculateBookingAmount(event);
      // this.bookingAmount = amountInPaise / 100; 
      this.showBookingModal = true;
    }

    submitBooking(): void {
      if (!this.selectedEventForBooking) {
        return;
      }

      this.isProcessingPayment = true;
      this.bookingMessage = 'Processing your payment...';

      
      const amountInPaise = Math.round(this.bookingAmount * 100);

      const bookingData = {
        eventId: this.selectedEventForBooking.eventID,
        clientRequirements: this.bookingRequirements || 'No specific requirements',
        amount: amountInPaise 
      };

    }
          
          

          

    
    // viewAllBookings(): void {
    //   this.httpService.getAllBookings().subscribe({
    //     next: (response: any) => {
    //       this.allBookings = response;
    //       this.showBookingsListModal = true;
    //     },
    //     error: (error) => {
    //       console.error('Error loading bookings:', error);
    //       alert('Failed to load bookings');
    //     }
    //   });
    // }

    openBookingStatusUpdate(booking: any): void {
      this.selectedBooking = booking;
      this.bookingStatusUpdate = booking.status || 'PENDING';
      this.bookingNotes = booking.notes || '';
      this.showBookingStatusModal = true;
    }

    // updateBookingStatus(): void {
    //   if (!this.selectedBooking) {
    //     return;
    //   }

    //   this.httpService.updateBookingStatus(
    //     this.selectedBooking.bookingId,
    //     this.bookingStatusUpdate,
    //     this.bookingNotes
    //   ).subscribe({
    //     next: (response: any) => {
    //       alert('Booking status updated successfully!');
          
          
    //       const bookingIndex = this.allBookings.findIndex(b => b.bookingId === this.selectedBooking.bookingId);
    //       if (bookingIndex !== -1) {
    //         this.allBookings[bookingIndex].status = this.bookingStatusUpdate;
    //         this.allBookings[bookingIndex].notes = this.bookingNotes;
    //       }
          
    //       this.closeBookingStatusModal();
    //     },
    //     error: (error) => {
    //       console.error('Error updating booking status:', error);
    //       alert('Failed to update booking status');
    //     }
    //   });
    // }

    getBookingStatusClass(status: string): string {
      switch (status?.toUpperCase()) {
        case 'CONFIRMED':
        case 'APPROVED':
          return 'badge bg-success';
        case 'PENDING':
          return 'badge bg-warning';
        case 'CANCELLED':
        case 'REJECTED':
          return 'badge bg-danger';
        default:
          return 'badge bg-secondary';
      }
    }
}