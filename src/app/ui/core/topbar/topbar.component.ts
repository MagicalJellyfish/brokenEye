import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { DiscordUidEditDialog } from '../discord-uid-edit/discord-uid-edit.dialog';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';

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
    private snackBar: MatSnackBar,
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
    this.matDialog.open(DiscordUidEditDialog);
  }
}
