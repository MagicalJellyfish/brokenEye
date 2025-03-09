import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DiscordUidEditApiService {
  constructor(private http: HttpClient) {}

  getDiscordUid() {
    return this.http.get<string>('brokenHeart:/Auth/discord');
  }

  updateDiscordUid(discordId: string) {
    return this.http.put<unknown>('brokenHeart:/Auth/discord', {
      discordId: discordId,
    });
  }
}
