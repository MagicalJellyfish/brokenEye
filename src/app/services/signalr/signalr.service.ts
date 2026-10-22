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
    private snackBar: MatSnackBar,
  ) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrlService.url() + '/signalr', {
        accessTokenFactory: () => this.getAccessToken(),
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('error', (message: string) =>
      this.snackBar.open('Websocket Error - ' + message, 'Close', {
        duration: 60000,
      }),
    );

    // A reconnect gets a new connection id, which is in none of the old groups
    this.hubConnection.onreconnected(() => {
      for (const id of this.registrations) {
        this.hubConnection.invoke('RegisterForCharChange', id);
      }
    });
  }

  registrations: number[] = [];
  private startPromise: Promise<void> | null = null;
  private stopPromise: Promise<void> | null = null;

  // Tokens may have been rotated by another tab or be expired; never connect with a stale one
  private async getAccessToken(): Promise<string> {
    const expiration = this.userService.accessTokenExpiration;
    if (expiration != null && expiration < new Date()) {
      await this.userService.refreshTokens(this.userService.accessToken);
    }
    return this.userService.accessToken!;
  }

  async StartConnection() {
    // Leaving one character for another may stop the connection right before restarting it
    await this.stopPromise;

    if (this.hubConnection.state == HubConnectionState.Connected) {
      return;
    }

    // Several components may register at once; only start the connection once
    if (this.startPromise == null) {
      this.startPromise = this.hubConnection
        .start()
        .finally(() => (this.startPromise = null));
    }
    await this.startPromise;
  }

  async RegisterForCharChange(id: number, func: () => void) {
    await this.StartConnection();

    this.hubConnection.invoke('RegisterForCharChange', id);
    this.hubConnection.off('charChanged/' + id);
    this.hubConnection.on('charChanged/' + id, func);

    this.registrations.push(id);
  }

  UnregisterFromCharChange(id: number) {
    this.registrations = this.registrations.filter((x) => x != id);
    this.hubConnection.off('charChanged/' + id);

    if (this.hubConnection.state != HubConnectionState.Connected) {
      return;
    }

    if (this.registrations.length == 0) {
      this.stopPromise = this.hubConnection
        .stop()
        .finally(() => (this.stopPromise = null));
      return;
    }

    this.hubConnection.invoke('UnregisterFromCharChange', id);
  }

  RollStat(charId: number, statId: number) {
    this.hubConnection.invoke('RollStat', charId, statId);
  }
}
