import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ResourceAllocateComponent } from './resource-allocate/resource-allocate.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { EventMessagesComponent } from './eventmessage/event-messages.component';
import { StaffMessagesComponent } from './staffmessage/staff-messages.component';
import { HomeComponent } from './home/home.component';
import { NotificationService } from '../services/notification.service';
import { NotificationComponent } from './notification/notification.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpService } from '../services/OtpService';
import { GalleryComponent } from './gallery/gallery.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
      RegistrationComponent,
      NotificationComponent,
      DashbaordComponent,    
      CreateEventComponent,
      AddResourceComponent,
      ResourceAllocateComponent,
      ViewEventsComponent,
      BookingDetailsComponent,
      EventMessagesComponent,
      ForgotPasswordComponent,
      GalleryComponent,
    StaffMessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [HttpService,HttpClientModule, NotificationService, OtpService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
