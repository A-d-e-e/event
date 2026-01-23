import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface GalleryImage {
  url: string;
  alt: string;
  caption: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ]
})
export class GalleryComponent implements OnInit, AfterViewInit {
  
  activeSection: string = 'weddings';
  showLightbox: boolean = false;
  currentImageIndex: number = 0;
  currentCategory: string = '';
  currentGalleryImages: GalleryImage[] = [];
  showBackToTop: boolean = false;
  private fragmentToScroll: string | null = null;

  // WEDDING IMAGES
  weddingImages: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1764593821339-6be7cb85e7f6?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIyfHxFbGVnYW50JTIwb3V0ZG9vciUyMFdlZGRpbmclMjBDZXJlbW9ueXxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Elegant Wedding Ceremony',
      caption: 'Elegant Outdoor Wedding Ceremony'
    },
    {
      url: 'https://media.istockphoto.com/id/479977238/photo/table-setting-for-an-event-party-or-wedding-reception.webp?a=1&b=1&s=612x612&w=0&k=20&c=lD47--Ufel2c0H5h2s_Gw2Qe5I1PYyJVsFVC0RAhaR0=',
      alt: 'Wedding Reception Decor',
      caption: 'Luxurious Reception Setup'
    },
    {
      url: 'https://plus.unsplash.com/premium_photo-1682098451781-228995499d4d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8QmVhdXRpZnVsJTIwQnJpZGFsJTIwTW9tZW50fGVufDB8fDB8fHww',
      alt: 'Bridal Portrait',
      caption: 'Beautiful Bridal Moment'
    },
    {
      url: 'https://images.unsplash.com/photo-1766041696497-0b74155d85f7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY2fHxCZWF1dGlmdWwlMjBCcmlkYWwlMjBNb21lbnR8ZW58MHx8MHx8fDA%3D',
      alt: 'Wedding Venue',
      caption: 'Stunning Venue Decoration'
    },
    {
      url: 'https://images.unsplash.com/photo-1765615197689-69123216c455?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Sm95ZnVsJTIwV2VkZGluZyUyMENlbGVicmF0aW9ufGVufDB8fDB8fHww',
      alt: 'Wedding Celebration',
      caption: 'Joyful Wedding Celebration'
    },
    {
      url: 'https://media.istockphoto.com/id/1169564701/photo/bride-and-groom-dancing-their-first-dance.webp?a=1&b=1&s=612x612&w=0&k=20&c=xWprLB5YXObZxv2Lw41om8sdwkqFkJ1x22pUTa-o5jY=',
      alt: 'Reception Dance Floor',
      caption: 'Dancing Under the Stars'
    }
  ];

  // PRIVATE GET-TOGETHER IMAGES
  privateImages: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1755704282977-340323fa52df?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEJpcnRoZGF5JTIwQ2VsZWJyYXRpb24lMjBzZXR1cHxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Private Party Celebration',
      caption: 'Birthday Celebration'
    },
    {
      url: 'https://media.istockphoto.com/id/2184980443/photo/happy-and-young-friends-enjoying-picnic-in-the-nature-woods-with-food-drinks-guitar-and-books.webp?a=1&b=1&s=612x612&w=0&k=20&c=dXUyiTwpbPHTP6ngDfiiAPntyQN4bmR8_kaSEgs0JLI=',
      alt: 'Garden Party',
      caption: 'Elegant Garden Gathering'
    },
    {
      url: 'https://media.istockphoto.com/id/576603548/photo/it-was-a-meal-to-remember.webp?a=1&b=1&s=612x612&w=0&k=20&c=LQk6N6Le1mD9uA12JvUdde0wNxFAy1lY2PeOfndgX58=',
      alt: 'Private Dinner',
      caption: 'Exclusive Dinner Party'
    },
    {
      url: 'https://images.unsplash.com/photo-1765582870011-ff3cfdb06700?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RnJpZW5kcyUyMCUyNiUyMEZhbWlseSUyMFJldW5pb258ZW58MHx8MHx8fDA%3D',
      alt: 'Friends Celebration',
      caption: 'Friends & Family Reunion'
    },
    {
      url: 'https://plus.unsplash.com/premium_photo-1711044546664-04e0118383ec?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEFubml2ZXJzYXJ5JTIwUGFydHl8ZW58MHx8MHx8fDA%3D',
      alt: 'Anniversary Party',
      caption: 'Golden Anniversary Celebration'
    },
    {
      url: 'https://images.unsplash.com/photo-1692261874907-a50930aa2972?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cm9vZnRvcCUyMHBhcnR5fGVufDB8fDB8fHww',
      alt: 'Rooftop Party',
      caption: 'Rooftop Soirée Under Sunset'
    }
  ];

  // FESTIVAL & CULTURAL IMAGES
  festivalImages: GalleryImage[] = [
    {
      url: 'https://plus.unsplash.com/premium_photo-1682090848092-64fb81b60ac5?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGN1bHR1cmFsJTIwZmVzdGl2YWwlMjBjZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Cultural Festival',
      caption: 'Vibrant Holi Celebration'
    },
    {
      url: 'https://images.unsplash.com/photo-1585302397841-b42e837d0d81?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VHJhZGl0aW9uYWwlMjBEYW5jZXxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Traditional Dance',
      caption: 'Traditional Folk Dance Performance'
    },
    {
      url: 'https://plus.unsplash.com/premium_photo-1729038880168-b9123602b10b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fERpd2FsaSUyMExpZ2h0cyUyMEZlc3RpdmFsfGVufDB8fDB8fHww', 
      alt: 'Festival Lights',
      caption: 'Diwali Lights Festival'
    },
    {
      url: 'https://images.unsplash.com/photo-1761299167698-d2283f61a52f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGN1bHR1cmFsJTIwZXZlbnR8ZW58MHx8MHx8fDA%3D',
      alt: 'Cultural Procession',
      caption: 'Grand Cultural Procession'
    },
    {
      url: 'https://plus.unsplash.com/premium_photo-1683121624323-0c5bf3ca6af2?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmVzdGl2YWwlMjBGb29kJTIwU3RhbGxzfGVufDB8fDB8fHww',
      alt: 'Festival Food Stalls',
      caption: 'Traditional Food Festival'
    },
    {
      url: 'https://images.unsplash.com/photo-1661061963531-dea4b69a9070?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SGVyaXRhZ2UlMjBEYXklMjBDZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Cultural Heritage Event',
      caption: 'Heritage Day Celebration'
    }
  ];

  // CONCERT IMAGES
  concertImages: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1598387994710-5a7e32088b49?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fExpdmUlMjBDb25jZXJ0fGVufDB8fDB8fHww',
      alt: 'Live Concert',
      caption: 'Electrifying Live Performance'
    },
    {
      url: 'https://images.unsplash.com/photo-1692271916392-91f71cd48bc7?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q3Jvd2QlMjBzaG91dGluZyUyMGluJTIwY29uY2VydHxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Concert Crowd',
      caption: 'Crowd Going Wild'
    },
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fENvbmNlcnQlMjBDcm93ZHxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Stage Lights',
      caption: 'Spectacular Stage Lighting'
    },
    {
      url: 'https://media.istockphoto.com/id/2185400651/photo/rock-musicians-in-fashionable-outfits-performing-alternative-or-punk-rock-music-on-festival.webp?a=1&b=1&s=612x612&w=0&k=20&c=Pcke0KkXGq9x0ca5UKcCSRJ1sf00dzvqdK_EZHV1eo4=',
      alt: 'Music Festival',
      caption: 'Open Air Music Festival'
    },
    {
      url: 'https://images.unsplash.com/photo-1768943913426-92ddefdbf440?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fERKJTIwUGVyZm9ybWFuY2V8ZW58MHx8MHx8fDA%3D',
      alt: 'DJ Performance',
      caption: 'DJ Set Under Neon Lights'
    },
    {
      url: 'https://media.istockphoto.com/id/1491722807/photo/singer-man-singing-in-a-music-concert.webp?a=1&b=1&s=612x612&w=0&k=20&c=Efx5NwA6TQpIP57LbXlPineTxx9BNIYlIcF_tcAA_2I=',
      alt: 'Rock Concert',
      caption: 'Rock Band Live on Stage'
    }
  ];

  // CORPORATE EVENT IMAGES
  corporateImages: GalleryImage[] = [
    {
      url: 'https://plus.unsplash.com/premium_photo-1661486753881-2b57f669545b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fENvcnBvcmF0ZSUyMENvbmZlcmVuY2V8ZW58MHx8MHx8fDA%3D',
      alt: 'Corporate Conference',
      caption: 'Annual Business Conference'
    },
    {
      url: 'https://images.unsplash.com/photo-1768448808550-3148cce53a19?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEJ1c2luZXNzJTIwU2VtaW5hcnxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Business Seminar',
      caption: 'Executive Leadership Seminar'
    },
    {
      url: 'https://images.unsplash.com/photo-1768508950790-3bbdfe3973c1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q29ycG9yYXRlJTIwR2FsYXxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Corporate Gala',
      caption: 'Corporate Awards Gala'
    },
    {
      url: 'https://plus.unsplash.com/premium_photo-1705717319473-0759c1b3f74e?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFRlYW0lMjBCdWlsZGluZyUyMFdvcmtzaG9wfGVufDB8fDB8fHww',
      alt: 'Team Building Event',
      caption: 'Team Building Workshop'
    },
    {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uZmVyZW5jZXxlbnwwfHwwfHx8MA%3D%3D',
      alt: 'Product Launch',
      caption: 'Grand Product Launch Event'
    },
    {
      url: 'https://media.istockphoto.com/id/2193429892/photo/group-of-friends-at-tropical-restaurant-picking-food-and-drinks-from-menu-smiling-women.webp?a=1&b=1&s=612x612&w=0&k=20&c=D9q-pX1PG-NJT8IcjvBy2dgDh0Rs2-tIw8NUpYuQf1M=',
      alt: 'Networking Event',
      caption: 'Professional Networking Evening'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check if there's a route fragment to scroll to
    this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        this.fragmentToScroll = fragment;
        // this.scrollToSection(fragment);
        this.activeSection = fragment;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.fragmentToScroll) {
      setTimeout(() => {
      this.scrollToSection(this.fragmentToScroll!);
      this.fragmentToScroll = null;
      }, 100);
    }
  }

  // Scroll detection for active nav and back-to-top button
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Show back to top button after scrolling 300px
    this.showBackToTop = window.pageYOffset > 300;

    // Update active section based on scroll position
    const sections = ['weddings', 'private', 'festivals', 'concerts', 'corporate'];
    const scrollPosition = window.pageYOffset + 200;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    // const element = document.getElementById(sectionId);
    // if (element) {
    //   const yOffset = -100; // Offset for fixed header
    //   const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    //   window.scrollTo({ top: y, behavior: 'smooth' });
    // }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -100; // Offset for fixed header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 0);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openLightbox(category: string, index: number): void {
    this.currentCategory = category;
    this.currentImageIndex = index;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Set current gallery based on category
    switch (category) {
      case 'weddings':
        this.currentGalleryImages = this.weddingImages;
        break;
      case 'private':
        this.currentGalleryImages = this.privateImages;
        break;
      case 'festivals':
        this.currentGalleryImages = this.festivalImages;
        break;
      case 'concerts':
        this.currentGalleryImages = this.concertImages;
        break;
      case 'corporate':
        this.currentGalleryImages = this.corporateImages;
        break;
    }
  }

  closeLightbox(): void {
    this.showLightbox = false;
    document.body.style.overflow = 'auto'; // Re-enable background scroll
  }

  nextImage(): void {
    if (this.currentImageIndex < this.currentGalleryImages.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  // Keyboard navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (this.showLightbox) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.previousImage();
      }
    }
  }
}