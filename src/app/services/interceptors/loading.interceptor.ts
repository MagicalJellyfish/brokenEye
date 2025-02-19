import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingStateService } from '../loading-state.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingStateService: LoadingStateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    this.loadingStateService.setLoading(request.url);

    return next.handle(request).pipe(
      finalize(() => {
        this.loadingStateService.unsetLoading(request.url);
      })
    );
  }
}
