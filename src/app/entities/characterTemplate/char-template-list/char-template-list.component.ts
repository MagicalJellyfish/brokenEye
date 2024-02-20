import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CharacterTemplate } from 'src/app/api-classes/Characters/CharacterTemplate';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-char-template-list',
  templateUrl: './char-template-list.component.html',
  styleUrls: ['./char-template-list.component.scss', '../../char-list-shared.scss']
})
export class CharTemplateListComponent implements OnInit {

  constructor(private router: Router, private requestService: RequestService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {

    (await this.requestService.getAll(this.requestService.routes.characterTemplate)).subscribe((x: any) => {
      this.charTemplates = x
      
      x.forEach((c: CharacterTemplate) => {
        var charCodeString: string = ""
        for(var i = 0; i < c.image.length; i++) {
          charCodeString += String.fromCharCode(c.image[i])
        }
        this.charTemplateImages.push(btoa(charCodeString))
      });
    });
  }
  
  charTemplates?: CharacterTemplate[];
  charTemplateImages: string[] = []

  select(id: number) {
    this.router.navigate(["charTemplate/view/" + id])
  }
}
