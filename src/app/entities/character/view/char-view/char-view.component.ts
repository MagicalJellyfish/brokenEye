import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { Character } from 'src/app/api-classes/Characters/Character';
import { SignalrService } from 'src/app/services/signalr/signalr.service';

@Component({
  selector: 'app-char-view',
  templateUrl: './char-view.component.html',
  styleUrls: ['./char-view.component.scss'],
})
export class CharViewComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private signalrService: SignalrService
  ) {}

  async ngOnInit(): Promise<void> {
    (
      await this.requestService.get(
        this.requestService.routes.character,
        +this.route.snapshot.paramMap.get('id')!
      )
    ).subscribe((x: any) => {
      this.char = x;
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
    this.signalrService.UnregisterFromCharChange(
      +this.route.snapshot.paramMap.get('id')!
    );
  }
}
