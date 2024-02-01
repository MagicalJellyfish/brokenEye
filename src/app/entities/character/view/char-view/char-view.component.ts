import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { WebsocketService } from 'src/app/services/api/websocket/websocket.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { HpCardComponent } from './cards/hp-card/hp-card.component';
import { Character } from 'src/app/api-classes/Characters/Character';

@Component({
  selector: 'app-char-view',
  templateUrl: './char-view.component.html',
  styleUrls: ['./char-view.component.scss']
})

export class CharViewComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private webSocketService: WebsocketService, 
    private requestService: RequestService) { }

  async ngOnInit(): Promise<void> {
    (await this.requestService.get(this.requestService.routes.character, +this.route.snapshot.paramMap.get('id')!)).subscribe((x: any) => {
      this.char = x
    })
    
    this.webSocketService.connect().subscribe(_ => this.webSocketService.sendMessage(this.route.snapshot.paramMap.get('id')!))
    
    this.webSocketService.messageReceived.subscribe(async _ => {
      this.lastUpdate = new Date();
      setTimeout(async () => {
        if(!((this.lastUpdate.getTime() + 49) > new Date().getTime())) {
          (await this.requestService.get(this.requestService.routes.character, +this.route.snapshot.paramMap.get('id')!)).subscribe((x: any) => {
            console.log("Reloading")
            this.char = x
            this.pcSubject.next(x)
          })
        }
      }, 50);
    })
  }

  lastUpdate: Date = new Date();

  char?: Character;
  pcSubject: Subject<Character> = new Subject()

  ngOnDestroy() {
    this.webSocketService.closeConnection()
  }
}
