import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
 
export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
 
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();
 
  constructor() {}
 
  // Success notification
  success(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }
 
  // Error notification
  error(message: string, duration: number = 3000): void {
    this.show(message, 'error', duration);
  }
 
  // Info notification
  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }
 
  // Warning notification
  warning(message: string, duration: number = 3000): void {
    this.show(message, 'warning', duration);
  }
 
  // Generic show method
  private show(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number): void {
    this.notificationSubject.next({ message, type, duration });
  }
}