import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { error } from 'console';
import { UserService } from 'src/app/services/user/user.service';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTabGroup,
    MatTab,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatIcon,
    MatButton,
  ],
})
export class AccountComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  username: string = '';
  password: string = '';
  discordId: string = '';
  registrationToken: string = '';
  loginErrorMsg: string = '';
  registerErrorMsg: string = '';

  hidePassword = true;

  async login() {
    if (await this.userService.getTokens(this.username, this.password)) {
      window.history.back();
      this.snackBar.open('Logged in!', undefined, { duration: 2000 });
    } else {
      this.password = '';
      this.loginErrorMsg = 'Username or Password is incorrect!';
    }
  }

  async register() {
    if (
      await this.userService.register(
        this.username,
        this.password,
        +this.discordId,
        this.registrationToken
      )
    ) {
      window.history.back();
      this.snackBar.open('Registered and logged in!', undefined, {
        duration: 2000,
      });
    } else {
      this.registerErrorMsg = 'Something went wrong!';
    }
  }
}
