// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { HttpService } from '../../services/http.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// export class HomeComponent implements OnInit {
//   @ViewChild('testimonialTrack') testimonialTrack!: ElementRef;

//   hoveredIndex: number | null = null;
//   currentTestimonialIndex = 0;
//   isAnimating = false;

//   // Event Types for Hero Frames
//   eventTypes = [
//     {
//       title: 'Weddings',
//       subtitle: 'Dream Ceremonies',
//       image: 'assets/events/wedding.jpg' // You'll need to add these images
//     },
//     {
//       title: 'Private Get-Togethers',
//       subtitle: 'Intimate Celebrations',
//       image: 'assets/events/private.jpg'
//     },
//     {
//       title: 'Festivals & Cultural',
//       subtitle: 'Cultural Excellence',
//       image: 'assets/events/festival.jpg'
//     },
//     {
//       title: 'Ceremonies & Expos',
//       subtitle: 'Grand Exhibitions',
//       image: 'assets/events/expo.jpg'
//     },
//     {
//       title: 'Corporate Events',
//       subtitle: 'Professional Excellence',
//       image: 'assets/events/corporate.jpg'
//     }
//   ];

//   // Statistics (will be populated from database)
//   stats = [
//     {
//       value: 0,
//       label: 'Events Organized',
//       icon: 'fas fa-calendar-check',
//       gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//     },
//     {
//       value: 0,
//       label: 'Professional Planners',
//       icon: 'fas fa-users',
//       gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
//     },
//     {
//       value: 0,
//       label: 'Expert Staff Members',
//       icon: 'fas fa-user-tie',
//       gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
//     }
//   ];

//   // Team Members
//   teamMembers = [
//     {
//       name: 'Nikita Rawat',
//       role: 'Awesome Cook',
//       image: 'assets/team/member1.jpg' // Placeholder - add your images
//     },
//     {
//       name: 'Aditya Pratap Singh',
//       role: 'Team Lead',
//       image: 'assets/team/member2.jpg'
//     },
//     {
//       name: 'Aaron Prakash',
//       role: 'Trustworthy Rizzler',
//       image: 'assets/team/member3.jpg'
//     },
//     {
//       name: 'Devanand B',
//       role: 'Mr. Steal-yo-girl',
//       image: 'assets/team/member4.jpg'
//     },
//     {
//       name: 'Shane Sunny',
//       role: 'Final Boss',
//       image: 'assets/team/member5.jpg'
//     }
//   ];

//   // Testimonials
//   testimonials = [
//     {
//       text: 'Working with EventHub was an absolute pleasure! They transformed our corporate event into something truly spectacular. The attention to detail and professionalism exceeded all our expectations.',
//       authorName: 'Anjali Mehta',
//       authorTitle: 'CEO, TechCorp India',
//       authorImage: 'assets/testimonials/person1.jpg',
//       rating: 5
//     },
//     {
//       text: 'Our wedding was a dream come true thanks to the EventHub team. From planning to execution, everything was flawless. They made our special day truly unforgettable!',
//       authorName: 'Rohan & Priya',
//       authorTitle: 'Happy Couple',
//       authorImage: 'assets/testimonials/person2.jpg',
//       rating: 5
//     },
//     {
//       text: 'The team handled our annual conference with such expertise and care. Every detail was perfect, and our attendees were thoroughly impressed. Highly recommended!',
//       authorName: 'Dr. Suresh Kumar',
//       authorTitle: 'Director, Medical Association',
//       authorImage: 'assets/testimonials/person3.jpg',
//       rating: 5
//     },
//     {
//       text: 'EventHub made our product launch a massive success. Their creativity and execution capabilities are top-notch. We will definitely work with them again!',
//       authorName: 'Neha Gupta',
//       authorTitle: 'Marketing Head, StartupXYZ',
//       authorImage: 'assets/testimonials/person4.jpg',
//       rating: 5
//     }
//   ];

//   constructor(private httpService: HttpService) {}

//   ngOnInit(): void {
//     this.loadStatistics();
//   }

//   // Load live statistics from database
//   loadStatistics(): void {
//     // Get total events
//     this.httpService.GetAllevents().subscribe(
//       (events: any) => {
//         this.stats[0].value = events.length;
//       },
//       error => console.error('Error loading events:', error)
//     );

//     // Get total planners (users with PLANNER role)
//     // You'll need to add this endpoint to your backend
//     this.httpService.getUsersByRole('PLANNER').subscribe(
//       (planners: any) => {
//         this.stats[1].value = planners.length;
//       },
//         (error: any) => {
//         console.error('Error loading planners:', error);
//         // Fallback to counting from users endpoint if available
//         this.stats[1].value = 15; // Placeholder
//       }
//     );

