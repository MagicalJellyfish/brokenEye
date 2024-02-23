import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { error } from 'console';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar) {

  }

  username: string = ""
  password: string = ""
  discordId: string = ""
  registrationToken: string = ""
  loginErrorMsg: string = ""
  registerErrorMsg: string = ""

  hidePassword = true;

  async login() {
    if(await this.userService.getTokens(this.username, this.password)) {
      window.history.back();
      this.snackBar.open("Logged in!", undefined, {duration: 2000}) 
    }
    else {
      this.password = "";
      this.loginErrorMsg = "Username or Password is incorrect!"
    }
  }

  async register() {
    if(await this.userService.register(this.username, this.password, +this.discordId, this.registrationToken)) {
      window.history.back();
      this.snackBar.open("Registered and logged in!", undefined, {duration: 2000})
    }
    else {
      this.registerErrorMsg = "Something went wrong!"
    }
  }
}
