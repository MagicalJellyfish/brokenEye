import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from '../api/apiUrl/api-url.service';

@Injectable()
export class UrlReplacementInterceptor implements HttpInterceptor {
  private readonly brokenHeartPrefix = 'brokenHeart:';
  private readonly brokenHeartAuthPrefix = 'brokenAuth:';

  constructor(private apiUrlService: ApiUrlService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    let newUrl;

    if (request.url.startsWith(this.brokenHeartPrefix)) {
      newUrl =
        this.apiUrlService.url() +
        request.url.slice(this.brokenHeartPrefix.length);
    } else if (request.url.startsWith(this.brokenHeartAuthPrefix)) {
      newUrl =
        this.apiUrlService.url() +
        '/Auth' +
        request.url.slice(this.brokenHeartAuthPrefix.length);
    }

    if (newUrl != undefined) {
      request = request.clone({ url: newUrl });
    }

    return next.handle(request);
  }
}
