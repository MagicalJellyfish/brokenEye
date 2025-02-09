import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-char-template-create',
  templateUrl: './char-template-create.component.html',
  styleUrls: ['./char-template-create.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatProgressSpinner,
  ],
})
export class CharTemplateCreateComponent implements OnInit {
  constructor(
    private router: Router,
    private objectService: ObjectService,
    private requestService: RequestService
  ) {}

  async ngOnInit(): Promise<void> {
    (
      await this.requestService.create(
        this.requestService.routes.characterTemplate,
        this.objectService.newCharacterTemplate()
      )
    ).subscribe((x: any) => {
      this.router.navigate(['charTemplate/view/' + x.id]);
    });
  }
}
