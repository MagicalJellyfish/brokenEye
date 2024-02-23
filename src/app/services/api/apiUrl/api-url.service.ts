import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const SETTINGS_LOCATION = "assets/appsettings.json";

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  constructor(private http: HttpClient) {
    this.http.get(SETTINGS_LOCATION)
  }

  loadUrl() {
    return this.http.get('/assets/appsettings.json').subscribe((x: any) => this.apiUrl = x.brokenHeart.url);
  }

  apiUrl!: string;
}