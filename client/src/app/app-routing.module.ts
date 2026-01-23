import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


import { AppComponent } from './app.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';

import { CreateEventComponent } from './create-event/create-event.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ResourceAllocateComponent } from './resource-allocate/resource-allocate.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { EventMessagesComponent } from './eventmessage/event-messages.component';
import { StaffMessagesComponent } from './staffmessage/staff-messages.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GalleryComponent } from './gallery/gallery.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'dashboard', component: DashbaordComponent },
  { path: 'create-event', component: CreateEventComponent },  
  { path: 'add-resource', component: AddResourceComponent }, 
  { path: 'resource-allocate', component: ResourceAllocateComponent },  
  { path: 'view-events', component: ViewEventsComponent },  
  { path: 'booking-details', component: BookingDetailsComponent },   
  { path: 'event-messages', component: EventMessagesComponent },      // For Planner
  { path: 'staff-messages', component: StaffMessagesComponent },  
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'gallery', component: GalleryComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
