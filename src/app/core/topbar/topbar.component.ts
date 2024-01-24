import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(protected userService: UserService, private matDialog: MatDialog, 
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  openSettings() {
    this.matDialog.open(SettingsDialogComponent);
  }

  logout() {
    this.userService.logout();
    this.snackBar.open("Logged out!", undefined, {duration: 2000})
  }
}
