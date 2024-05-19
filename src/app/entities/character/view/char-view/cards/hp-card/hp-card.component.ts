import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { Counter } from 'src/app/api-classes/Counters/Counter';
import { Effect } from 'src/app/api-classes/Effects/Effect';
import { Debouncer } from 'src/app/core/debouncer/debouncer';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-hp-card',
  templateUrl: './hp-card.component.html',
  styleUrls: ['./hp-card.component.scss'],
})
export class HpCardComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private objectService: ObjectService
  ) {}

  @Input() pcSubject!: Subject<Character>;
  @Input() char!: Character;

  effectsTableCols: string[] = ['name', 'hp'];
  dyingTableCols: string[] = ['checkbox'];

  effects: Effect[] = [];
  effectsTable = new MatTableDataSource<Effect>(this.effects);
  dyingTable = new MatTableDataSource<string>();
  effectHpImpact = 0;

  defense?: number;

  hp = 0;
  hpDebouncer = new Debouncer<void>();

  tempHp = 0;
  tempHpDebouncer = new Debouncer<void>();

  injuryDebouncer = new Debouncer<void>();

  deathCounter!: Counter;
  dying: boolean[] = [];
  disabled: boolean[] = [];

  ngOnInit(): void {
    this.update();

    this.pcSubject.subscribe((x) => {
      this.char = x;
      this.update();
    });

    this.hpDebouncer.SaveSubject.subscribe(() => this.updateHp());
    this.tempHpDebouncer.SaveSubject.subscribe(() => this.updateTempHp());

    this.injuryDebouncer.SaveSubject.subscribe(() => this.updateInjuries());
  }

  update() {
    this.defense = this.char.armor + this.char.evasion;

    if (!this.hpDebouncer.Debouncing) {
      this.hp = this.char.hp;
    }
    if (!this.tempHpDebouncer.Debouncing) {
      this.tempHp = this.char.tempHp;
    }

    if (!this.injuryDebouncer.Debouncing) {
      this.char.bodypartConditions.forEach((condition) => {
        this.injuries[
          this.bodypartIdTable[
            condition.bodypartId
          ] as keyof typeof this.injuries
        ] = condition.injuryLevel;
      });
    }

    this.effectsTable = new MatTableDataSource(
      this.char.effects.filter((x) => x.hp != '')
    );

    this.deathCounter = this.char.counters
      .filter((x) => x.name == 'Dying')
      .at(0)!;

    var tableLength = [];
    if (this.deathCounter) {
      for (let i = 0; i < this.deathCounter.max; i++) {
        this.dying.push(false);
        tableLength.push('');
      }
    }

    this.dyingTable = new MatTableDataSource(tableLength);

    if (this.deathCounter) {
      for (let i = this.deathCounter.value; i > 0; i--) {
        this.dying[i - 1] = true;
      }

      this.check();
    }
  }

  bodypartIdTable: Record<number, string> = {
    1: 'head',
    2: 'torso',
    3: 'armRight',
    4: 'armLeft',
    5: 'legRight',
    6: 'legLeft',
  };

  injuries = {
    head: 0,
    torso: 0,
    armRight: 0,
    armLeft: 0,
    legRight: 0,
    legLeft: 0,
  };

  bodypartColor(num: number) {
    switch (num) {
      case 0:
        return 'healthy';
      case 1:
        return 'minorInjury';
      case 2:
        return 'mediumInjury';
      case 3:
        return 'majorInjury';
      case 4:
        return 'dismembered';
      default:
        return 'healthy';
    }
  }

  async updateHp() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.char.id,
        JSON.stringify({
          hp: this.hp,
        })
      )
    ).subscribe();
  }

  async updateTempHp() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.char.id,
        JSON.stringify({
          tempHp: this.tempHp,
        })
      )
    ).subscribe();
  }

  async updateInjuries() {
    (
      await this.requestService.patch(
        this.requestService.routes.character + '/Bodyparts',
        this.char.id,
        JSON.stringify({
          1: this.injuries.head,
          2: this.injuries.torso,
          3: this.injuries.armRight,
          4: this.injuries.armLeft,
          5: this.injuries.legRight,
          6: this.injuries.legLeft,
        })
      )
    ).subscribe();
  }

  async check() {
    var previousValue = this.deathCounter.value;

    for (let i = this.dying.length; i > -1; i--) {
      if (!this.dying[i]) {
        this.deathCounter.value = i;

        if (i + 1 < this.dying.length) {
          this.disabled[i + 1] = true;
          this.dying[i + 1] = false;
        }
      }

      if (this.dying[i]) {
        if (i + 1 < this.dying.length) {
          this.disabled[i + 1] = false;
        }
      }
    }

    if (
      previousValue != this.deathCounter.value &&
      this.deathCounter.id != undefined
    ) {
      (
        await this.requestService.patch(
          this.requestService.routes.counter,
          this.deathCounter.id,
          JSON.stringify({
            value: this.deathCounter.value,
          })
        )
      ).subscribe();
    }
  }

  headLC() {
    this.injuries.head = this.increaseInjury(this.injuries.head);
    this.injuryDebouncer.InputSubject.next();
  }
  headRC(event: any) {
    event.preventDefault();
    this.injuries.head = this.decreaseInjury(this.injuries.head);
    this.injuryDebouncer.InputSubject.next();
  }

  torsoLC() {
    this.injuries.torso = this.increaseInjury(this.injuries.torso);
    this.injuryDebouncer.InputSubject.next();
  }
  torsoRC(event: any) {
    event.preventDefault();
    this.injuries.torso = this.decreaseInjury(this.injuries.torso);
    this.injuryDebouncer.InputSubject.next();
  }

  lArmLC() {
    this.injuries.armLeft = this.increaseInjury(this.injuries.armLeft);
    this.injuryDebouncer.InputSubject.next();
  }
  lArmRC(event: any) {
    event.preventDefault();
    this.injuries.armLeft = this.decreaseInjury(this.injuries.armLeft);
    this.injuryDebouncer.InputSubject.next();
  }

  rArmLC() {
    this.injuries.armRight = this.increaseInjury(this.injuries.armRight);
    this.injuryDebouncer.InputSubject.next();
  }
  rArmRC(event: any) {
    event.preventDefault();
    this.injuries.armRight = this.decreaseInjury(this.injuries.armRight);
    this.injuryDebouncer.InputSubject.next();
  }

  lLegLC() {
    this.injuries.legLeft = this.increaseInjury(this.injuries.legLeft);
    this.injuryDebouncer.InputSubject.next();
  }
  lLegRC(event: any) {
    event.preventDefault();
    this.injuries.legLeft = this.decreaseInjury(this.injuries.legLeft);
    this.injuryDebouncer.InputSubject.next();
  }

  rLegLC() {
    this.injuries.legRight = this.increaseInjury(this.injuries.legRight);
    this.injuryDebouncer.InputSubject.next();
  }
  rLegRC(event: any) {
    event.preventDefault();
    this.injuries.legRight = this.decreaseInjury(this.injuries.legRight);
    this.injuryDebouncer.InputSubject.next();
  }

  increaseInjury(injuryLevel: number) {
    if (injuryLevel >= 4) {
      return 0;
    } else {
      return (injuryLevel += 1);
    }
  }

  decreaseInjury(injuryLevel: number) {
    if (injuryLevel <= 0) {
      return 4;
    } else {
      return (injuryLevel -= 1);
    }
  }
}
