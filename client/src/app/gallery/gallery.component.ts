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
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      alt: 'Elegant Wedding Ceremony',
      caption: 'Elegant Outdoor Wedding Ceremony'
    },
    {
      url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
      alt: 'Wedding Reception Decor',
      caption: 'Luxurious Reception Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
      alt: 'Bridal Portrait',
      caption: 'Beautiful Bridal Moment'
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
      alt: 'Wedding Venue',
      caption: 'Stunning Venue Decoration'
    },
    {
      url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=600&fit=crop',
      alt: 'Wedding Celebration',
      caption: 'Joyful Wedding Celebration'
    },
    {
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&h=600&fit=crop',
      alt: 'Reception Dance Floor',
      caption: 'Dancing Under the Stars'
    }
  ];

  // PRIVATE GET-TOGETHER IMAGES
  privateImages: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
      alt: 'Private Party Celebration',
      caption: 'Intimate Birthday Celebration'
    },
    {
      url: 'https://images.unsplash.com/photo-1464983308783-cb61a84180b7?w=800&h=600&fit=crop',
      alt: 'Garden Party',
      caption: 'Elegant Garden Gathering'
    },
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop',
      alt: 'Private Dinner',
      caption: 'Exclusive Dinner Party'
    },
    {
      url: 'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=800&h=600&fit=crop',
      alt: 'Friends Celebration',
      caption: 'Friends & Family Reunion'
    },
    {
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop',
      alt: 'Anniversary Party',
      caption: 'Golden Anniversary Celebration'
    },
    {
      url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=600&fit=crop',
      alt: 'Rooftop Party',
      caption: 'Rooftop Soirée Under Sunset'
    }
  ];

  // FESTIVAL & CULTURAL IMAGES
  festivalImages: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
      alt: 'Cultural Festival',
      caption: 'Vibrant Holi Celebration'
    },
    {
      url: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800&h=600&fit=crop',
      alt: 'Traditional Dance',
      caption: 'Traditional Folk Dance Performance'
    },
    {
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
      alt: 'Festival Lights',
      caption: 'Diwali Lights Festival'
    },
    {
      url: 'https://images.unsplash.com/photo-1545989176-fb1b67bea1a0?w=800&h=600&fit=crop',
      alt: 'Cultural Procession',
      caption: 'Grand Cultural Procession'
    },
    {
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      alt: 'Festival Food Stalls',
      caption: 'Traditional Food Festival'
    },
    {
      url: 'https://images.unsplash.com/photo-1533167649158-6d508895b680?w=800&h=600&fit=crop',
      alt: 'Cultural Heritage Event',
      caption: 'Heritage Day Celebration'
    }
  ];

  // CONCERT IMAGES
  concertImages: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
      alt: 'Live Concert',
      caption: 'Electrifying Live Performance'
    },
    {
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
      alt: 'Concert Crowd',
      caption: 'Crowd Going Wild'
    },
    {
      url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
      alt: 'Stage Lights',
      caption: 'Spectacular Stage Lighting'
    },
    {
      url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
      alt: 'Music Festival',
      caption: 'Open Air Music Festival'
    },
    {
      url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=600&fit=crop',
      alt: 'DJ Performance',
      caption: 'DJ Set Under Neon Lights'
    },
    {
      url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
      alt: 'Rock Concert',
      caption: 'Rock Band Live on Stage'
    }
  ];

  // CORPORATE EVENT IMAGES
  corporateImages: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      alt: 'Corporate Conference',
      caption: 'Annual Business Conference'
    },
    {
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
      alt: 'Business Seminar',
      caption: 'Executive Leadership Seminar'
    },
    {
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
      alt: 'Corporate Gala',
      caption: 'Corporate Awards Gala'
    },
    {
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      alt: 'Team Building Event',
      caption: 'Team Building Workshop'
    },
    {
      url: 'https://images.unsplash.com/photo-1560523159-6b681a1af6c1?w=800&h=600&fit=crop',
      alt: 'Product Launch',
      caption: 'Grand Product Launch Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
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
