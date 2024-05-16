import { Injectable } from '@angular/core';
import { send } from 'process';
import { Observable, Subject, observable } from 'rxjs';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public socket!: WebSocket;
  public messageReceived: Subject<string> = new Subject<string>();

  constructor(private apiUrlService: ApiUrlService) {
    this.apiUrl = apiUrlService.apiUrl + '/ws/Character';
  }

  apiUrl: string;

  connect(): Observable<any> {
    let subject = new Subject<any>();
    let websocketUrl: string = this.apiUrl.split('//')[1];
    this.socket = new WebSocket('wss://' + websocketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      subject.next(true);
    };

    this.socket.onmessage = (event) => {
      this.messageReceived.next(event.data);
      console.log('Server indicated change!');
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return subject;
  }

  sendMessage(message: string): void {
    this.socket.send(message);
  }

  closeConnection(): void {
    this.socket.close();
    this.messageReceived = new Subject<string>();
  }
}
