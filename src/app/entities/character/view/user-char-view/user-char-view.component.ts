import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from 'src/app/api-classes/Characters/Character';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-char-view',
  templateUrl: './user-char-view.component.html',
  styleUrls: ['./user-char-view.component.scss']
})
export class UserCharViewComponent implements OnInit {

  constructor(private router: Router, private requestService: RequestService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    (await this.requestService.get(this.requestService.routes.character + "/User", this.userService.username)).subscribe((x: any) => {
      this.userChars = x
      
      x.forEach((c: Character) => {
        var charCodeString: string = ""
        for(var i = 0; i < c.image.length; i++) {
          charCodeString += String.fromCharCode(c.image[i])
        }
        this.userCharImages.push(btoa(charCodeString))
      });
    });

    (await this.requestService.getAll(this.requestService.routes.character)).subscribe((x: any) => {
      this.allChars = x
      
      x.forEach((c: Character) => {
        var charCodeString: string = ""
        for(var i = 0; i < c.image.length; i++) {
          charCodeString += String.fromCharCode(c.image[i])
        }
        this.allCharImages.push(btoa(charCodeString))
      });
    });
  }

  userChars?: Character[];
  allChars?: Character[];
  userCharImages: string[] = []
  allCharImages: string[] = []

  select(id: number) {
    this.router.navigate(["char/view/" + id])
  }

}
