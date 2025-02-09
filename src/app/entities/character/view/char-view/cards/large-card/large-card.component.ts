import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { Debouncer } from 'src/app/core/debouncer/debouncer';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ElementTabComponent } from '../../../../../elements/element-tab/element-tab.component';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-large-card',
  templateUrl: './large-card.component.html',
  styleUrls: ['./large-card.component.scss'],
  imports: [
    MatCard,
    MatCardContent,
    MatTabGroup,
    MatTab,
    ElementTabComponent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatSuffix,
  ],
})
export class LargeCardComponent implements OnInit {
  constructor(protected requestService: RequestService) {}

  @Input() pcSubject!: Subject<Character>;
  @Input() char!: Character;

  ngOnInit(): void {
    this.update();

    this.pcSubject.subscribe((x) => {
      this.char = x;
      this.update();
    });

    this.moneyDebouncer.SaveSubject.subscribe(() => this.updateMoney());
    this.cDebouncer.SaveSubject.subscribe(() => this.updateC());
  }

  update() {
    if (!this.moneyDebouncer.Debouncing) {
      this.money = this.char.money;
    }

    if (!this.cDebouncer.Debouncing) {
      this.c = this.char.c;
    }
  }

  money = 0;
  moneyDebouncer = new Debouncer<void>();

  c = 0;
  cDebouncer = new Debouncer<void>();

  async updateMoney() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.char.id,
        JSON.stringify({
          money: this.money,
        })
      )
    ).subscribe();
  }

  async updateC() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.char.id,
        JSON.stringify({
          c: this.c,
        })
      )
    ).subscribe();
  }
}

export interface NestedElement {
  source: string;
  element: any;
}
