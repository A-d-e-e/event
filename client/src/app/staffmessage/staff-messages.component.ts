import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-staff-messages',
  templateUrl: './staff-messages.component.html',
  styleUrls: ['./staff-messages.component.scss']
})
export class StaffMessagesComponent implements OnInit {
  
  searchForm: FormGroup;
  messageForm: FormGroup;
  
  messages: any[] = [];
  selectedEventId: any = null;
  
  showError: boolean = false;
  errorMessage: string = '';
  showSuccess: boolean = false;
  successMessage: string = '';
  
  loading: boolean = false;
  sendingMessage: boolean = false;
  eventDetails: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.searchForm = this.formBuilder.group({
      eventId: ['', Validators.required]
    });
    
    this.messageForm = this.formBuilder.group({
      messageContent: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
  }

  loadMessages(): void {
    if (!this.searchForm.valid) {
      this.showErrorMessage('Please enter an event ID');
      return;
    }

    const eventId = this.searchForm.get('eventId')?.value;
    this.loading = true;
    this.selectedEventId = eventId;

    this.httpService.getEventDetails(eventId).subscribe(
      (eventData) => {
        this.eventDetails = eventData;
      },
      (error) => {
        console.error('Failed to load event details');
      }
    );

    this.httpService.getMessagesAsStaff(eventId).subscribe(
      (data) => {
        this.messages = data || [];
        this.loading = false;
        
        setTimeout(() => this.scrollToBottom(), 100);
      },
      (error) => {
        this.showErrorMessage('Failed to load messages');
        this.loading = false;
      }
    );
  }

  sendMessage(): void {
    if (!this.messageForm.valid || !this.selectedEventId) {
      this.showErrorMessage('Please enter a message');
      return;
    }

    const messageContent = this.messageForm.get('messageContent')?.value;
    
    this.sendingMessage = true;

    this.httpService.sendMessageAsStaff(this.selectedEventId, messageContent).subscribe(
      (data) => {
        this.showSuccessMessage('Message sent successfully');
        this.messageForm.reset();
        this.loadMessages();
        this.sendingMessage = false;
      },
      (error) => {
        this.showErrorMessage('Failed to send message');
        this.sendingMessage = false;
      }
    );
  }

  scrollToBottom(): void {
    const chatBox = document.querySelector('.messages-list');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

  private showSuccessMessage(message: string): void {
    this.showSuccess = true;
    this.successMessage = message;
    setTimeout(() => {
      this.showSuccess = false;
      this.successMessage = '';
    }, 3000);
  }

  private showErrorMessage(message: string): void {
    this.showError = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.showError = false;
      this.errorMessage = '';
    }, 3000);
  }
}