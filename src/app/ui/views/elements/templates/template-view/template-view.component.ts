import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ElementList } from 'src/app/models/elements/ElementList';
import { TemplateTabComponent } from 'src/app/ui/parts/element/template-tab/template-tab.component';
import { TemplateApiService } from '../template.api-service';

@Component({
  selector: 'character-element-tab',
  templateUrl: './template-view.component.html',
  styleUrls: ['./template-view.component.scss'],
  imports: [FormsModule, MatCardModule, MatTabsModule, TemplateTabComponent],
})
export class TemplateViewComponent {
  constructor(private apiService: TemplateApiService) {
    this.getTemplateView();
  }

  getTemplateView() {
    this.apiService.getTemplateView().subscribe((x) => (this.elementLists = x));
  }

  elementLists: ElementList[] = [];
}