//     // Get total staff (users with STAFF role)
//     this.httpService.getUsersByRole('STAFF').subscribe(
//       (staff: any) => {
//         this.stats[2].value = staff.length;
//       },
//         (error: any) => {
//         console.error('Error loading staff:', error);
//         // Fallback
//         this.stats[2].value = 25; // Placeholder
//       }
//     );
//   }

//   // Testimonial Carousel Methods
//   nextTestimonial(): void {
//     if (this.isAnimating) return;
    
//     this.isAnimating = true;
//     this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
//     this.updateCarousel();
    
//     setTimeout(() => {
//       this.isAnimating = false;
//     }, 500);
//   }

//   previousTestimonial(): void {
//     if (this.isAnimating) return;
    
//     this.isAnimating = true;
//     this.currentTestimonialIndex = this.currentTestimonialIndex === 0 
//       ? this.testimonials.length - 1 
//       : this.currentTestimonialIndex - 1;
//     this.updateCarousel();
    
//     setTimeout(() => {
//       this.isAnimating = false;
//     }, 500);
//   }

//   goToTestimonial(index: number): void {
//     if (this.isAnimating || index === this.currentTestimonialIndex) return;
    
//     this.isAnimating = true;
//     this.currentTestimonialIndex = index;
//     this.updateCarousel();
    
//     setTimeout(() => {
//       this.isAnimating = false;
//     }, 500);
//   }

//   private updateCarousel(): void {
//     if (this.testimonialTrack) {
//       const offset = -this.currentTestimonialIndex * 100;
//       this.testimonialTrack.nativeElement.style.transform = `translateX(${offset}%)`;
//     }
//   }
// }



