import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  statename: any = {};
  showError: any;
  errorMessage: any;
  stateIdMd: any;
  roleName: string | null;
  userName: string = 'User';
  
  // Role-based dashboard properties
  displayRole: string = '';
  welcomeMessage: string = '';
  subtitle: string = '';
  description: string = '';
  eventsCount: string = '0';
  actionCards: any[] = [];

  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) {
    console.log("Constructor - Dashboard Component");
    
    // Get role and username from AuthService
    this.roleName = authService.getRole;
    this.userName = authService.getUsername || 'User';
    
    console.log("Username:", this.userName);
    console.log("Role:", this.roleName);
    
    // Initialize role-based data
    this.initializeRoleBasedData();
  }

  ngOnInit(): void {
    console.log("ngOnInit - Dashboard Component");
    console.log("Current Role:", this.roleName);
    console.log("Current Username:", this.userName);
    
    // Load dashboard data
    this.dashboardView();
  }

  initializeRoleBasedData() {
    const role = this.roleName?.toLowerCase();

    if (role === 'planner') {
      this.displayRole = 'PLANNER';
      this.welcomeMessage = `Welcome, ${this.userName}`;
      this.subtitle = 'Orchestrate extraordinary events with precision and elegance';
      this.description = 'Full Management Access';
      this.eventsCount = '3';
      this.actionCards = [
        {
          icon: '📅',
          title: 'Create Event',
          description: 'Design and schedule your next exceptional event',
          meta: 'Quick Setup',
          metaIcon: 'far fa-clock',
          route: '/create-event',
          gradient: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)'
        },
        {
          icon: '🔧',
          title: 'Add Resources',
          description: 'Manage and organize your event inventory',
          meta: 'Inventory Control',
          metaIcon: 'fas fa-box',
          route: '/add-resource',
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
        },
        {
          icon: '🎯',
          title: 'Allocate Resources',
          description: 'Assign and distribute resources strategically',
          meta: 'Smart Assignment',
          metaIcon: 'fas fa-link',
          route: '/resource-allocate',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        {
          icon: '💬',
          title: 'Message Staff',
          description: 'Communicate with your team in real-time',
          meta: 'Team Chat',
          metaIcon: 'fas fa-users',
          route: '/staff-messages',
          gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
          badge: 3
        }
      ];
    } 
    else if (role === 'client') {
      this.displayRole = 'CLIENT';
      this.welcomeMessage = `Welcome, ${this.userName}`;
      this.subtitle = 'Manage your bookings and create memorable experiences';
      this.description = 'Client Account Access';
      this.eventsCount = '2';
      this.actionCards = [
        {
          icon: '📋',
          title: 'Booking Details',
          description: 'View your event bookings and status',
          meta: 'My Bookings',
          metaIcon: 'far fa-calendar-check',
          route: '/booking-details',
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
          icon: '📜',
          title: 'Event History',
          description: 'Review your past events and experiences',
          meta: 'Archives',
          metaIcon: 'fas fa-history',
          route: '/event-history',
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        }
      ];
    } 
    else if (role === 'staff') {
      this.displayRole = 'STAFF';
      this.welcomeMessage = `Welcome, ${this.userName}`;
      this.subtitle = 'View your assigned tasks and collaborate with the team';
      this.description = 'Staff Member Access';
      this.eventsCount = '5';
      this.actionCards = [
        {
          icon: '👀',
          title: 'View Events',
          description: 'See assigned events and your schedule',
          meta: 'Assigned Tasks',
          metaIcon: 'far fa-eye',
          route: '/view-events',
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        },
        {
          icon: '💬',
          title: 'Messages',
          description: 'Team communication & updates',
          meta: 'Chat',
          metaIcon: 'fas fa-comment-dots',
          route: '/event-messages',
          gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
          badge: 2
        },
        {
          icon: '✓',
          title: 'My Tasks',
          description: 'Track and manage your assigned duties',
          meta: 'To-Do List',
          metaIcon: 'fas fa-tasks',
          route: '/my-tasks',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        }
      ];
    } 
    else {
      this.displayRole = 'GUEST';
      this.welcomeMessage = `Welcome, ${this.userName}`;
      this.subtitle = 'Please log in to access your dashboard';
      this.description = 'Limited Access';
      this.eventsCount = '0';
      this.actionCards = [];
    }
  }

  dashboardView() {
    console.log("Dashboard View - Loading data");
    this.statename = {};
    
    // Add your API calls here if needed
    // Example:
    // this.httpService.getStatename().subscribe(
    //   (data: any) => {
    //     this.statename = data;
    //     console.log(this.statename);
    //   }, 
    //   error => {
    //     this.showError = true;
    //     this.errorMessage = "An error occurred while loading data";
    //     console.error('Dashboard error:', error);
    //   }
    // );
  }

  navigateTo(route: string) {
    if (route) {
      this.router.navigateByUrl(route);
    }
  }

  logout() {
    console.log("Logging out...");
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}