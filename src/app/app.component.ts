import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  //Initialize settings
  constructor(private settingsService: SettingsService, private userService: UserService) {}
  title = 'brokenEye';

  ngOnInit(): void {
  }
}
