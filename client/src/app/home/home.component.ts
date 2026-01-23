import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpClientJsonpModule } from '@angular/common/http';
import { Router } from '@angular/router';

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
      image: 'assets/events/wedding.jpg',
      sectionId: 'weddings'
    },
    {
      title: 'Private Get-Togethers',
      subtitle: 'Intimate Celebrations',
      image: 'assets/events/get_together.avif',
      sectionId: 'private'
    },
    {
      title: 'Festivals & Cultural',
      subtitle: 'Cultural Excellence',
      image: 'assets/events/festival.avif',
      sectionId: 'festivals'
    },
    {
      title: 'Concerts',
      subtitle: 'Grand Exhibitions',
      image:'assets/events/concert.avif',
      sectionId: 'concerts'
    },
    {
      title: 'Corporate Events',
      subtitle: 'Professional Excellence',
      image:'assets/events/corporate.avif',
      sectionId: 'corporate'
    }
  ];

  // Statistics (will be populated from database)
  stats = [
    {
      value: 0,
      label: 'Events Organized',
      icon: 'fas fa-calendar-check',
      gradient: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)'
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
      role: ' ',
      image: 'assets/team/Nikita.jpg'
    },
    {
      name: 'Aditya Pratap Singh',
      role: ' ',
      image: 'assets/team/Aditya.jpg'
    },
    {
      name: 'Aaron Prakash',
      role: ' ',
      image: 'assets/team/Aaron.jpg'
    },
    {
      name: 'Devanand B',
      role: ' ',
      image: 'assets/team/Devanand.jpg'
    },
    {
      name: 'Shane Sunny',
      role: ' ',
      image: 'assets/team/Shane.jpg'
    }
  ];

  // Testimonials - will be loaded from database
  testimonials: any[] = [];
  
  // Fallback testimonials if no feedbacks exist
  fallbackTestimonials = [
    {
      feedbackText: 'Working with EventHub was an absolute pleasure! They transformed our corporate event into something truly spectacular. The attention to detail and professionalism exceeded all our expectations.',
      customerName: 'Anjali Mehta',
      customerEmail: 'anjali.mehta@techcorp.in',
      rating: 5,
      authorImage: 'https://i.pravatar.cc/200?img=45'
    },
    {
      feedbackText: 'Our wedding was a dream come true thanks to the EventHub team. From planning to execution, everything was flawless. They made our special day truly unforgettable!',
      customerName: 'Rohan & Priya',
      customerEmail: 'rohan.priya@wedding.com',
      rating: 5,
      authorImage: 'https://i.pravatar.cc/200?img=32'
    },
    {
      feedbackText: 'The team handled our annual conference with such expertise and care. Every detail was perfect, and our attendees were thoroughly impressed. Highly recommended!',
      customerName: 'Dr. Suresh Kumar',
      customerEmail: 'suresh.kumar@medical.org',
      rating: 5,
      authorImage: 'https://i.pravatar.cc/200?img=68'
    }
  ];

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadLatestFeedbacks();
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    // Clean up auto-scroll interval
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  // Load latest 3 feedbacks from database
  loadLatestFeedbacks(): void {
    this.httpService.getAllFeedbacks().subscribe(
      (feedbacks: any[]) => {
        console.log('Raw feedbacks from API:', feedbacks);
        
        if (feedbacks && feedbacks.length > 0) {
          // Take only the latest 3 feedbacks and add avatar images
          this.testimonials = feedbacks.slice(0, 3).map((feedback: any, index: number) => ({
            ...feedback,
            authorImage: this.getRandomAvatar(index)
          }));
          
          console.log('Loaded testimonials:', this.testimonials);
        } else {
          // Use fallback testimonials if no feedbacks exist
          this.testimonials = this.fallbackTestimonials;
          console.log('No feedbacks found, using fallback testimonials');
        }
      },
      error => {
        console.error('Error loading feedbacks:', error);
        // Use fallback testimonials on error
        this.testimonials = this.fallbackTestimonials;
      }
    );
  }

  // Generate random avatar for testimonials
  private getRandomAvatar(index: number): string {
    const avatarIds = [45, 32, 68, 47, 28, 15, 22, 38, 51, 64];
    const randomId = avatarIds[index % avatarIds.length];
    return `https://i.pravatar.cc/200?img=${randomId}`;
  }

  // Helper method to get star array for ratings
  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  // Load live statistics from database
  loadStatistics(): void {
    // Get all events
    this.httpService.GetAllevents().subscribe(
      (events: any) => {
        // Filter only completed events
        const completedEvents = events.filter((event: any) => 
          event.status && event.status.toLowerCase() === 'completed'
        );
        
        // Show total events count
        this.stats[0].value = events.length;

        if (completedEvents.length === 0) {
          console.log('No completed events found. Showing total events:', events.length);
        }
      },
      error => {
        console.error('Error loading events:', error);
        this.stats[0].value = 0;
      }
    );

    // Get total planners (users with PLANNER role)
    this.httpService.getUsersByRole('PLANNER').subscribe(
      (planners: any) => {
        this.stats[1].value = planners.length;
      },
      error => {
        console.error('Error loading planners:', error);
        this.stats[1].value = 0;
      }
    );

    // Get total staff (users with STAFF role)
    this.httpService.getUsersByRole('STAFF').subscribe(
      (staff: any) => {
        this.stats[2].value = staff.length;
      },
      error => {
        console.error('Error loading staff:', error);
        this.stats[2].value = 0;
      }
    );

    // Get total clients (users with CLIENT role)
    this.httpService.getUsersByRole('CLIENT').subscribe(
      (clients: any) => {
        this.stats[3].value = clients.length;
      },
      error => {
        console.error('Error loading clients:', error);
        this.stats[3].value = 0;
      }
    );
  }

  // Gallery navigation
  navigateToGallery(sectionId: string): void {
    this.router.navigate(['/gallery'], { fragment: sectionId });
  }

  // Auto-scroll testimonials every 3 seconds
  startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (!this.isAnimating && this.testimonials.length > 0) {
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
    if (this.isAnimating || this.testimonials.length === 0) return;
    
    this.isAnimating = true;
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
    this.updateCarousel();
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  previousTestimonial(): void {
    if (this.isAnimating || this.testimonials.length === 0) return;
    
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
    if (this.isAnimating || index === this.currentTestimonialIndex || this.testimonials.length === 0) return;
    
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
    if (this.testimonialTrack && this.testimonials.length > 0) {
      const offset = -this.currentTestimonialIndex * 100;
      this.testimonialTrack.nativeElement.style.transform = `translateX(${offset}%)`;
    }
  }
}