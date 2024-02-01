import { Injectable } from '@angular/core';
import { send } from 'process';
import { Observable, Subject, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket!: WebSocket
  public messageReceived: Subject<string> = new Subject<string>();

  constructor() { }

  connect(): Observable<any> {
    let subject = new Subject<any>()
    this.socket = new WebSocket('wss://localhost:7029/api/Characters/ws')

    this.socket.onopen = () => {
      console.log('WebSocket connection established.')
      subject.next(true)
    };

    this.socket.onmessage = (event) => {
      this.messageReceived.next(event.data)
      console.log('Server indicated change!')
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event)
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    };

    return subject
  }

  sendMessage(message: string): void {
    this.socket.send(message)
  }

  closeConnection(): void {
    this.socket.close()
    this.messageReceived = new Subject<string>()
  }
}
