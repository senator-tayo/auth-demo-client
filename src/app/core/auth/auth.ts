import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
} from './models';

const ACCESS_TOKEN_KEY = 'authdemo_access_token';
const REFRESH_TOKEN_KEY = 'authdemo_refresh_token';
const EXPIRES_AT_KEY = 'authdemo_expires_at';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly apiUrl = 'http://localhost:5094/api/auth';

  private readonly accessTokenSignal = signal<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  readonly isAuthenticated = computed(() => !!this.accessTokenSignal());

  constructor(private http: HttpClient, private router: Router) {}

  get accessToken(): string | null {
    return this.accessTokenSignal();
  }

  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, request)
      .pipe(tap((res) => this.setSession(res.data)));
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
  return this.http
    .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request)
    .pipe(
      tap((res) => this.setSession(res.data))
    );
}
  refresh(): Observable<AuthResponse> {
    const request: RefreshRequest = { refreshToken: this.refreshToken ?? '' };
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, request)
      .pipe(tap((res) => this.setSession(res)));
  }

  logout(): void {
    const request: LogoutRequest = { refreshToken: this.refreshToken ?? '' };

    this.http.post(`${this.apiUrl}/logout`, request).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    localStorage.setItem(EXPIRES_AT_KEY, res.expiresAtUtc);
    this.accessTokenSignal.set(res.accessToken);
  }

  private clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    this.accessTokenSignal.set(null);
    this.router.navigate(['/login']);
  }
}