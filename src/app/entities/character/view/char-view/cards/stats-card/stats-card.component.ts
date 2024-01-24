import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PlayerCharacter } from 'src/app/api-classes/Characters/PlayerCharacter';
import { StatValue } from 'src/app/api-classes/Stats/StatValue';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  constructor(private requestService: RequestService) { }

  @Input() pcSubject!: Subject<PlayerCharacter>
  @Input() char!: PlayerCharacter

  ngOnInit(): void {
    this.update()

    this.pcSubject.subscribe(x => {
      this.char = x 
      this.update()
    })

    this.experienceDebounce.subscribe(_ => this.experienceDebouncing = true)
    this.experienceDebounce.pipe(
      debounceTime(2000),
      distinctUntilChanged())
      .subscribe(_ => {
        this.updateExperience()
      });
  }

  update() {
    this.char.stats.sort(function(a, b){
      return a.statId! - b.statId!;
    })
    this.statTable = new MatTableDataSource(this.char.stats)

    if(!this.experienceDebouncing) {
      this.experience = this.char.experience
    }
  }

  experience = ""
  experienceDebounce = new Subject<string>();
  experienceDebouncing = false

  mainTableCols: string[] = ['name', 'value'];

  stats: StatValue[] = []
  statTable = new MatTableDataSource<StatValue>(this.stats);

  async updateExperience() {
    (await this.requestService.patch(this.requestService.routes.playerCharacter, this.char.id, JSON.stringify({
      "experience": this.experience
    }))).subscribe()
    this.experienceDebouncing = false
  }
}
