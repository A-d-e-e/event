import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  // ==================== HELPER METHOD ====================
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // ==================== EVENT METHODS - PLANNER ====================
  
  // Get Event by ID (Planner)
  getEventById(id: number): Observable<any> {
    const url = `${this.serverName}/api/planner/event-details/${id}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Get Events by Title (Planner)
  getEventsByTitle(title: string): Observable<any[]> {
    const url = `${this.serverName}/api/planner/event-detail/${title}`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }

  // Get All Events (Planner)
  GetAllevents(): Observable<any> {
    const url = `${this.serverName}/api/planner/events`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Create Event (Planner)
  createEvent(details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event`;
    return this.http.post(url, details, { headers: this.getHeaders() });
  }

  // Update Event (Planner)
  updateEventByPlanner(eventId: number, event: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event/${eventId}`;
    return this.http.put(url, event, { headers: this.getHeaders() });
  }

  // Delete Event (Planner)
  deleteEventDetailsByID(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event/${eventId}`;
    return this.http.delete(url, { headers: this.getHeaders() });
  }

  // ==================== EVENT METHODS - STAFF ====================

  // Get Event Details (Staff)
  GetEventdetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/event-details/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Get Event Details by Title (Staff)
  GetEventdetailsbyTitle(title: any): Observable<any> {
    const url = `${this.serverName}/api/staff/event-detailsbyTitle/${title}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Get All Events (Staff)
  GetEvents(): Observable<any> {
    const url = `${this.serverName}/api/staff/allEvents`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Update Event (Staff)
  updateEvent(details: any, eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/update-setup/${eventId}`;
    return this.http.put(url, details, { headers: this.getHeaders() });
  }

  // ==================== EVENT METHODS - CLIENT ====================

  // Get Booking Details by ID (Client)
  getBookingDetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/client/booking-details/${eventId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Get Event Details by Title (Client) - NEW
  GetEventdetailsbyTitleforClient(title: any): Observable<any> {
    const url = `${this.serverName}/api/client/booking-details/search?title=${title}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Get All Events (Client)
  GetAlleventsForClient(): Observable<any> {
    const url = `${this.serverName}/api/client/allEvents`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ==================== RESOURCE METHODS ====================

  // Get All Resources
  GetAllResources(): Observable<any> {
    const url = `${this.serverName}/api/planner/resources`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Add Resource
  addResource(details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/resource`;
    return this.http.post(url, details, { headers: this.getHeaders() });
  }

  // Update Resource
  updateResource(resourceId: number, resource: any): Observable<any> {
    const url = `${this.serverName}/api/planner/resource/${resourceId}`;
    return this.http.put(url, resource, { headers: this.getHeaders() });
  }

  // ==================== ALLOCATION METHODS ====================

  // Allocate Resources
  allocateResources(eventId: any, resourceId: any, details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/allocate-resources?eventId=${eventId}&resourceId=${resourceId}`;
    return this.http.post(url, details, { headers: this.getHeaders() });
  }

  // Get All Allocations
  GetAllAllocations(): Observable<any> {
    const url = `${this.serverName}/api/planner/resource-allocate`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Update Allocation
  updateAllocation(allocationId: number, eventId: any, resourceId: any, details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/resource-allocate/${allocationId}?eventId=${eventId}&resourceId=${resourceId}`;
    return this.http.put(url, details, { headers: this.getHeaders() });
  }

  // Delete Allocation
  deleteAllocation(allocationId: number): Observable<any> {
    const url = `${this.serverName}/api/planner/resource-allocate/${allocationId}`;
    return this.http.delete(url, { headers: this.getHeaders() });
  }

  // ==================== AUTH METHODS ====================

  // Login
  Login(details: any): Observable<any> {
    const url = `${this.serverName}/api/user/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, details, { headers });
  }

  // Register User
  registerUser(details: any): Observable<any> {
    const url = `${this.serverName}/api/user/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, details, { headers });
  }

  // Get All Users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.serverName}/api/user/users`, { 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
    });
  }

  // ==================== OTHER METHODS ====================

  // Get State Name
  getStatename(): Observable<any> {
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.get(this.serverName + `/api/state/`, { headers: headers });
  }
}