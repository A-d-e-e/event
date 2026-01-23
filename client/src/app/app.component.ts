
import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  IsLoggin: boolean = false;
  roleName: string | null;
  isScrolled: boolean = false; //Track scroll state
  mapUrl!: SafeResourceUrl;

  // constructor(private authService: AuthService, private router: Router) {
  //   this.IsLoggin = authService.getLoginStatus;
  //   this.roleName = authService.getRole;
  //   if (this.IsLoggin == false) {
  //     this.router.navigateByUrl('/landing-page');
  //   }
  // }

  // NEW: Listen to scroll events
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   this.isScrolled = window.pageYOffset > 20;
  // }

  // logout() {
  //   this.authService.logout();
  //   window.location.reload();
  // }

  // Your company location coordinates (replace with actual location)
  private readonly COMPANY_LAT = 20.2961;  // Bhubaneswar latitude
  private readonly COMPANY_LNG = 85.8245;  // Bhubaneswar longitude
  private readonly COMPANY_ADDRESS = 'Eventra, Sector V, Rephiral Road, 662-67, Bhubaneswar, Odisha';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer  // ADD THIS
  ) {
    this.IsLoggin = authService.getLoginStatus;
    this.roleName = authService.getRole;

    if (this.IsLoggin == false) {
      this.router.navigateByUrl('landing-page');
    }

    // INITIALIZE MAP URL
    this.mapUrl = this.getMapUrl();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20;
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }

  private getMapUrl(): SafeResourceUrl {
    // Google Maps Embed URL with your location
    const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.166331273406!2d80.17480247547859!3d13.025077713702748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526131a1bd6e9b%3A0x1f201e6b1009820!2sLTIMindtree%2C%20Innovation%20Campus!5e0!3m2!1sen!2sin!4v1769145118960!5m2!1sen!2sin`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  openMapInNewTab(): void {
    // Open Google Maps in new tab with directions
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${this.COMPANY_LAT},${this.COMPANY_LNG}`;
    window.open(googleMapsUrl, '_blank');
  }
}
 
 