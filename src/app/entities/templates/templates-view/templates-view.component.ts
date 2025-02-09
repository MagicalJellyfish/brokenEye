import { Component } from '@angular/core';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { TemplatesViewTabComponent } from './templates-view-tab/templates-view-tab.component';

@Component({
  selector: 'app-templates-view',
  templateUrl: './templates-view.component.html',
  styleUrls: ['./templates-view.component.scss'],
  imports: [
    MatCard,
    MatCardContent,
    MatTabGroup,
    MatTab,
    TemplatesViewTabComponent,
  ],
})
export class TemplatesViewComponent {
  constructor(protected requestService: RequestService) {}
}
