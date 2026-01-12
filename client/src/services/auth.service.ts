// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   //todo: complete missing code..
// }




import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private isLoggedIn: boolean = false;

  /**
   * Saves the authentication token.
   * - Sets the token property and updates isLoggedIn to true.
   * - Stores the token in localStorage for persistence.
   */
  saveToken(token: string): void {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  /**
   * Sets the user’s role.
   * - Saves the user role to localStorage.
   */
  SetRole(role: any): void {
    localStorage.setItem('role', String(role));
  }

  /**
   * Retrieves the stored user role.
   * - Returns the user role from localStorage.
   */
  get getRole(): string | null {
    return localStorage.getItem('role');
  }

  /**
   * Checks if the user is logged in.
   * - Returns true if a token exists in localStorage, otherwise false.
   */
  get getLoginStatus(): boolean {
    const storedToken = localStorage.getItem('token');
    return !!storedToken;
  }

  /**
   * Retrieves the authentication token.
   * - Fetches the token from localStorage and updates the token property.
   */
  getToken(): string | null {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  /**
   * Logs the user out and clears session data.
   * - Removes the token and role from localStorage.
   * - Resets token and isLoggedIn properties.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.token = null;
    this.isLoggedIn = false;
  }
}
``

