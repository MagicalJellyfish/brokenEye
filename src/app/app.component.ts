import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { UserService } from './services/user/user.service';
import { TopbarComponent } from './core/topbar/topbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [TopbarComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  //Initialize settings
  constructor(
    private settingsService: SettingsService,
    private userService: UserService
  ) {}
  title = 'brokenEye';

  ngOnInit(): void {}
}
