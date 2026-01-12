// import { Component, OnInit } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { HttpService } from '../../services/http.service';

// @Component({
//   selector: 'app-dashbaord',
//   templateUrl: './dashbaord.component.html',
//   styleUrls: ['./dashbaord.component.scss']
// })
// export class DashbaordComponent implements OnInit {
//   statename: any = {}
//   showError: any;
//   errorMessage: any;
//   stateIdMd: any;
//   roleName: string | null;
  
  
//   totalEvents: number = 0;
//   totalResources: number = 0;
//   totalAllocations: number = 0;
//   activeEvents: number = 0;
  
  
//   scheduledEvents: number = 0;
//   completedEvents: number = 0;
//   upcomingEvents: number = 0;
  
  
//   totalBookings: number = 0;
//   pendingBookings: number = 0;
//   confirmedBookings: number = 0;
//   upcomingBookings: number = 0;
  
//   constructor(
//     public router: Router, 
//     public httpService: HttpService, 
//     private formBuilder: FormBuilder, 
//     private authService: AuthService
//   ) {
//     console.log("Constructor");
//     this.roleName = authService.getRole;
//   }
  
//   ngOnInit(): void {
//     console.log("ngOnInit");
//     this.dashboardView();
//     this.loadStatistics();
//   }

//   dashboardView() {
//     console.log(this.stateIdMd);
//     console.log("stateMd Call");
//     this.statename = {};
//     this.httpService.getStatename().subscribe((data: any) => {
//       this.statename = data;
//       console.log(this.statename);
//     }, error => {
//       this.showError = true;
//       this.errorMessage = "An error occurred while searching in. Please try again later or no record found";
//       console.error('Login error:', error);
//     });
//   }

//   loadStatistics() {
//     if (this.roleName === 'PLANNER') {
//       this.loadPlannerStats();
//     } else if (this.roleName === 'STAFF') {
//       this.loadStaffStats();
//     } else if (this.roleName === 'CLIENT') {
//       this.loadClientStats();
//     }
//   }

//   loadPlannerStats() {
    
//     this.httpService.getAllEvents().subscribe(
//       (events: any) => {
//         this.totalEvents = events.length;
//         this.activeEvents = events.filter((e: any) => 
//           e.status === 'Scheduled' || e.status === 'Active'
//         ).length;
        
      
//         this.scheduledEvents = events.filter((e: any) => e.status === 'Scheduled').length;
//         this.completedEvents = events.filter((e: any) => e.status === 'Completed').length;
        
       
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); 
//         const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
//         this.upcomingEvents = events.filter((e: any) => {
//           if (e.status !== 'Scheduled') return false;
//           const eventDate = new Date(e.dateTime);
//           eventDate.setHours(0, 0, 0, 0); 
//           return eventDate >= today && eventDate <= next30Days;
//         }).length;
        
        
//         this.totalAllocations = events.reduce((total: number, event: any) => {
//           return total + (event.allocations ? event.allocations.length : 0);
//         }, 0);
//       },
//       (error: any) => console.error('Error loading events:', error)
//     );

    
//     this.httpService.getAllResources().subscribe(
//       (resources: any) => {
//         this.totalResources = resources.length;
//       },
//       (error: any) => console.error('Error loading resources:', error)
//     );
//   }

//   loadStaffStats() {
    
//     this.httpService.getAllEvents().subscribe(
//       (events: any) => {
//         this.totalEvents = events.length;
        
        
//         this.activeEvents = events.filter((e: any) => 
//           e.status === 'Scheduled' || e.status === 'Active'
//         ).length;
        
//         this.scheduledEvents = events.filter((e: any) => e.status === 'Scheduled').length;
//         this.completedEvents = events.filter((e: any) => e.status === 'Completed').length;
        
        
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); 
//         const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
//         this.upcomingEvents = events.filter((e: any) => {
//           if (e.status !== 'Scheduled') return false;
//           const eventDate = new Date(e.dateTime);
//           eventDate.setHours(0, 0, 0, 0); 
//           return eventDate >= today && eventDate <= next30Days;
//         }).length;
//       },
//       (error: any) => console.error('Error loading events:', error)
//     );
//   }

