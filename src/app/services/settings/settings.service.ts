import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(@Inject(DOCUMENT) private document: Document) {
    //Theme
    if (localStorage.getItem('theme') == 'light') {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  //Theme
  theme!: string;

  public setDarkTheme() {
    this.document.documentElement.classList.add('dark-theme');
    this.theme = 'dark';
    localStorage.setItem('theme', 'dark');
  }

  public setLightTheme() {
    this.document.documentElement.classList.remove('dark-theme');
    this.theme = 'light';
    localStorage.setItem('theme', 'light');
  }
}
