import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statename: any = {}
  showError: any;
  errorMessage: any;
  stateIdMd: any;
  roleName: string | null;
  constructor(public router: Router, public httpService: HttpService, private formBuilder: FormBuilder, private authService: AuthService) {
    console.log("Constructor");
    this.roleName = authService.getRole;
  }
  ngOnInit(): void {
    console.log("ngOnInit");
    this.dashboardView();
  }

  dashboardView() {
    console.log(this.stateIdMd);
    debugger;

    console.log("stateMd Call");
    this.statename = {};
    this.httpService.getStatename().subscribe((data: any) => {
      this.statename = data;
      console.log(this.statename);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred while searching in. Please try again later or no record found";
      console.error('Login error:', error);
    });;
  }
}