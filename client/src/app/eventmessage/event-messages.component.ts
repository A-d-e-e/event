import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-messages',
  templateUrl: './event-messages.component.html',
  styleUrls: ['./event-messages.component.scss']
})
export class EventMessagesComponent implements OnInit {
  
  searchForm: FormGroup;
  messageForm: FormGroup;
  
  eventList: any[] = [];
  messages: any[] = [];
  selectedEvent: any = null;
  
  showError: boolean = false;
  errorMessage: string = '';
  showSuccess: boolean = false;
  successMessage: string = '';
  
  loading: boolean = false;
  sendingMessage: boolean = false;

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
    this.loadEvents();
  }

  loadEvents(): void {
    this.httpService.GetAllevents().subscribe(
      (data) => {
        this.eventList = data || [];
      },
      (error) => {
        this.showErrorMessage('Failed to load events');
      }
    );
  }

  loadMessages(): void {
    if (!this.searchForm.valid) {
      this.showErrorMessage('Please select an event');
      return;
    }

    const eventId = this.searchForm.get('eventId')?.value;
    this.loading = true;

    this.httpService.getMessagesAsPlanner(eventId).subscribe(
      (data) => {
        this.messages = data || [];
        this.selectedEvent = this.eventList.find(e => e.eventID == eventId);
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
    if (!this.messageForm.valid || !this.selectedEvent) {
      this.showErrorMessage('Please enter a message');
      return;
    }

    const messageContent = this.messageForm.get('messageContent')?.value;
    const eventId = this.selectedEvent.eventID;
    
    this.sendingMessage = true;

    this.httpService.sendMessageAsPlanner(eventId, messageContent).subscribe(
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