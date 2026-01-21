import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';
 
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'scale(0.9)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  isVisible = false;
  currentNotification: Notification | null = null;
  private notificationSubscription!: Subscription;
  private timeoutId: any;
 
  constructor(private notificationService: NotificationService) {}
 
  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.notification$.subscribe(
      (notification: Notification) => {
        this.showNotification(notification);
      }
    );
  }
 
  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
 
  showNotification(notification: Notification): void {
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
 
    // Close existing notification if open
    if (this.isVisible) {
      this.isVisible = false;
      setTimeout(() => {
        this.displayNotification(notification);
      }, 300); // Wait for close animation
    } else {
      this.displayNotification(notification);
    }
  }
 
  private displayNotification(notification: Notification): void {
    this.currentNotification = notification;
    this.isVisible = true;
 
    // Auto-close after duration
    const duration = notification.duration || 3000;
    this.timeoutId = setTimeout(() => {
      this.closeNotification();
    }, duration);
  }
 
  closeNotification(): void {
    this.isVisible = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}