import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public initUser() {
    this.username = localStorage.getItem('username');
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');

    var accessExpirationString = localStorage.getItem('accessTokenExpiration');
    if (accessExpirationString != null) {
      this.accessTokenExpiration = new Date(
        +localStorage.getItem('accessTokenExpiration')!
      );
    }

    var refreshExpirationString = localStorage.getItem(
      'refreshTokenExpiration'
    );
    if (refreshExpirationString != null) {
      this.refreshTokenExpiration = new Date(
        +localStorage.getItem('refreshTokenExpiration')!
      );
    }

    if (
      this.accessTokenExpiration != null &&
      this.refreshTokenExpiration != null
    ) {
      if (
        this.accessTokenExpiration < new Date() &&
        this.refreshTokenExpiration > new Date()
      ) {
        this.refreshTokens().then((x) => {
          if (!x) {
            this.logout();
          }
        });
      } else if (this.refreshTokenExpiration < new Date()) {
        this.logout();
      }
    }
  }

  public username: string | null = null;
  public accessToken: string | null = null;
  public accessTokenExpiration: Date | null = null;
  public refreshToken: string | null = null;
  public refreshTokenExpiration: Date | null = null;

  async register(
    username: string,
    password: string,
    discordId: number,
    registrationToken: string
  ): Promise<boolean> {
    try {
      var response = await firstValueFrom(
        this.http.post('brokenAuth:/register', {
          username,
          password,
          discordId,
          registrationToken,
        })
      );

      return await this.getTokens(username, password);
    } catch (error) {
      return false;
    }
  }

  async logout() {
    var headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.accessToken);
    this.http.get('brokenAuth:/logout', { headers: headers }).subscribe();

    localStorage.removeItem('username');
    this.username = null;
    localStorage.removeItem('accessToken');
    this.accessToken = null;
    localStorage.removeItem('accessTokenExpiration');
    this.accessTokenExpiration = null;
    localStorage.removeItem('refreshToken');
    this.refreshToken = null;
    localStorage.removeItem('refreshTokenExpiration');
    this.refreshTokenExpiration = null;
  }

  async getTokens(username: string, password: string): Promise<boolean> {
    try {
      var response = await firstValueFrom(
        this.http.post<{
          username: string;
          accessToken: string;
          accessTokenExpiration: number;
          refreshToken: string;
          refreshTokenExpiration: number;
        }>('brokenAuth:/login', { username, password })
      );

      this.username = response.username;
      this.accessToken = response.accessToken;
      this.accessTokenExpiration = new Date(response.accessTokenExpiration);
      this.refreshToken = response.refreshToken;
      this.refreshTokenExpiration = new Date(response.refreshTokenExpiration);

      localStorage.setItem('username', response.username);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem(
        'accessTokenExpiration',
        response.accessTokenExpiration.toString()
      );
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem(
        'refreshTokenExpiration',
        response.refreshTokenExpiration.toString()
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  refreshing = false;
  refreshSubject: Subject<boolean> = new Subject<boolean>();

  async refreshTokens(): Promise<boolean> {
    if (this.refreshing) {
      return await firstValueFrom(this.refreshSubject);
    }

    this.refreshing = true;
    try {
      var response = await firstValueFrom(
        this.http.post<{
          username: string;
          accessToken: string;
          accessTokenExpiration: number;
          refreshToken: string;
          refreshTokenExpiration: number;
        }>('brokenAuth:/refresh-token', {
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
        })
      );

      this.username = response.username;
      this.accessToken = response.accessToken;
      this.accessTokenExpiration = new Date(response.accessTokenExpiration);
      this.refreshToken = response.refreshToken;
      this.refreshTokenExpiration = new Date(response.refreshTokenExpiration);

      localStorage.setItem('username', response.username);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem(
        'accessTokenExpiration',
        response.accessTokenExpiration.toString()
      );
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem(
        'refreshTokenExpiration',
        response.refreshTokenExpiration.toString()
      );

      this.refreshSubject.next(true);
      return true;
    } catch (error: any) {
      if (error.status == 0) {
        this.refreshSubject.next(true);
        return true;
      }
      this.refreshSubject.next(false);
      return false;
    } finally {
      this.refreshing = false;
    }
  }
}
