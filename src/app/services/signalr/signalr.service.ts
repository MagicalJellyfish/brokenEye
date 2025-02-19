import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrlService.url() + '/signalr', {
        accessTokenFactory: () => this.userService.accessToken!,
      })
      .build();
  }

  registrations: string[] = [];

  async StartConnection() {
    await this.hubConnection!.start();
    this.hubConnection.on('error', (message: string) =>
      this.snackBar.open('Websocket Error - ' + message, 'Close', {
        duration: 60000,
      })
    );
  }

  async RegisterForCharChange(id: number, func: () => void) {
    if (this.hubConnection.state != HubConnectionState.Connected) {
      await this.StartConnection();
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

  RollStat(charId: number, statId: number, discordId: string) {
    this.hubConnection.invoke('RollStat', charId, statId, discordId);
  }
}
