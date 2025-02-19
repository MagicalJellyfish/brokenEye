import { Component, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';

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
      this.router.navigate(['legacy/charTemplate/view/' + x.id]);
    });
  }
}
