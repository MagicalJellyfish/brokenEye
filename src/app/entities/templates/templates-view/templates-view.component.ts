import { Component } from '@angular/core';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-templates-view',
  templateUrl: './templates-view.component.html',
  styleUrls: ['./templates-view.component.scss'],
})
export class TemplatesViewComponent {
  constructor(protected requestService: RequestService) {}
}
