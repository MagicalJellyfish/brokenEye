import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiscordUidEditComponent } from '../discord-uid-edit/discord-uid-edit.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatIcon,
    MatIconButton,
    MatTooltip,
    NgIf,
  ],
})
export class TopbarComponent implements OnInit {
  constructor(
    protected userService: UserService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  openSettings() {
    this.matDialog.open(SettingsDialogComponent);
  }

  logout() {
    this.userService.logout();
    this.snackBar.open('Logged out!', undefined, { duration: 2000 });
  }

  changeDiscordUserId() {
    this.matDialog.open(DiscordUidEditComponent);
  }
}
