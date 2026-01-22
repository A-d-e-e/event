
import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  IsLoggin: boolean = false;
  roleName: string | null;
  isScrolled: boolean = false; // NEW: Track scroll state

  constructor(private authService: AuthService, private router: Router) {
    this.IsLoggin = authService.getLoginStatus;
    this.roleName = authService.getRole;
    if (this.IsLoggin == false) {
      this.router.navigateByUrl('/landing-page');
    }
  }

  // NEW: Listen to scroll events
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20;
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}