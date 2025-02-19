import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingStateService {
  constructor() {}

  loading = signal(false);
  loadingRequests: string[] = [];

  public setLoading(url: string) {
    this.loadingRequests.push(url);

    if (!this.loading()) {
      this.loading.set(true);
    }
  }

  public unsetLoading(url: string) {
    this.loadingRequests = this.loadingRequests.filter((x) => x != url);

    if (this.loading() && this.loadingRequests.length == 0) {
      this.loading.set(false);
    }
  }
}
