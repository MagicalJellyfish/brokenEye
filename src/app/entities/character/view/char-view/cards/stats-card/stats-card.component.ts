import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { Subject } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { StatValue } from 'src/app/api-classes/Stats/StatValue';
import { Debouncer } from 'src/app/logic/core/debouncer/debouncer';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { SignalrService } from 'src/app/services/signalr/signalr.service';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatCellDef,
    MatCell,
    MatRowDef,
    MatRow,
    MatFormField,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    FormsModule,
  ],
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

    this.experienceDebouncer.SaveSubject.subscribe(() =>
      this.updateExperience()
    );
  }

  update() {
    this.char.stats.sort(function (a, b) {
      return a.statId! - b.statId!;
    });
    this.statTable = new MatTableDataSource(this.char.stats);

    if (!this.experienceDebouncer.Debouncing) {
      this.experience = this.char.experience;
    }
  }

  experience = '';
  experienceDebouncer = new Debouncer<void>();

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
  }

  async rollStat(statId: number) {
    (await this.requestService.getAll('Auth/discord')).subscribe((x: any) =>
      this.signalrService.RollStat(this.char.id, statId, x.discordId)
    );
  }
}
