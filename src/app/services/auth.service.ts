import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }

  signup(username: string, password: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, { username, password, email });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Adjust based on your actual implementation
  }

  userLogIn(token: string): void {
    localStorage.setItem('token', token);
  }

  userLogout(): void {
    localStorage.removeItem('token');
  }
}
