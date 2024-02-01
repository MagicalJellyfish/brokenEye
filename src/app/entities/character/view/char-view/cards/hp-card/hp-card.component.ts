import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { Counter } from 'src/app/api-classes/Counters/Counter';
import { Effect } from 'src/app/api-classes/Effects/Effect';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-hp-card',
  templateUrl: './hp-card.component.html',
  styleUrls: ['./hp-card.component.scss']
})
export class HpCardComponent implements OnInit {

  constructor(private requestService: RequestService, private objectService: ObjectService) { }

  @Input() pcSubject!: Subject<Character>
  @Input() char!: Character

  effectsTableCols: string[] = ['name', 'hp']
  dyingTableCols: string[] = ['checkbox']

  effects: Effect[] = []
  effectsTable = new MatTableDataSource<Effect>(this.effects)
  dyingTable = new MatTableDataSource<string>()
  effectHpImpact = 0

  defense?: number

  hp = 0
  hpDebounce = new Subject<string>();
  hpDebouncing = false
  tempHp = 0
  tempHpDebounce = new Subject<string>();
  tempHpDebouncing = false

  deathCounter!: Counter
  dying: boolean[] = [/*false, false, false*/]
  disabled: boolean[] = [/*false, true, true*/]

  ngOnInit(): void {
    this.update()

    this.pcSubject.subscribe(x => {
      this.char = x
      this.update()
    })

    this.hpDebounce.subscribe(_ => this.hpDebouncing = true)
    this.hpDebounce.pipe(
      debounceTime(2000),
      distinctUntilChanged())
      .subscribe(_ => {
        this.updateHp()
      });

    this.tempHpDebounce.subscribe(_ => this.tempHpDebouncing = true)
    this.tempHpDebounce.pipe(
      debounceTime(2000),
      distinctUntilChanged())
      .subscribe(_ => {
        this.updateTempHp()
      });
  }

  update() {
    this.defense = this.char.armor + this.char.evasion
    
    if(!this.hpDebouncing) {
      this.hp = this.char.hp
    }
    if(!this.tempHpDebouncing) {
      this.tempHp = this.char.tempHp
    }

    this.effectsTable = new MatTableDataSource(this.char.effects.filter(x => x.hp != ''))

    var hpImpacts: number[] = []
    //TODO: Calculate total: hpImpacts = this.char.effects.map(function(x){return x.hp})

    if(hpImpacts.length != 0) {
      this.effectHpImpact = hpImpacts.reduce((x,y) => x + y)
    }

    this.deathCounter = this.char.counters.filter(x => x.name == "Dying").at(0)!

    var tableLength = []
    if(this.deathCounter) {
      for(let i = 0; i < this.deathCounter.max; i++) {
        this.dying.push(false)
        tableLength.push('')
      }
    }

    this.dyingTable = new MatTableDataSource(tableLength)

    if(this.deathCounter) {
      for(let i = this.deathCounter.value; i > 0; i--) {
        this.dying[i - 1] = true
      }
      
      this.check()
    }

    //TODO: how are injuryLevels assigned? Effect determines level or lever applies effects?
    this.char.bodypartConditions.forEach(condition => {
      this.injuries[this.bodypartIdTable[condition.bodypartId] as keyof typeof this.injuries] = condition.injuryLevel
    });
  }

  bodypartIdTable: Record<number, string> = {
    1: "head",
    2: "torso",
    3: "armRight",
    4: "armLeft",
    5: "legRight",
    6: "legLeft"
  }

  injuries = {
    head: 0,
    torso: 0,
    armRight: 0,
    armLeft: 0,
    legRight: 0,
    legLeft: 0,
  }

  bodypartColor(num:number) {
    switch(num) {
      case 0: 
        return "healthy"
      case 1: 
        return "minorInjury"
      case 2: 
        return "mediumInjury"
      case 3: 
        return "majorInjury"
      case 4:
        return "dismembered"
      default:
        return "healthy"
    }
  }

  async updateHp() {
    (await this.requestService.patch(this.requestService.routes.character, this.char.id, JSON.stringify({
      "hp": this.hp
    }))).subscribe()
    this.hpDebouncing = false
  }

  async updateTempHp() {
    (await this.requestService.patch(this.requestService.routes.character, this.char.id, JSON.stringify({
      "tempHp": this.tempHp
    }))).subscribe()
    this.tempHpDebouncing = false
  }

  async check() {
    var previousValue = this.deathCounter.value

    for(let i = this.dying.length; i > -1; i--) {
      if(!this.dying[i]) {
        this.deathCounter.value = i

        if((i+1) < this.dying.length) {
          this.disabled[i+1] = true
          this.dying[i+1] = false
        }
      }

      if(this.dying[i]) {
        if((i+1) < this.dying.length) {
          this.disabled[i+1] = false
        }
      }
    }

    if(previousValue != this.deathCounter.value && this.deathCounter.id != undefined) {
      (await this.requestService.patch(this.requestService.routes.counter, this.deathCounter.id, JSON.stringify({
        "value": this.deathCounter.value
      }))).subscribe()
    }
  }
}