import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpClientJsonpModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('testimonialTrack') testimonialTrack!: ElementRef;

  hoveredIndex: number | null = null;
  currentTestimonialIndex = 0;
  isAnimating = false;
  autoScrollInterval: any;

  // Event Types for Hero Frames
  eventTypes = [
    {
      title: 'Weddings',
      subtitle: 'Dream Ceremonies',
      image: 'https://www.focuzstudios.in/wp-content/uploads/2017/11/tamil-wedding-photography-in-bangalore-1-9.jpg'
      // image: 'assets/events/wedding.jpg'
    },
    {
      title: 'Private Get-Togethers',
      subtitle: 'Intimate Celebrations',
      image: 'https://media.istockphoto.com/id/868935172/photo/heres-to-tonight.jpg?s=612x612&w=0&k=20&c=v1ceJ9aZwI43rPaQeceEx5L6ODyWFVwqxqpadC2ljG0='
    },
    {
      title: 'Festivals & Cultural',
      subtitle: 'Cultural Excellence',
      image: 'https://img.freepik.com/free-photo/portrait-holi-powder-colors-celebration_23-2151960850.jpg?semt=ais_hybrid&w=740&q=80'
    },
    {
      title: 'Ceremonies & Expos',
      subtitle: 'Grand Exhibitions',
      image: 'https://cdn.i-scmp.com/sites/default/files/styles/1020x680/public/d8/images/methode/2019/11/10/92a6b3ca-039a-11ea-ab68-c2fa11fa07a6_image_hires_201823.JPG?itok=SjBqvmYT&v=1573388310'
    },
    {
      title: 'Corporate Events',
      subtitle: 'Professional Excellence',
      image: 'https://pbs.twimg.com/media/G8dEhDmbQAE3tZU.jpg'
    }
  ];

  // Statistics (will be populated from database)
  stats = [
    {
      value: 0,
      label: 'Events Organized',
      icon: 'fas fa-calendar-check',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      value: 0,
      label: 'Professional Planners',
      icon: 'fas fa-users',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      value: 0,
      label: 'Expert Staff Members',
      icon: 'fas fa-user-tie',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      value: 0,
      label: 'Satisfied Clients',
      icon: 'fas fa-user-tie',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  // Team Members
  teamMembers = [
    {
      name: 'Nikita Rawat',
      role: 'Awesome Cook',
      // image: 'https://i.pravatar.cc/500?img=45'
      image: 'assets/team/Nikita.jpg'
    },
    {
      name: 'Aditya Pratap Singh',
      role: 'Team Lead',
      // image: 'https://i.pravatar.cc/500?img=12'
      image: 'assets/team/Aditya.jpg'
    },
    {
      name: 'Aaron Prakash',
      role: 'Trustworthy Rizzler',
      image: 'assets/team/Aaron.jpg'
    },
    {
      name: 'Devanand B',
      role: 'Mr. Steal-yo-girl',
      image: 'assets/team/Devanand.jpg'
    },
    {
      name: 'Shane Sunny',
      role: 'Final Boss',
      image: 'https://i.pravatar.cc/500?img=15'
    }
  ];

  // Testimonials
  testimonials = [
    {
      text: 'Working with EventHub was an absolute pleasure! They transformed our corporate event into something truly spectacular. The attention to detail and professionalism exceeded all our expectations.',
      authorName: 'Anjali Mehta',
      authorTitle: 'CEO, TechCorp India',
      authorImage: 'https://i.pravatar.cc/200?img=45',
      rating: 5
    },
    {
      text: 'Our wedding was a dream come true thanks to the EventHub team. From planning to execution, everything was flawless. They made our special day truly unforgettable!',
      authorName: 'Rohan & Priya',
      authorTitle: 'Happy Couple',
      authorImage: 'https://i.pravatar.cc/200?img=32',
      rating: 5
    },
    {
      text: 'The team handled our annual conference with such expertise and care. Every detail was perfect, and our attendees were thoroughly impressed. Highly recommended!',
      authorName: 'Dr. Suresh Kumar',
      authorTitle: 'Director, Medical Association',
      authorImage: 'https://i.pravatar.cc/200?img=68',
      rating: 5
    },
    {
      text: 'EventHub made our product launch a massive success. Their creativity and execution capabilities are top-notch. We will definitely work with them again!',
      authorName: 'Neha Gupta',
      authorTitle: 'Marketing Head, StartupXYZ',
      authorImage: 'https://i.pravatar.cc/200?img=47',
      rating: 5
    }
  ];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    // Clean up auto-scroll interval
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  // Load live statistics from database
  loadStatistics(): void {
    // Get COMPLETED events only
    this.httpService.GetAllevents().subscribe(
      (events: any) => {
        // Filter only completed events (REMOVED ON 19/01/2026)
        // const completedEvents = events.filter((event: any) => 
        //   event.status && event.status.toLowerCase() === 'completed'
        // );
        // this.stats[0].value = completedEvents.length;
        this.stats[0].value = events.length;

        // If no completed events, show total events count
        // if (completedEvents.length === 0) {
        if (events.length === 0) {
          this.stats[0].value = events.length;
          console.log('No completed events found. Showing total events:', events.length);
        }
      },
      error => {
        console.error('Error loading events:', error);
        this.stats[0].value = 2; // Fallback based on your database
      }
    );

    // Get total planners (users with PLANNER role)
    this.httpService.getUsersByRole('PLANNER').subscribe(
      (planners: any) => {
        this.stats[1].value = planners.length;
      },
      error => {
        console.error('Error loading planners:', error);
        // Fallback to manual count from your database
        this.stats[1].value = 4; // Based on your user table
      }
    );

    // Get total staff (users with STAFF role)
    this.httpService.getUsersByRole('STAFF').subscribe(
      (staff: any) => {
        this.stats[2].value = staff.length;
      },
      error => {
        console.error('Error loading staff:', error);
        // Fallback
        this.stats[2].value = 1; // Based on your user table
      }
    );

    this.httpService.getUsersByRole('CLIENT').subscribe(
      (staff: any) => {
        this.stats[3].value = staff.length;
      },
      error => {
        console.error('Error loading staff:', error);
        // Fallback
        this.stats[3].value = 404; // Based on your user table
      }
    );
  }

  // Auto-scroll testimonials every 3 seconds
  startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (!this.isAnimating) {
        this.nextTestimonial();
      }
    }, 3000); // 3 seconds
  }

  // Pause auto-scroll when user interacts
  pauseAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  // Resume auto-scroll after user interaction
  resumeAutoScroll(): void {
    this.pauseAutoScroll();
    this.startAutoScroll();
  }

  // Testimonial Carousel Methods
  nextTestimonial(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
    this.updateCarousel();
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  previousTestimonial(): void {
    if (this.isAnimating) return;
    
    this.pauseAutoScroll();
    this.isAnimating = true;
    this.currentTestimonialIndex = this.currentTestimonialIndex === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonialIndex - 1;
    this.updateCarousel();
    
    setTimeout(() => {
      this.isAnimating = false;
      this.resumeAutoScroll();
    }, 600);
  }

  goToTestimonial(index: number): void {
    if (this.isAnimating || index === this.currentTestimonialIndex) return;
    
    this.pauseAutoScroll();
    this.isAnimating = true;
    this.currentTestimonialIndex = index;
    this.updateCarousel();
    
    setTimeout(() => {
      this.isAnimating = false;
      this.resumeAutoScroll();
    }, 600);
  }

  private updateCarousel(): void {
    if (this.testimonialTrack) {
      const offset = -this.currentTestimonialIndex * 100;
      this.testimonialTrack.nativeElement.style.transform = `translateX(${offset}%)`;
    }
  }
}