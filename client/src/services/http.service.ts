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

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getBookingDetails(eventId: any): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/client/booking-details/${eventId}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getEventDetails(eventId: any): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/staff/event-details/${eventId}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getAllEvents(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/planner/events`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getAllResources(): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/planner/resources`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  createEvent(details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/planner/event`,
      details,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  updateEvent(details: any, eventId: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/staff/update-setup/${eventId}`,
      details,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  addResource(details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/planner/resource`,
      details,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  allocateResources(eventId: any, resourceId: any, details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/planner/allocate-resources?eventId=${eventId}&resourceId=${resourceId}`,
      details,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  login(details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/user/login`,
      details,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(catchError(this.handleError));
  }

  registerUser(details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/user/register`,
      details,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}