import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const SETTINGS_LOCATION = 'assets/appsettings.json';

@Injectable({
  providedIn: 'root',
})
export class ApiUrlService {
  constructor(private http: HttpClient) {
    this.http.get(SETTINGS_LOCATION);
  }

  async loadUrl() {
    let value: any = await firstValueFrom(
      this.http.get('/assets/appsettings.json')
    );
    this.apiUrl = value.brokenHeart.url;
    return;
  }

  private apiUrl!: string;

  url() {
    return this.apiUrl;
  }
}
