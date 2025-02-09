import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { Character } from 'src/app/api-classes/Characters/Character';
import { SignalrService } from 'src/app/services/signalr/signalr.service';
import { Title } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MiscInfoCardComponent } from './cards/misc-info-card/misc-info-card.component';
import { StatsCardComponent } from './cards/stats-card/stats-card.component';
import { LargeCardComponent } from './cards/large-card/large-card.component';
import { HpCardComponent } from './cards/hp-card/hp-card.component';
import { MiscCharCardComponent } from './cards/misc-char-card/misc-char-card.component';

@Component({
  selector: 'app-char-view',
  templateUrl: './char-view.component.html',
  styleUrls: ['./char-view.component.scss'],
  imports: [
    NgIf,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatProgressSpinner,
    MiscInfoCardComponent,
    StatsCardComponent,
    LargeCardComponent,
    HpCardComponent,
    MiscCharCardComponent,
  ],
})
export class CharViewComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private signalrService: SignalrService,
    private title: Title
  ) {}

  async ngOnInit(): Promise<void> {
    (
      await this.requestService.get(
        this.requestService.routes.character,
        +this.route.snapshot.paramMap.get('id')!
      )
    ).subscribe((x: any) => {
      this.char = x;
      this.title.setTitle(this.char!.name);
    });

    this.signalrService.RegisterForCharChange(
      +this.route.snapshot.paramMap.get('id')!,
      () => {
        this.lastUpdate = new Date();
        setTimeout(async () => {
          if (!(this.lastUpdate.getTime() + 49 > new Date().getTime())) {
            (
              await this.requestService.get(
                this.requestService.routes.character,
                +this.route.snapshot.paramMap.get('id')!
              )
            ).subscribe((x: any) => {
              console.log('Server indicated change - reloading!');
              this.char = x;
              this.pcSubject.next(x);
              this.title.setTitle(this.char!.name);
            });
          }
        }, 50);
      }
    );
  }

  lastUpdate: Date = new Date();

  char?: Character;
  pcSubject: Subject<Character> = new Subject();

  ngOnDestroy() {
    this.title.setTitle('BrokenEye');
    this.signalrService.UnregisterFromCharChange(
      +this.route.snapshot.paramMap.get('id')!
    );
  }
}
