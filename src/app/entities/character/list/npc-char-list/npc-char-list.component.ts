import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from 'src/app/api-classes/Characters/Character';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { UserService } from 'src/app/services/user/user.service';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-npc-char-list',
  templateUrl: './npc-char-list.component.html',
  styleUrls: [
    './npc-char-list.component.scss',
    '../../../char-list-shared.scss',
  ],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    NgIf,
    MatGridList,
    NgFor,
    MatGridTile,
    MatButton,
    MatIcon,
  ],
})
export class NpcCharListComponent implements OnInit {
  constructor(
    private router: Router,
    private requestService: RequestService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    (
      await this.requestService.getAll(
        this.requestService.routes.character + '/NPC'
      )
    ).subscribe((x: any) => {
      this.npcs = x;

      x.forEach((c: Character) => {
        var charCodeString: string = '';
        for (var i = 0; i < c.image.bytes.length; i++) {
          charCodeString += String.fromCharCode(c.image.bytes[i]);
        }
        this.npcImages.push(btoa(charCodeString));
      });
    });
  }

  npcs?: Character[];
  npcImages: string[] = [];

  select(id: number) {
    this.router.navigate(['char/view/' + id]);
  }
}
