import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private isLoggedIn: boolean = false;
  
  constructor() { }
  
  saveToken(token: string): void {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }
  
  setRole(role: any): void {
    localStorage.setItem('role', role);
  }
  
  get getRole(): string | null {
    return localStorage.getItem('role');
  }
  
  SetId(id: any): void {
    localStorage.setItem('id', id);
  }
  
  get getId(): string | null {
    return localStorage.getItem('id');
  }
  
  // NEW METHOD: Store username
  setUsername(username: any): void {
    localStorage.setItem('username', username);
  }
  
  // NEW METHOD: Get username
  get getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }
  
  // NEW METHOD: Store email (optional)
  setEmail(email: any): void {
    localStorage.setItem('email', email);
  }
  
  // NEW METHOD: Get email (optional)
  get getEmail(): string | null {
    return localStorage.getItem('email');
  }
  
  get getLoginStatus(): boolean {
    return !!localStorage.getItem('token');
  }
  
  getToken(): string | null {
    this.token = localStorage.getItem('token');
    return this.token;
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.token = null;
    this.isLoggedIn = false;
  }
}