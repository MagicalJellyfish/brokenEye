import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-char-template-create',
  templateUrl: './char-template-create.component.html',
  styleUrls: ['./char-template-create.component.scss']
})
export class CharTemplateCreateComponent implements OnInit {
  constructor(private router: Router, private objectService: ObjectService, private requestService: RequestService) { }

  async ngOnInit(): Promise<void> {
    (await this.requestService.create(this.requestService.routes.characterTemplate, this.objectService.newCharacterTemplate())).subscribe((x: any) => {
      this.router.navigate(["charTemplate/view/" + x.id])
    })
  }
}
