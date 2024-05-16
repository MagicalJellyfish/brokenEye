import { Component, Input, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-large-card',
  templateUrl: './large-card.component.html',
  styleUrls: ['./large-card.component.scss'],
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

    this.moneyDebounce.subscribe((_) => (this.moneyDebouncing = true));
    this.moneyDebounce
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((_) => {
        this.updateMoney();
      });
  }

  update() {
    if (!this.moneyDebouncing) {
      this.money = this.char.money;
    }
  }

  moneyDebounce = new Subject<string>();
  moneyDebouncing = false;
  money = 0;

  async updateMoney() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.char.id,
        JSON.stringify({
          money: this.money,
        }),
      )
    ).subscribe();
    this.moneyDebouncing = false;
  }
}

export interface NestedElement {
  source: string;
  element: any;
}
