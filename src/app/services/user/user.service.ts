import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

type TokenResponse = {
  username: string;
  accessToken: string;
  accessTokenExpiration: number;
  refreshToken: string;
  refreshTokenExpiration: number;
};

const REFRESH_WEBLOCK = 'brokenEye-token-refresh';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {
    // React and update to other tabs changing login state
    window.addEventListener('storage', (event) => {
      // Tokens are taken from localStorage only anyway, but the username is shown and so the UI update needs to be triggered here
      if (event.key == 'username' || event.key == null) {
        this.usernameSignal.set(localStorage.getItem('username'));
      }
    });
  }

  // Promise for avoiding multiple simultaneous refreshes
  private refreshPromise: Promise<boolean> | null = null;

  // signal instead of getter like the tokens, so on auth changes in other tabs the UI can update the display
  private readonly usernameSignal = signal(localStorage.getItem('username'));
  public readonly username = this.usernameSignal.asReadonly();

  public get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public get accessTokenExpiration(): Date | null {
    const expiration = localStorage.getItem('accessTokenExpiration');
    return expiration == null ? null : new Date(+expiration);
  }

  public get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  public get refreshTokenExpiration(): Date | null {
    const expiration = localStorage.getItem('refreshTokenExpiration');
    return expiration == null ? null : new Date(+expiration);
  }

  public async initUser() {
    const accessTokenExpiration = this.accessTokenExpiration;
    const refreshTokenExpiration = this.refreshTokenExpiration;

    if (accessTokenExpiration != null && refreshTokenExpiration != null) {
      if (
        accessTokenExpiration < new Date() &&
        refreshTokenExpiration > new Date()
      ) {
        if (!(await this.refreshTokens(this.accessToken))) {
          this.logout();
        }
      } else if (refreshTokenExpiration < new Date()) {
        this.logout();
      }
    }
  }

  async register(
    username: string,
    password: string,
    discordId: number,
    registrationToken: string,
  ): Promise<boolean> {
    try {
      var response = await firstValueFrom(
        this.http.post('brokenAuth:/register', {
          username,
          password,
          discordId,
          registrationToken,
        }),
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

    this.clearTokens();
  }

  async getTokens(username: string, password: string): Promise<boolean> {
    try {
      var response = await firstValueFrom(
        this.http.post<TokenResponse>('brokenAuth:/login', {
          username,
          password,
        }),
      );

      this.storeTokens(response);
      return true;
    } catch (error) {
      return false;
    }
  }

  async refreshTokens(failedAccessToken: string | null): Promise<boolean> {
    if (this.refreshPromise == null) {
      this.refreshPromise = navigator.locks
        .request(REFRESH_WEBLOCK, () => this.refreshIfStale(failedAccessToken))
        .finally(() => (this.refreshPromise = null));
    }

    return await this.refreshPromise;
  }

  private async refreshIfStale(
    failedAccessToken: string | null,
  ): Promise<boolean> {
    const accessToken = this.accessToken;
    const refreshToken = this.refreshToken;

    // Did another tab remove the tokens?
    if (accessToken == null || refreshToken == null) {
      return false;
    }

    // Did another tab already refresh the tokens while this waited for the lock?
    if (
      accessToken != failedAccessToken &&
      (this.accessTokenExpiration ?? new Date(0)) > new Date()
    ) {
      return true;
    }

    try {
      var response = await firstValueFrom(
        this.http.post<TokenResponse>('brokenAuth:/refresh-token', {
          accessToken,
          refreshToken,
        }),
      );

      this.storeTokens(response);
      return true;
    } catch (error: any) {
      if (error.status == 0) {
        return true;
      }
      return false;
    }
  }

  private storeTokens(response: TokenResponse) {
    localStorage.setItem('username', response.username);
    this.usernameSignal.set(response.username);

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem(
      'accessTokenExpiration',
      response.accessTokenExpiration.toString(),
    );

    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem(
      'refreshTokenExpiration',
      response.refreshTokenExpiration.toString(),
    );
  }

  private clearTokens() {
    localStorage.removeItem('username');
    this.usernameSignal.set(null);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiration');

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiration');
  }
}
