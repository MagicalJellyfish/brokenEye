import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { StatValue } from 'src/app/api-classes/Stats/StatValue';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { SignalrService } from 'src/app/services/signalr/signalr.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class StatsCardComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private signalrService: SignalrService
  ) {}

  @Input() pcSubject!: Subject<Character>;
  @Input() char!: Character;

  ngOnInit(): void {
    this.update();

    this.pcSubject.subscribe((x) => {
      this.char = x;
      this.update();
    });

    this.experienceDebounce.subscribe(
      (_) => (this.experienceDebouncing = true)
    );
    this.experienceDebounce
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((_) => {
        this.updateExperience();
      });
  }

  update() {
    this.char.stats.sort(function (a, b) {
      return a.statId! - b.statId!;
    });
    this.statTable = new MatTableDataSource(this.char.stats);

    if (!this.experienceDebouncing) {
      this.experience = this.char.experience;
    }
  }

  experience = '';
  experienceDebounce = new Subject<string>();
  experienceDebouncing = false;

  mainTableCols: string[] = ['name', 'value'];

  stats: StatValue[] = [];
  statTable = new MatTableDataSource<StatValue>(this.stats);

  async updateExperience() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.char.id,
        JSON.stringify({
          experience: this.experience,
        })
      )
    ).subscribe();
    this.experienceDebouncing = false;
  }

  async rollStat(statId: number) {
    (await this.requestService.getAll('Auth/discord')).subscribe((x: any) =>
      this.signalrService.RollStat(this.char.id, statId, x.discordId)
    );
  }
}
