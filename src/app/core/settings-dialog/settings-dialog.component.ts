import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
  constructor(private settingsService: SettingsService) {
    this.toggleControl = settingsService.theme == 'dark';
  }

  ngOnInit(): void {}

  toggleControl = false;

  onChange() {
    if (this.toggleControl) {
      this.settingsService.setDarkTheme();
    } else {
      this.settingsService.setLightTheme();
    }
  }
}