//   loadClientStats() {
    
//     this.httpService.getMyBookings().subscribe(
//       (bookings: any) => {
//         this.totalBookings = bookings.length;
//         this.pendingBookings = bookings.filter((b: any) => 
//           b.status === 'PENDING' || b.status === 'Pending'
//         ).length;
//         this.confirmedBookings = bookings.filter((b: any) => 
//           b.status === 'CONFIRMED' || b.status === 'Confirmed'
//         ).length;
        
        
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); 
//         this.upcomingBookings = bookings.filter((b: any) => {
//           if (b.status !== 'CONFIRMED' && b.status !== 'Confirmed') return false;
//           if (!b.event) return false;
          
//           const eventDate = new Date(b.event.dateTime || b.event.date);
//           if (isNaN(eventDate.getTime())) return false; 
//           eventDate.setHours(0, 0, 0, 0); 
//           return eventDate >= today;
//         }).length;
//       },
//       error => {
//         console.error('Error loading bookings:', error);
        
//         this.totalBookings = 0;
//         this.pendingBookings = 0;
//         this.confirmedBookings = 0;
//         this.upcomingBookings = 0;
//       }
//     );
//   }

//   scrollToBookings() {
//     const element = document.getElementById('bookings-section');
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   }

//   scrollToEvents() {
//     const element = document.getElementById('events-section');
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   }

//   logout() {
//     this.authService.logout();
//     this.router.navigateByUrl('/login');
//   }
// }

// // import { Component, OnInit } from '@angular/core';
// // import { AuthService } from '../../services/auth.service';

// // @Component({
// //   selector: 'app-dashbaord',
// //   templateUrl: './dashbaord.component.html',
// //   styleUrls: ['./dashbaord.component.scss']
// // })
// // export class DashbaordComponent implements OnInit{
// //  isLoggedIn: boolean = false;
// //   roleName: string = '';

  
// //   isPlanner: boolean = false;
// //   isStaff: boolean = false;
// //   isClient: boolean = false;

// //   constructor(private authService: AuthService) {}

// //   ngOnInit(): void {
   
// //     this.isLoggedIn = this.authService.getLoginStatus();

   
// //     this.roleName = this.authService.getRole() || '';

   
// //     this.isPlanner = this.roleName === 'PLANNER';
// //     this.isStaff = this.roleName === 'STAFF';
// //     this.isClient = this.roleName === 'CLIENT';
// //   }

// //   logout(): void {
// //     this.authService.logout();
// //     this.isLoggedIn = false;
// //     this.roleName = '';
// //   }
// // }



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
// import { AuthService } from '../services/auth.service';
// import { HttpService } from '../services/http-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  isLogin: boolean = false;
  roleName: string | null = null;

  eventList: any[] = [];
  resourceList: any[] = [];

  showError: boolean = false;
  errorMessage: any;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check login status
    this.isLogin = this.authService.getLoginStatus;
    this.roleName = this.authService.getRole;

    if (!this.isLogin) {
      this.router.navigate(['/login']);
      return;
    }

    // Load dashboard data based on role
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (this.roleName === 'PLANNER') {
      this.loadEvents();
      this.loadResources();
    }

    if (this.roleName === 'STAFF') {
      this.loadEvents();
    }

    if (this.roleName === 'CLIENT') {
      // Client-specific dashboard logic can be added here
      this.loadEvents();
    }
  }

  loadEvents(): void {
    this.httpService.getAllEvents().subscribe({
      next: res => {
        this.eventList = res;
        this.showError = false;
      },
      error: err => {
        this.showError = true;
        this.errorMessage = err.message;
      }
    });
  }

  loadResources(): void {
    this.httpService.getAllResources().subscribe({
      next: res => {
        this.resourceList = res;
        this.showError = false;
      },
      error: err => {
        this.showError = true;
        this.errorMessage = err.message;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    window.location.reload();
  }
}