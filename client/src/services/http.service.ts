import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  // Helper method to get headers with authentication
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ==================== PAYMENT METHODS ====================
  
  initiatePayment(eventId: number, paymentData: any): Observable<any> {
    const url = `${this.serverName}/api/payment/initiate/${eventId}`;
    console.log('Calling initiatePayment API:', url);
    console.log('Payment data:', paymentData);
    return this.http.post(url, paymentData, { headers: this.getHeaders() });
  }

  processUpiPayment(paymentId: number, upiData: any): Observable<any> {
    const url = `${this.serverName}/api/payment/process-upi/${paymentId}`;
    console.log('Calling processUpiPayment API:', url);
    console.log('UPI data:', upiData);
    return this.http.post(url, upiData, { headers: this.getHeaders() });
  }

  getPaymentById(paymentId: number): Observable<any> {
    const url = `${this.serverName}/api/payment/${paymentId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getAllPayments(): Observable<any> {
    const url = `${this.serverName}/api/payment/all`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getPaymentsByEventId(eventId: number): Observable<any> {
    const url = `${this.serverName}/api/payment/event/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  calculateEventAmount(eventId: number): Observable<any> {
    const url = `${this.serverName}/api/payment/calculate/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ==================== EVENT METHODS - PLANNER ====================
  
  getEventById(id: number): Observable<any> {
    const url = `${this.serverName}/api/planner/event-details/${id}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getEventsByTitle(title: string): Observable<any[]> {
    const url = `${this.serverName}/api/planner/event-detail/${title}`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  GetAllevents(): Observable<any> {
    const url = `${this.serverName}/api/planner/events`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  createEvent(details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event`;
    return this.http.post(url, details, { headers: this.getHeaders() });
  }

  updateEventByPlanner(eventId: number, event: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event/${eventId}`;
    return this.http.put(url, event, { headers: this.getHeaders() });
  }

  deleteEventDetailsByID(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event/${eventId}`;
    return this.http.delete(url, { headers: this.getHeaders() });
  }

  // ==================== EVENT METHODS - STAFF ====================

  GetEventdetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/event-details/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getEventDetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/event-details/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  GetEventdetailsbyTitle(title: any): Observable<any> {
    const url = `${this.serverName}/api/staff/event-detailsbyTitle/${title}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  GetEvents(): Observable<any> {
    const url = `${this.serverName}/api/staff/allEvents`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  updateEvent(details: any, eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/update-setup/${eventId}`;
    return this.http.put(url, details, { headers: this.getHeaders() });
  }

  // ==================== EVENT METHODS - CLIENT ====================

  getBookingDetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/client/booking-details/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  GetEventdetailsbyTitleforClient(title: any): Observable<any> {
    const url = `${this.serverName}/api/client/booking-details/search?title=${title}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  GetAlleventsForClient(): Observable<any> {
    const url = `${this.serverName}/api/client/allEvents`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ==================== RESOURCE METHODS ====================

  GetAllResources(): Observable<any> {
    const url = `${this.serverName}/api/planner/resources`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  addResource(details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/resource`;
    return this.http.post(url, details, { headers: this.getHeaders() });
  }

  updateResource(resourceId: number, resource: any): Observable<any> {
    const url = `${this.serverName}/api/planner/resource/${resourceId}`;
    return this.http.put(url, resource, { headers: this.getHeaders() });
  }

  // ==================== ALLOCATION METHODS ====================

  allocateResources(eventId: any, resourceId: any, details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/allocate-resources?eventId=${eventId}&resourceId=${resourceId}`;
    return this.http.post(url, details, { headers: this.getHeaders() });
  }

  GetAllAllocations(): Observable<any> {
    const url = `${this.serverName}/api/planner/resource-allocate`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  updateAllocation(allocationId: number, eventId: any, resourceId: any, details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/resource-allocate/${allocationId}?eventId=${eventId}&resourceId=${resourceId}`;
    return this.http.put(url, details, { headers: this.getHeaders() });
  }

  deleteAllocation(allocationId: number): Observable<any> {
    const url = `${this.serverName}/api/planner/resource-allocate/${allocationId}`;
    return this.http.delete(url, { headers: this.getHeaders() });
  }

  // ==================== MESSAGE METHODS ====================

  // Planner message methods
  sendMessageAsPlanner(eventId: any, message: any): Observable<any> {
    const url = `${this.serverName}/api/planner/messages`;
    const payload = {
      eventID: eventId,
      messageContent: message
    };
    return this.http.post(url, payload, { headers: this.getHeaders() });
  }

  getMessagesAsPlanner(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/planner/messages/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Staff message methods
  sendMessageAsStaff(eventId: any, message: any): Observable<any> {
    const url = `${this.serverName}/api/staff/messages`;
    const payload = {
      eventID: eventId,
      messageContent: message
    };
    return this.http.post(url, payload, { headers: this.getHeaders() });
  }

  getMessagesAsStaff(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/messages/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ==================== AUTH METHODS ====================

  Login(details: any): Observable<any> {
    const url = `${this.serverName}/api/user/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, details, { headers });
  }

  registerUser(details: any): Observable<any> {
    const url = `${this.serverName}/api/user/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, details, { headers });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.serverName}/api/user/users`, { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
    });
  }

  getUsersByRole(role: string) {
    return this.http.get(`${this.serverName}/api/users/role/${role}`);
  }

  
  // Submit feedback for an event (CLIENT role required)
  submitFeedback(eventId: any, details: any): Observable<any> {
    const url = `${this.serverName}/api/client/feedback/${eventId}`;
    return this.http.post(url, details, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get feedbacks for a specific event (PUBLIC - no auth needed)
  getEventFeedbacks(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/public/feedbacks/${eventId}`;
    return this.http.get(url, { headers: this.getPublicHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get all verified feedbacks (PUBLIC - no auth needed)
  getAllFeedbacks(): Observable<any> {
    const url = `${this.serverName}/api/public/feedbacks`;
    return this.http.get(url, { headers: this.getPublicHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get feedback statistics for an event (PUBLIC - no auth needed)
  getEventFeedbackStats(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/public/feedbacks/${eventId}/stats`;
    return this.http.get(url, { headers: this.getPublicHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Toggle feedback verification (PLANNER role required)
  toggleFeedbackVerification(feedbackId: any): Observable<any> {
    const url = `${this.serverName}/api/planner/feedback/${feedbackId}/verify`;
    return this.http.put(url, {}, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
  // ==================== OTHER METHODS ====================

  getStatename(): Observable<any> {
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.get(this.serverName + `/api/state/`, { headers: headers });
  }

  // sendOTP(email: string) {
  //   return this.http.post(`${this.serverName}/api/otp/send?email=${email}`, {});
  // }
  
  // // Verify OTP
  // verifyOTP(email: string, otp: string) {
  //   return this.http.post(`${this.serverName}/api/otp/verify?email=${email}&otp=${otp}`, {});
  // }
  
  // Error handler
  private handleError(error: any): Observable<never> {
    console.error('HTTP Service Error:', error);
    return throwError(() => error);
  }
  
  private getPublicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
}