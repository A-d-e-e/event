// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../environments/environment.development';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpService {
//   public serverName=environment.apiUrl;
//   //todo: complete missing code..
// }



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private serverName = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Helper: Build headers with JSON content-type and Bearer token (if present).
   */
  private buildAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Retrieves booking details for a specific event.
   * GET ${serverName}/api/client/booking-details/{eventId}
   */
  getBookingDetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/client/booking-details/${eventId}`;
    const headers = this.buildAuthHeaders();

    return this.http.get<any>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves event details for a specific event (STAFF).
   * GET ${serverName}/api/staff/event-details/{eventId}
   */
  getEventDetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/event-details/${eventId}`;
    const headers = this.buildAuthHeaders();

    return this.http.get<any>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a list of all events (PLANNER).
   * GET ${serverName}/api/planner/events
   */
  getAllEvents(): Observable<any> {
    const url = `${this.serverName}/api/planner/events`;
    const headers = this.buildAuthHeaders();

    return this.http.get<any>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a list of all resources (PLANNER).
   * GET ${serverName}/api/planner/resources
   */
  getAllResources(): Observable<any> {
    const url = `${this.serverName}/api/planner/resources`;
    const headers = this.buildAuthHeaders();

    return this.http.get<any>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new event (PLANNER).
   * POST ${serverName}/api/planner/event
   */
  createEvent(details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event`;
    const headers = this.buildAuthHeaders();

    return this.http.post<any>(url, details, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing event (STAFF).
   * PUT ${serverName}/api/staff/update-setup/{eventId}
   */
  updateEvent(details: any, eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/update-setup/${eventId}`;
    const headers = this.buildAuthHeaders();

    return this.http.put<any>(url, details, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Adds a new resource (PLANNER).
   * POST ${serverName}/api/planner/resource
   */
  addResource(details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/resource`;
    const headers = this.buildAuthHeaders();

    return this.http.post<any>(url, details, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Allocates resources to an event (PLANNER).
   * POST ${serverName}/api/planner/allocate-resources?eventId={eventId}&resourceId={resourceId}
   */
  allocateResources(eventId: any, resourceId: any, details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/allocate-resources?eventId=${eventId}&resourceId=${resourceId}`;
    const headers = this.buildAuthHeaders();

    return this.http.post<any>(url, details, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Authenticates a user and logs them in.
   * POST ${serverName}/api/user/login
   */
  login(details: any): Observable<any> {
    const url = `${this.serverName}/api/user/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, details, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Registers a new user.
   * POST ${serverName}/api/user/register
   */
  registerUser(details: any): Observable<any> {
    const url = `${this.serverName}/api/user/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, details, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles errors that occur during HTTP requests.
   * - Logs to console and rethrows for caller handling.
   */
  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
``

