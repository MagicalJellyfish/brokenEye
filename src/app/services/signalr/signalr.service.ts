import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ApiUrlService } from '../api/apiUrl/api-url.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  hubConnection: HubConnection;

  constructor(
    private apiUrlService: ApiUrlService,
    private userService: UserService
  ) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrlService.apiUrl + '/signalr', {
        accessTokenFactory: () => this.userService.accessToken!,
      })
      .build();
  }

  registrations: string[] = [];

  async RegisterForCharChange(id: number, func: () => void) {
    if (this.hubConnection.state != HubConnectionState.Connected) {
      await this.hubConnection!.start();
    }

    this.hubConnection.invoke('RegisterForCharChange', id);
    this.hubConnection.on('charChanged/' + id, func);

    this.registrations.push('charChanged/' + id);
  }

  UnregisterFromCharChange(id: number) {
    if (this.hubConnection.state != HubConnectionState.Connected) {
      this.registrations = [];
      return;
    }

    this.registrations = this.registrations.filter(
      (x) => x != 'charChanged/' + id
    );

    if (this.registrations.length == 0) {
      this.hubConnection.stop();
      return;
    }

    this.hubConnection.invoke('UnregisterFromCharChange', id);
    this.hubConnection.off('charChanged/' + id);
  }
}
